import postgres from "postgres";
import { UserProfileImage } from "./user";
import { CommentsIcon } from "./icons";
import { formatCommunityName, getCommunityColor } from "@/app/lib/utils";

// IMAGE POST ===========================================================================

export function ImagePost({ post }: { post: postgres.Row }) {
    return (
        <div className="h-48 flex flex-row justify-between relative overflow-hidden">
            <div className="relative">
                <PostHeaderInfo post={post} />
                <div className="flex flex-col mx-3 gap-1 w-full">
                    <h1 className="text-xl font-bold opacity-75">{post.title}</h1>
                    <p className="text-light-300 h-full overflow-hidden opacity-50">{post.content}</p>
                </div>
            </div>

            <div className="relative h-48 flex-shrink-0 flex justify-center items-center">
                <div className="h-full w-auto flex justify-center items-center">
                    <img
                        src={`/post-images/${post.id}.jpg`} width={500} height={0} alt={post.id} draggable={false}
                        className="h-[90%] w-auto overflow-hidden select-none m-3 z-1 pl-3 relative"
                    />
                </div>
            </div>
            <div className="absolute w-full h-12 bottom-0 left-0 bg-gradient-to-t from-dark-100 to-transparent rounded-b-sm"></div>
        </div>
    );
}

// TEXT POST ===========================================================================

export function TextPost({ post }: { post: postgres.Row }) {
    return (
        <div className="h-32 flex flex-col relative overflow-hidden">
            <PostHeaderInfo post={post} />
            <div className="flex flex-col mx-3 gap-1">
                <h1 className="text-xl font-bold opacity-75">{post.title}</h1>
                <p className="text-light-300 opacity-50">{post.content}</p>
            </div>
            <div className="absolute w-full h-12 bottom-0 left-0 bg-gradient-to-t from-dark-100 to-transparent rounded-b-sm"></div>
        </div>
    );
}

function PostHeaderInfo({ post }: { post: postgres.Row }) {
    return (
        <div className="flex flex-row gap-2 items-center pt-2 pl-2 pb-1">
            <PostUser post={post} />
            <PostCommunity post={post} />
            <PostDate date={post.date.toString()} className="bg-dark-300 text-md scale-[90%]" />
            {(post.comments > 0) && <PostCommentAmount post={post} />}
        </div>

    );
}

function PostUser({ post }: { post: postgres.Row }) {
    return (
        <div className="flex flex-row items-center gap-3">
            <UserProfileImage id={post.user_id} hasImage={post.has_profile_image} styles="size-7" />
            <span className="text-primary-200">{post.user_name}</span>
        </div>
    );
}

export function PostDate({ date, className }: { date: string, className?: string }) {
    const dateString = date.split(":")[0];
    const month = dateString.split(" ")[1];
    const day = dateString.split(" ")[2];
    const year = dateString.split(" ")[3];
    const formattedDate = `${month} ${day}, ${year}`;

    return (
        <div className={`text-light-300 bg-dark-100 px-2 py-px rounded-full opacity-70 transition duration-50 hover:opacity-100 cursor-pointer ${className}`}>
            {formattedDate}
        </div>
    )
}

function PostCommentAmount({ post }: { post: postgres.Row }) {
    return (
        <div
            className="text-light-300 flex flex-row gap-1 justify-center items-center opacity-40 transition duration-50 hover:opacity-100 select-none">
            <CommentsIcon width="20px" />
            <span>{post.comments}</span>
        </div>
    );
}

export function PostCommunity({ post }:{ post: postgres.Row }) {
    const bgColor = getCommunityColor(post.community_color);
    return (
        <>
            {post.community_name ? (
                <span className={`${bgColor} text-sm rounded-full px-[7px] translate-y-[2px] flex items-center justify-center select-none`}>
                    <span className="transform -translate-y-[1px]">{formatCommunityName(post.community_name, true)}</span>
                </span>
            ) : (
                <span className={`${bgColor} text-sm rounded-full px-[7px] translate-y-[2px] flex items-center justify-center select-none`}>
                    <span className="transform -translate-y-[1px]">General</span>
                </span>
            )}
        </>
    );
}