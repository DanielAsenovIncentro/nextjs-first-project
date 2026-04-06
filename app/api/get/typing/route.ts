import { getTyping } from "@/app/lib/action";
import { NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest) {
    const user1 = request.nextUrl.searchParams.get("user1");
    const user2 = request.nextUrl.searchParams.get("user2");
    if(!user1 || !user2) return;
    const results = await getTyping(Number(user1), Number(user2));
    if(!results) return Response.json({"users": []});
    const userArray: Array<number> = [];
    results.forEach(result => {
        userArray.push(result.id);
    })
    return Response.json({"users": userArray});
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    if(!body.typing) {
        await sql`UPDATE users SET typing_channel = NULL WHERE id = ${body.user2}`;
    } else {
        await sql`UPDATE users SET typing_channel = (
            SELECT dm_channels.id FROM dm_channels WHERE (user1 = ${body.user1} AND user2 = ${body.user2}) OR (user1 = ${body.user2} AND user2 = ${body.user1})
        ) WHERE users.id = ${body.user2}`;
    }
    return Response.json(true);
}