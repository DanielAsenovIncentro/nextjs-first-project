"use client";

import Link from "next/link";
import { PostButtons } from "./postbuttons";
import postgres from "postgres";
import { ImagePost, TextPost } from "./post";
import { useEffect, useRef } from "react";
import { useIsVisible } from "@/app/lib/clientutils";
import { TextPostSkeleton } from "../skeletons";
import { loadMorePosts } from "@/app/lib/action";

export function Post({ post, userID }: { post: postgres.Row, userID: number }) {

    return (
        <div className="grid grid-cols-[auto_50px]">
            <Link
                key={post.id} href={`/app/posts/${post.id}`}
                className="bg-dark-100 rounded-l-md transition ease-out duration-50 hover:bg-dark-50 hover:[&_img]:brightness-105"
            >
                {post.has_image ? (<ImagePost post={post} />) : (<TextPost post={post} />)}
            </Link>
            <PostButtons post={post} userID={userID} liked={post.liked} />
        </div>
    );
}

const load = async () => { await loadMorePosts(); }

export function MorePosts() {
    const visibleRef = useRef(null);
    const isVisible = useIsVisible(visibleRef);

    useEffect(() => {
        if (isVisible) load();
    });

    return (
        <>
            <div ref={visibleRef}>
                <TextPostSkeleton />
            </div>
        </>
    )
}