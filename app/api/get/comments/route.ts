import { fetchComments, fetchPostCommentsWithUserInfo } from "@/app/lib/data";

export async function GET() {
    return Response.json(await fetchPostCommentsWithUserInfo(1));
}