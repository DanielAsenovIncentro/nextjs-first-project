import { fetchUserPageInfo } from "@/app/lib/data";

export async function GET() {
    return Response.json(await fetchUserPageInfo(1));
}