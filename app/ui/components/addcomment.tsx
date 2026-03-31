"use client";

import { useActionState, useState } from "react";
import { CommentAddIcon } from "./icons"
import postgres from "postgres";
import { UserProfileImage } from "./user";
import Link from "next/link";
import { addPostComment } from "@/app/lib/action";

export function AddComment({ user, post }: { user: postgres.Row, post: postgres.Row }) {
    const [writable, setWritable] = useState(false);
    const [state, formAction] = useActionState(addPostComment, { content: "" });
    const hasError = !!state.errors;

    return (
        <>
            {(writable) ? (
                <div className="bg-dark-100 rounded-sm m-2 my-1 flex flex-col">
                    <div className="p-2">
                        <UserProfile user={user} />
                    </div>
                    <form action={formAction} className="w-full p-2 flex flex-row">
                        <input type="hidden" name="user-id" value={user.id} />
                        <input type="hidden" name="post-id" value={post.id} />
                        <input
                            type="text" name="content" placeholder="Add comment..." autoFocus
                            className="bg-dark-300 rounded-l-sm p-2 w-full outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-primary-600 py-1 px-2 rounded-r-sm text-light-100 cursor-pointer transition duration-50 hover:brightness-95"
                        >
                            Send
                        </button>
                    </form>
                    {state.errors && (
                        <div className="text-primary-100 ml-2 mb-2 flex justify-center items-center -translate-y-[2px]">{state["errors"]["content"]}</div>
                    )}
                </div>

            ) : (
                <div
                    className="text-light-100 flex flex-row gap-2 justify-center items-center bg-primary-900 rounded-sm m-2 py-1 transition duration-50 cursor-pointer hover:brightness-110"
                    onClick={() => { setWritable(true); }}
                >
                    <span>Add comment</span>
                    <CommentAddIcon width="30px" />
                </div >
            )
            }
        </>
    );
}

function UserProfile({ user }: { user: postgres.Row }) {
    return (
        <Link
            href={`/app/users/${user.id}`}
            className="flex flex-row gap-4 items-center w-[max-content]">
            <UserProfileImage id={user.id} hasImage={user.has_profile_image} styles="size-9" />
            <h1 className="text-primary-200 pr-3">{user.name}</h1>
        </Link>
    );
}