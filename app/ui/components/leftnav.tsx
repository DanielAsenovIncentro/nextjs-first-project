import { createDMChannel } from "@/app/lib/action";
import { verifySession } from "@/app/lib/dal";
import { fetchDefinedUserById, fetchUsersExcept, getMessagesBetween } from "@/app/lib/data";
import { redirect } from "next/navigation";
import { ClientDMContainer } from "./messages";
import { DMUserList } from "./dmuserlist";
import { Suspense } from "react";
import { DMListSkeleton, DMUserSkeleton } from "../skeletons";

const MESSAGE_REFRESH_RATE = 5000;

export default async function LeftNav() {

    const session = await verifySession();

    if (!session) redirect("/login");
    const userID = session?.userId;
    const otherID = Number(session?.currentChatUser);
    if (userID == otherID) redirect(`/app/users/${userID}`);

    

    if (!otherID || otherID <= 0) {
        const users = await fetchUsersExcept(session.userId);
        return (
            <div className="bg-dark-300 pl-2">
                <Suspense fallback={<DMListSkeleton />}>
                    <DMUserList users={users} />
                </Suspense>
            </div>
        );
    } else {
        await createDMChannel(userID, otherID); // Create a DM channel if one doesn't exist

        return (
            <div className="bg-dark-300 pl-2">
                <Suspense fallback={<DMUserSkeleton/>}>
                    <DMChannel user1ID={userID} user2ID={otherID} />
                </Suspense>
            </div>
        );
    }
}

async function DMChannel({ user1ID, user2ID }: { user1ID: number, user2ID: number }) {
    const user1 = (await fetchDefinedUserById(user1ID))[0];
    const user2 = (await fetchDefinedUserById(user2ID))[0];
    // const messages = await getMessagesBetween(user1.id, user2.id);

    return (
        <>
            {/* <ClientDMContainer messages={messages} user1={user1} user2={user2} /> */}
            <ClientDMContainer user1={user1} user2={user2} />
        </>
    );
}