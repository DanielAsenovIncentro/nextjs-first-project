"use client";

import Link from "next/link"
import { authenticate } from "../lib/action";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <main className="flex items-center justify-center">
            <div className="flex flex-col justify-center items-center gap-4 bg-dark-300 px-8 py-4 rounded-md">
                <h1 className="font-bold text-3xl">Log in</h1>
                <form action={formAction} className="flex flex-col justify-center items-center gap-2 [&>input]:outline-none">
                    <input
                        type="text" name="name" placeholder="Username" maxLength={24}
                        className="bg-dark-100 p-2 pl-4 rounded-md border-l-6 border-primary-900 focus:border-primary-600 transition duration-100 hover:brightness-110"
                    />
                    <input
                        type="password" name="password" placeholder="Password" maxLength={24}
                        className="bg-dark-100 p-2 pl-4 rounded-md border-l-6 border-primary-900 focus:border-primary-600 transition duration-100 hover:brightness-110"
                    />
                    {errorMessage && (
                        <span className="text-primary-300">{errorMessage}</span>
                    )}
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <button
                        type="submit"
                        className="bg-primary-600 px-4 py-2 rounded-md mt-2 transition duration-50 cursor-pointer hover:bg-primary-900"
                    >Log in</button>
                    <div className="text-sm flex flex-row gap-1">
                        <span>Don't have an account?</span>
                        <Link href="/signup" className="text-primary-300 underline transition duration-100 cursor-pointer hover:text-primary-100">Sign up</Link>
                    </div>
                </form>
            </div>
        </main>
    )
}