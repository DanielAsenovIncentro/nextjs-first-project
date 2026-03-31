import { verifySession } from "@/app/lib/dal";
import { CreateCommunityForm } from "@/app/ui/components/createcommunityform";
import RightNav from "@/app/ui/components/rightnav";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await verifySession();
    if(!session) redirect("/login");
    const userID = session.userId;

    return (
        <div className="grid grid-cols-[auto_300px]">
            <div className="flex flex-col">
                <div className="flex flex-row justify-left items-center p-4">
                    <h1 className="text-2xl font-bold ml-2">New community</h1>
                </div>
                <CreateCommunityForm userID={userID} />
            </div>
            <RightNav />
        </div>
    );
}