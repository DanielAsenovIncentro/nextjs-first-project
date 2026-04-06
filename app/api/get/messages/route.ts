import { getMessagesBetween } from "@/app/lib/data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const user1 = request.nextUrl.searchParams.get("user1");
    const user2 = request.nextUrl.searchParams.get("user2");
    if(!user1 || !user2) return Response.json(false);
    const messages = await getMessagesBetween(Number(user1), Number(user2));
    return Response.json(messages);
}