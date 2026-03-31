"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { z } from "zod";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { deleteSession } from "./session";
import { redirect } from "next/navigation";
import { updateSessionCurrentChatUser, updateSessionPostCycle } from "./dal";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

// export const fetchCache = "force-no-store";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require", max: 40, idle_timeout: 10, max_lifetime: 60 });

export async function onPostLike(userID: number, postID: number) {
    await sql`
        WITH deleted AS (DELETE FROM liked_posts WHERE liked_posts.post = ${postID} AND liked_posts.user = ${userID} RETURNING *)
        INSERT INTO liked_posts SELECT ${userID} as user, ${postID} as post WHERE NOT EXISTS (SELECT 1 FROM deleted);
    `;

    revalidatePath("/app");
}

const commentSchema = z.object({
    userID: z.string(),
    postID: z.string(),
    content: z.string()
        .min(1, { message: "The comment must not be empty" })
        .trim()
});

export async function addPostComment(prevState: any, formData: FormData) {
    const userID = formData.get("user-id") as string;
    const postID = formData.get("post-id") as string;
    const content = formData.get("content") as string;
    const validatedFields = commentSchema.safeParse({ userID, postID, content });

    if (!validatedFields.success) {
        return { content, errors: z.flattenError(validatedFields.error).fieldErrors }
    }

    await sql`INSERT INTO comments (post, author, content) VALUES (${postID}, ${userID}, ${content})`;
    revalidatePath("/app");
    return { content }
}

export async function deleteComment(formData: FormData) {
    const commentID = formData.get("comment-id") as string;
    await sql`DELETE FROM comments WHERE id = ${commentID}`;
    revalidatePath("/app");
}

export async function authenticate(prevState: any, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) return error.message;
        throw error;
    }
}

export async function signOutUser(prevState: any, formData: FormData) {
    await deleteSession();
    redirect("/login");
}

const registerSchema = z.object({
    username: z.string()
        .min(3, { message: "The username must have at least 3 characters" })
        .trim(),
    email: z.email(),
    password: z.string()
        .min(8, { message: "The password must have at least 8 characters" })
        .trim()
});

export async function registerUser(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const verifiedData = registerSchema.safeParse({ username, email, password });

    if (!verifiedData.success) {
        return { errors: z.flattenError(verifiedData.error).fieldErrors }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (name, email, password) VALUES (${username}, ${email}, ${hashedPassword})`;

    redirect("/login");
}

export async function createDMChannel(user1ID: number, user2ID: number) {
    if (user1ID == user2ID || !user1ID || !user2ID) return;

    await sql`
        WITH selected AS (SELECT * FROM dm_channels WHERE (user1 = ${user1ID} AND user2 = ${user2ID}) OR (user1 = ${user2ID} AND user2 = ${user1ID}))
        INSERT INTO dm_channels (user1, user2) SELECT ${user1ID}, ${user2ID} WHERE NOT EXISTS (SELECT 1 FROM selected);
    `;
}

export async function sendDM(formData: FormData) {
    const content = formData.get("content") as string;
    const user1 = formData.get("user1") as string;
    const user2 = formData.get("user2") as string;
    if (user1 == user2) return;

    await sql`
        INSERT INTO messages (content, author, channel)
        VALUES (${content}, ${user1}, (SELECT id FROM dm_channels WHERE (user1 = ${user1} AND user2 = ${user2}) OR (user1 = ${user2} AND user2 = ${user1})));
    `;
}

export async function deleteDM(formData: FormData) {
    const messageID = formData.get("message-id") as string;
    const callbackURL = formData.get("callbackURL") as string;
    await sql`DELETE FROM messages WHERE id = ${messageID}`;
    revalidatePath(callbackURL);
}

export async function onSelectUserFromList(formData: FormData) {
    const userID = Number(formData.get("user-id"));
    await updateSessionCurrentChatUser(userID);
}

export async function onDMGoBack() {
    await updateSessionCurrentChatUser(null);
}

export async function loadMorePosts() {
    await updateSessionPostCycle();
    revalidatePath("/app");
}

export async function homePageSearch(query: string) {
    if (query.length < 1) return {};
    const fullQuery = `%${query.toLowerCase()}%`;
    const posts = await sql`SELECT id, title, created_at FROM posts WHERE LOWER(posts.title) LIKE ${fullQuery} ORDER BY created_at DESC LIMIT 5`;
    const users = await sql`SELECT id, name, has_profile_image FROM users WHERE LOWER(users.name) LIKE  ${fullQuery} LIMIT 5`;
    const communities = await sql`SELECT id, name, color, (SELECT COUNT(id) FROM posts WHERE posts.community = communities.id) as posts FROM communities WHERE LOWER(communities.name) LIKE  ${fullQuery} LIMIT 5`;
    return {
        posts: posts,
        users: users,
        communities: communities
    }
}

const postSchema = z.object({
    userID: z.int()
        .min(1, { message: "An internal exception has occurred. Please try again later." }),
    community: z.int(),
    title: z.string()
        .min(3, { message: "The post title must have at least 3 characters" })
        .trim(),
    content: z.string()
        .min(3, { message: "The post content must have at least 3 characters" })
        .trim()
});

export async function createPost(prevState: any, formData: FormData) {
    const userID = Number(formData.get("user-id"));
    const community = Number(formData.get("community"));
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;
    const hasImage = (image.size > 0);

    const verifiedData = postSchema.safeParse({
        userID, community, title, content
    });

    if (!verifiedData.success) {
        return z.flattenError(verifiedData.error).fieldErrors;
    }

    const postCommunity = (community == 0) ? null : community;
    const results = await sql`INSERT INTO posts (title, content, author, has_image, community) VALUES (${title}, ${content}, ${userID}, ${hasImage}, ${postCommunity}) RETURNING id`;
    if(hasImage) saveFile(image, "post-images/", `${results[0].id}.jpg`);

    redirect("/app");
}

async function saveFile(file: File, pathName: string, fileName: string) {
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
        await writeFile( path.join(process.cwd(), `public/${pathName}/${fileName}`), buffer );
    } catch (error) {
        console.log("Error occured ", error);
    }
}

export async function deletePost(postID: number) {
    await sql`DELETE FROM posts WHERE id = ${postID}`;
    redirect("/app");
}

const communitySchema = z.object({
    userID: z.int()
        .min(1, { message: "An internal exception has occurred. Please try again later." }),
    name: z.string()
        .min(3, { message: "The community name must have at least 3 characters" })
        .trim()
});

export async function createCommunity(prevState: any, formData: FormData) {
    const userID = Number(formData.get("user-id"));
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = Number(formData.get("color"));
    
    const image = formData.get("image") as File;
    const hasImage = (image.size > 0);

    const verifiedData = communitySchema.safeParse({
        userID, name
    });

    if (!verifiedData.success) {
        return z.flattenError(verifiedData.error).fieldErrors;
    }


    const communityColor = (color == -1) ? null : color;
    const results = await sql`INSERT INTO communities (name, creator, color, description) VALUES (${name}, ${userID}, ${communityColor}, ${description}) RETURNING id`;
    if(hasImage) saveFile(image, "community-banner-images/", `${results[0].id}.jpg`);

    redirect("/app/communities");
}