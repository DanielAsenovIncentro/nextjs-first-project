import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '../auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import postgres from 'postgres';
import bcrypt from "bcryptjs"
import { createSession } from './lib/session';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export class CustomAuthError extends AuthError {
    constructor(message: string) {
        super();
        this.message = message;
        this.stack = undefined;
    }
}

async function getUser(name: string): Promise<User | undefined> {
    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE name=${name}`;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ name: z.string(), password: z.string().min(8) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { name, password } = parsedCredentials.data;
                    const user = await getUser(name);
                    if (!user) throw new CustomAuthError("User not found");

                    const comparison = await bcrypt.compare(password, user.password);
                    if(!comparison) throw new CustomAuthError("The user or password is incorrect");

                    await createSession(user.id);
                    return user;
                }

                throw new CustomAuthError("Invalid login");
            }
        })
    ]
});