"use client";

import { onSelectUserFromList } from "@/app/lib/action";
import postgres from "postgres";
import { useState } from "react";
import { UserProfileImage } from "./user";
import { BackIcon, SendMessageIcon } from "./icons";
import Link from "next/link";
import { MessagesSkeleton } from "../skeletons";

export function DMUserList({ users }: { users: Array<postgres.Row> }) {
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [submitted, setSubmitted] = useState(false);


    function handleSubmit(user: postgres.Row) {
        setSubmitted(true);
        setSelectedUser(user);
    }

    return (
        <>
            {(!submitted) ? (
                <div className="bg-dark-100 w-full h-full rounded-t-md p-2 flex flex-col gap-2">
                    <div className="bg-dark-300 h-12 rounded-md flex items-center justify-center">
                        <h1 className="font-bold">DM List</h1>
                    </div>
                    <div className="flex flex-col gap-1">
                        {users.map(user => (
                            <form
                                key={user.id} action={onSelectUserFromList} onSubmit={() => { handleSubmit(user) }}
                            >
                                <input type="hidden" name="user-id" value={user.id} />
                                <button
                                    type="submit"
                                    className="flex flex-row justify-between bg-dark-200 py-2 divide-1 px-3 rounded-md cursor-pointer w-full h-12 transition duration-50 hover:[&>*]:opacity-100 hover:bg-dark-300"
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <UserProfileImage id={user.id} hasImage={user.has_profile_image} styles="size-7" />
                                        <span className="text-light-300">{user.name}</span>
                                    </div>
                                    <SendMessageIcon width="30px" className="text-primary-300 opacity-75" />
                                </button>
                            </form>
                        ))}
                    </div>
                </div>
            ) : (
                <GhostMessageChannel selectedUser={selectedUser} />
            )}
        </>
    );
}

function GhostMessageChannel({ selectedUser }: { selectedUser: postgres.Row }) {
    return (
        <div className="grid grid-rows-[50px_auto_60px] h-full max-h-[calc(100vh-50px)] bg-dark-100 p-2 rounded-t-md">
            <div className="bg-dark-300 flex flex-row items-center justify-left gap-2 pl-2 rounded-md">
                <div className="opacity-60 transition duration-100 hover:transform hover:translate-x-1 hover:opacity-100 cursor-pointer flex">
                    <button className="cursor-pointer">
                        <BackIcon width="30px" className="mr-2" />
                    </button>
                </div>
                <Link href={`/users/${selectedUser.id}`} className="flex flex-row items-center gap-3 h-full px-4 transition duration-100 hover:bg-dark-200 -translate-x-2">
                    <UserProfileImage id={selectedUser.id} hasImage={selectedUser.has_profile_image} styles="size-8" />
                    <span className="font-bold">{selectedUser.name}</span>
                </Link>
            </div>
            <div className="relative overflow-y-scroll flex flex-col-reverse no-scrollbar">
                <MessagesSkeleton />
            </div>
            <div className="grid grid-cols-[auto_50px] gap-2 mx-2">
                <div className="flex m-auto mt-0 w-full h-12">
                    <input maxLength={500} type="text" placeholder={`Message ${selectedUser.name}...`} name="content"
                        className="outline-none w-full px-5 border-1 border-light-300 rounded-full opacity-60 transition duration-100 focus:opacity-100"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-primary-600 text-light-300 w-12 h-12 rounded-full flex transition duration-100 hover:bg-primary-900 cursor-pointer hover:[&>*]:-rotate-z-10"
                >
                    <SendMessageIcon width="30px" className="m-auto translate-x-[2px] transition duration-200" />
                </button>
            </div>
        </div>
    );
}