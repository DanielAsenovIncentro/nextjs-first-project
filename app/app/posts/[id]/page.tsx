import { verifySession } from "@/app/lib/dal";
import { fetchPostPageDataAsUser } from "@/app/lib/data";
import { Comments } from "@/app/ui/components/comments";
import { BackIcon } from "@/app/ui/components/icons";
import LeftNav from "@/app/ui/components/leftnav";
import { PostCommunity, PostDate } from "@/app/ui/components/post";
import { PostButtons } from "@/app/ui/components/postpagebuttons";
import { UserProfileImage } from "@/app/ui/components/user";
import { PostCommentsSkeleton, PostSkeleton, TextPostSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Post"
};

export default async function Post(props: {
    params: Promise<{ id: number }>
}) {
    const session = await verifySession();
    if (!session) redirect("/login");
    const userID = session?.userId;
    const params = await props.params;
    const id = params.id;


    return (
        <main className="bg-dark-300 grid grid-cols-[auto_minmax(auto,400px)]">
            <Suspense fallback={<><PostSkeleton /><PostCommentsSkeleton /></>}>
                <PostWithData id={id} userID={userID} />
            </Suspense>
        </main>
    );
}

async function PostWithData({ id, userID }: { id: number, userID: number }) {
    const post = (await fetchPostPageDataAsUser(id, userID))[0];

    return (
        <>
            <div className="bg-dark-300 flex flex-col m-2">
                <Link href="/app" className="text-light-100 size-auto opacity-50 z-1 transition duration-100 hover:transform hover:translate-x-[5px] hover:opacity-100 w-[max-content] flex flex-row gap-2 items-center ml-2 mt-2 pr-2 select-none">
                    <BackIcon width="30px" />
                    <span>Back</span>
                </Link>

                {post.has_image ? <ImagePost post={post} /> : <TextPost post={post} />}
                <PostButtons post={post} userID={userID} liked={post.liked} />
            </div>
            <Comments post={post} userID={userID} />
        </>
    );
}

function TextPost({ post }: { post: postgres.Row }) {
    return (
        <div className="flex flex-col gap-1 mx-4 my-2">
            <div className="flex flex-row gap-4 items-center pt-2 pl-2 pb-1">
                <PostUser post={post} />
                {post.community_id && (
                    <Link href={`/app/communities/${post.community_id}`} className="transition duration-50 hover:brightness-115"><PostCommunity post={post} /></Link>
                )}
                <PostDate date={post.date.toString()} />
            </div>
            <h1 className="font-bold text-xl">{post.title}</h1>
            <p>{post.content}</p>
        </div>
    );
}

function ImagePost({ post }: { post: postgres.Row }) {
    return (
        <div className="flex flex-col gap-1 mx-4 my-2">
            <div className="flex flex-row gap-4 items-center pt-2 pl-2 pb-1">
                <PostUser post={post} />
                {post.community_id && (
                    <Link href={`/app/communities/${post.community_id}`} className="transition duration-50 hover:brightness-115"><PostCommunity post={post} /></Link>
                )}
                <PostDate date={post.date.toString()} />
            </div>
            <h1 className="font-bold text-xl mb-1">{post.title}</h1>
            <div className="w-full rounded-sm overflow-hidden select-none">
                <img src={`/post-images/${post.id}.jpg`} alt={post.id} draggable={false} />
            </div>
            <p>{post.content}</p>
        </div>
    );
}

function PostUser({ post }: { post: postgres.Row }) {
    return (
        <Link
            href={`/app/users/${post.author}`}
            className="flex flex-row items-center gap-3"
        >
            <UserProfileImage id={post.author} hasImage={post.has_profile_image} styles="size-8" />
            <span className="text-primary-200">{post.user_name}</span>
        </Link>
    );
}