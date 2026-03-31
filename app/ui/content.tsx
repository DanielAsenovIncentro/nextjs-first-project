import { fetchHomePostDataAsUser } from "../lib/data";
import { Suspense } from "react";
import { HomePagePostsSkeleton, TextPostSkeleton } from "./skeletons";
import { verifySession } from "../lib/dal";
import { redirect } from "next/navigation";
import { MorePosts, Post } from "./components/homepagepost";

export default async function Content() {
    return (
        <>
            <div className="bg-dark-300 flex flex-col overflow-y-scroll gap-2 px-2 no-scrollbar h-[calc(100vh-50px)]">
                <Suspense fallback={<HomePagePostsSkeleton />}>
                    <Posts />
                </Suspense>
            </div>
        </>
    );
}

async function Posts() {
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Skeleton testing
    const session = await verifySession();
    if (!session) redirect("/login");
    const userID = session?.userId;
    const cycle = Number(session?.postCycle) || 0;
    const posts = await fetchHomePostDataAsUser(userID);
    const finalPosts = Array();

    for (let i = 0; i < cycle; i++) {
        finalPosts.push(...posts);
    }

    return (
        <>
            {finalPosts.map((post, i) => (
                <Post post={post} userID={userID} key={i}/>
            ))}
            <MorePosts />
        </>
    );
}