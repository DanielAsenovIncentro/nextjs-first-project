"use client";

import Link from "next/link"
import { useActionState } from "react";
import { registerUser } from "@/app/lib/action";
import Header from "../ui/components/header";

export default function Page() {
    const [errorMessage, formAction, isPending] = useActionState(registerUser, undefined);

    return (
        <>
            <Header />
            <main className="flex items-center justify-center">
                <div className="flex flex-col justify-center items-center gap-4 bg-dark-300 px-8 py-4 rounded-md">
                    <h1 className="font-bold text-3xl">Sign up</h1>
                    <form action={formAction} className="flex flex-col justify-center items-center gap-2 [&>input]:outline-none">
                        <input
                            type="text" name="username" placeholder="Username" maxLength={24}
                            className="bg-dark-100 p-2 pl-4 rounded-md border-l-6 border-primary-900 focus:border-primary-600 transition duration-100 hover:brightness-110"
                        />
                        <input
                            type="email" name="email" placeholder="Email" maxLength={32}
                            className="bg-dark-100 p-2 pl-4 rounded-md border-l-6 border-primary-900 focus:border-primary-600 transition duration-100 hover:brightness-110"
                        />
                        <input
                            type="password" name="password" placeholder="Password" maxLength={24}
                            className="bg-dark-100 p-2 pl-4 rounded-md border-l-6 border-primary-900 focus:border-primary-600 transition duration-100 hover:brightness-110"
                        />
                        <button
                            type="submit"
                            className="bg-primary-600 px-4 py-2 rounded-md mt-2 transition duration-50 cursor-pointer hover:bg-primary-900"
                        >Sign up</button>
                        <div className="text-sm flex flex-row gap-1">
                            <span>Already have an account?</span>
                            <Link href="/login" className="text-primary-300 underline transition duration-100 cursor-pointer hover:text-primary-100">Log in</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}