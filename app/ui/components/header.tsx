"use client";

import Link from "next/link";
import { Searchbar } from "./searchbar";
import { BellIcon, SignInIcon, SignOutIcon, UserIcon } from "./icons";
import { Dropdown } from "./dropdown";
import { UserProfileImage } from "./user";
import { useActionState } from "react";
import { signOutUser } from "@/app/lib/action";
import postgres from "postgres";
import { AppLogo } from "@/app/lib/clientutils";

export default function Header({ user }:{ user?: postgres.Row|undefined }) {
    return (
        <header className="bg-dark-300 grid grid-cols-3 items-center">
            <div className="flex items-center h-full">
                <Link href="/app" className="font-bold relative h-full flex flex-row items-center gap-3 transition duration-100 hover:brightness-110 hover:[&>img]:rotate-z-5">
                    <AppLogo className="size-7 ml-5 transition duration-250" />
                    <div className="w-32 h-full flex items-center -translate-y-[2px]">MyApp</div>
                </Link>
            </div>
            <div className="flex flex-center w-full justify-center items-center">
                <div className="w-3/4">
                    <Searchbar />
                </div>
            </div>
            <div className="flex flex-row items-center justify-end mr-[100px]">
                <HeaderUserIcon user={user} />
            </div>
        </header>
    );
}

function HeaderUserIcon({ user }: { user: postgres.Row|undefined }) {
    const [errorMessage, formAction, isPending] = useActionState(signOutUser, undefined);
    return (
        <div className="flex flex-row items-center gap-4">
            <Dropdown direction="left" content={(
                <div className="px-2 py-1 w-64 flex justify-center items-center">
                    <span>You have no notifications.</span>
                </div>
            )} activatedBy={(
                <BellIcon width="30px" className="transition duration-150 cursor-pointer hover:rotate-z-8" />
            )}>

            </Dropdown>
            {user ? (

                // User is signed in
                <Dropdown direction="left" content={(
                    <div className="text-light-100 no-wrap w-32 flex flex-col [&>*]:flex [&>*]:flex-row [&>*]:items-center [&>*]:gap-2">
                        <Link href={`/app/users/${user[0].id}`} className="transition duration-50 cursor-pointer hover:bg-primary-600 px-4 h-8">
                            <UserIcon width="20px" />
                            <span>Profile</span>
                        </Link>
                        <form action={formAction} className="transition duration-50 cursor-pointer hover:bg-primary-600 px-4 h-8">
                            <button className="flex flex-row items-center justify-center gap-2 cursor-pointer">
                                <div className="translate-y-1">
                                    <SignOutIcon width="20px" className="transform" />
                                </div>
                                <span className="cursor-pointer">Sign out</span>
                            </button>
                        </form>
                    </div>
                )} activatedBy={
                    <div className="cursor-pointer transition duration-50 hover:brightness-90">
                        <UserProfileImage id={user[0].id} hasImage={user[0].has_profile_image} />
                    </div>
                } />
            ) : (

                // User is not signed in
                <Dropdown direction="left" content={(
                    <div className="text-light-100 no-wrap w-32 flex flex-col [&>*]:flex [&>*]:flex-row [&>*]:items-center [&>*]:gap-2">
                        <Link href="/login" className="transition duration-50 cursor-pointer hover:bg-primary-600 px-4 h-8">
                            <SignInIcon width="20px" />
                            <span>Log in</span>
                        </Link>
                    </div>
                )} activatedBy={
                    <div className="cursor-pointer transition duration-50 hover:brightness-90">
                        <UserIcon width="30px" />
                    </div>
                } />
            )}
        </div>
    );
}