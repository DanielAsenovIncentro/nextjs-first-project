import { verifySession } from "@/app/lib/dal";
import { fetchCommunities } from "@/app/lib/data";
import { CreatePostForm } from "@/app/ui/components/createpostform";
import RightNav from "@/app/ui/components/rightnav";
import { redirect } from "next/navigation";

export default async function Page() {
    const communities = await fetchCommunities(); 
    const session = await verifySession();
    if(!session) redirect("/login");
    const userID = session.userId;
    
    return (
        <div className="grid grid-cols-[auto_300px]">
            <div className="flex flex-col">
                <div className="flex flex-row justify-left items-center p-4">
                    <h1 className="text-2xl font-bold ml-2">New post</h1>
                </div>
                <CreatePostForm communities={communities} userID={userID} />
            </div>
            <RightNav />
        </div>
    );
}