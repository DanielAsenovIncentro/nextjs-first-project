"use client";

import { onPostLike } from "@/app/lib/action";
import postgres from "postgres";
import { HeartIcon } from "./icons";
import { useState } from "react";

export function PostButtons({ post, userID, liked }: { post: postgres.Row, userID: number, liked: boolean }) {
    const likePostWithId = onPostLike.bind(null, userID, post.id);
    const [ghostLiked, setGhostLiked] = useState(liked);
    const [ghostLikes, setGhostLikes] = useState(Number(post.likes));

    function handlePostLike() {
        const additionalGhostLike = (!ghostLiked) ? 1 : -1;
        setGhostLikes(ghostLikes + additionalGhostLike);
        setGhostLiked(!ghostLiked);
    }

    return (
        <div className="bg-dark-150 rounded-r-md flex flex-col justify-between items-center py-2">
            <form
                action={likePostWithId} onSubmit={handlePostLike}
                className={`${ghostLiked ? "opacity-100" : "opacity-60"} transition duration-50 hover:brightness-90 hover:[&_svg]:transform hover:[&_svg]:scale-[102%] hover:opacity-100`}
            >
                <button className={`flex flex-col justify-center items-center cursor-pointer ${ghostLiked ? "text-primary-300" : "text-light"}`}>
                    <HeartIcon width="30px" filled={ghostLiked} />
                    <span>{ghostLikes}</span>
                </button>
            </form>
        </div>
    )
}