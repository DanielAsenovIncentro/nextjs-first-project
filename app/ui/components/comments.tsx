import postgres from "postgres";
import { fetchPostCommentsWithUserInfo, fetchUserById } from "../../lib/data";
import Link from "next/link";
import { UserProfileImage } from "./user";
import { PostDate } from "./post";
import { AddComment } from "./addcomment";
import { DeleteIcon } from "./icons";
import { deleteComment } from "../../lib/action";
import { Suspense } from "react";
import { PostCommentsSkeleton } from "../skeletons";
import { redirect } from "next/navigation";

export async function Comments({ post, userID }: { post: postgres.Row, userID: number }) {
    return (
        <div className="bg-dark-200 rounded-t-md">
            <Suspense fallback={<PostCommentsSkeleton />}>
                <LoadedComments post={post} userID={userID} />
            </Suspense>
        </div>
    );
}

async function LoadedComments({ post, userID }: { post: postgres.Row, userID: number }) {
    const comments = await fetchPostCommentsWithUserInfo(post.id);
    const userPromise = await fetchUserById(userID);
    if (!userPromise) redirect("/login");
    const user = userPromise[0];

    return (
        <div className="flex flex-col h-[calc(100vh-50px)]">
            <h1 className="flex justify-center items-center font-bold py-2">Comments ({comments.length})</h1>
            <AddComment user={user} post={post} />
            <div className="overflow-y-scroll flex flex-col">
                {comments.map(comment => (
                    <div key={comment.id} className="bg-dark-100 mx-2 my-1 rounded-sm flex flex-col">
                        <div className="p-2 pb-1 flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-3">
                                <UserProfile comment={comment} post={post} />
                                <PostDate date={comment.date.toString()} className="text-sm bg-dark-300" />
                            </div>
                            {comment.user_id == user.id && (
                                <form action={deleteComment}>
                                    <input type="hidden" name="comment-id" value={comment.id} />
                                    <button
                                        type="submit"
                                        className="text-primary-300 transition duration-50 opacity-50 hover:opacity-100 cursor-pointer"
                                    >
                                        <DeleteIcon width="30px" />
                                    </button>
                                </form>
                            )}
                        </div>
                        <p className="pt-1 pl-2 pb-3">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UserProfile({ comment, post }: { comment: postgres.Row, post: postgres.Row }) {
    return (
        <Link
            href={`/users/${comment.user_id}`}
            className="flex flex-row gap-4 items-center w-[max-content]">
            <UserProfileImage id={comment.user_id} hasImage={comment.has_profile_image} styles="size-9" />
            <h1 className={`${post.author == comment.user_id ? "text-light-100 bg-primary-900 px-3 rounded-full transform -translate-x-1" : "text-primary-300"}`}>{comment.name}</h1>
        </Link>
    );
}