import 'server-only'

import { cookies } from 'next/headers'
import { createSession, decrypt, encrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const verifySession = cache(async (callbackURL?: string) => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        return; // You can redirect to /login but it causes an infinite redirect loop
    }

    return { isAuth: true, userId: Number(session.userId), currentChatUser: session.currentChatUser, postCycle: session.postCycle }
});

export const updateSessionCurrentChatUser = cache(async (id: number|null) => {
    const cookie = await cookies();
    const session = await decrypt((await cookies()).get("session")?.value);

    if(!cookie || !session) return;

    session.currentChatUser = id;
    cookie.set('session', await encrypt({ ...session }), {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        sameSite: 'lax',
        path: '/',
    });
});

export const updateSessionPostCycle = cache(async () => {
    const cookie = await cookies();
    const session = await decrypt((await cookies()).get("session")?.value);

    if(!cookie || !session) return;

    session.postCycle = Number(session.postCycle) + 1;
    cookie.set('session', await encrypt({ ...session }), {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        sameSite: 'lax',
        path: '/',
    });
});