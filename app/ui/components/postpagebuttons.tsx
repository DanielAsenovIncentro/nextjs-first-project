"use client";

import { deletePost, onPostLike } from "@/app/lib/action";
import postgres from "postgres";
import { CommentsIcon, DeleteIcon, HeartIcon } from "./icons";
import { useState } from "react";

export function PostButtons({ post, userID, liked }: { post: postgres.Row, userID: number, liked: boolean }) {
    const likePostWithId = onPostLike.bind(null, userID, post.id);
    const deletePostWithId = deletePost.bind(null, post.id);
    const [ghostLiked, setGhostLiked] = useState(liked);
    const [ghostLikes, setGhostLikes] = useState(Number(post.likes));

    function handlePostLike() {
        const additionalGhostLike = (!ghostLiked) ? 1 : -1;
        setGhostLikes(ghostLikes + additionalGhostLike);
        setGhostLiked(!ghostLiked);
    }

    return (
        <div className="flex flex-row justify-left gap-4 items-center my-2 ml-2">
            <form
                action={likePostWithId} onSubmit={handlePostLike}
                className={`transition duration-50 hover:brightness-90 hover:[&_svg]:transform hover:[&_*]:opacity-100`}
            >
                <button className={`${ghostLiked ? "text-primary-300" : "text-light"} flex flex-row justify-center items-center gap-2 cursor-pointer bg-dark-50 px-4 py-[0.5rem] rounded-full`}>
                    <HeartIcon width="30px" filled={ghostLiked} className={ghostLiked ? "opacity-100" : "opacity-70"} />
                    <span className="opacity-70 transition duration-50 select-none">{ghostLikes}</span>
                </button>
            </form>
            <div className="text-light flex flex-row gap-2 justify-center items-center bg-dark-50 px-4 py-[0.5rem] rounded-full cursor-pointer transition duration-50 hover:brightness-90 hover:[&_*]:opacity-100">
                <CommentsIcon width="30px" className="opacity-60 transition duration-50" />
                <span className="opacity-70 transition duration-50 select-none">{post.comments}</span>
            </div>
            {userID == post.author && (
                <form
                    action={deletePostWithId}
                    className={`transition duration-50 hover:brightness-90`}
                >
                    <button className="text-light-300 flex flex-row justify-center items-center gap-2 cursor-pointer bg-dark-50 px-4 py-[0.5rem] rounded-full">
                        <DeleteIcon width="30px" className="opacity-70" />
                    </button>
                </form>
            )}
        </div>
    )
}