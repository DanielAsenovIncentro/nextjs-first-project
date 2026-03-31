import { verifySession } from "@/app/lib/dal";
import { fetchCommunityPosts, fetchCommunityPageData, fetchDefinedUserById } from "@/app/lib/data";
import { formatCommunityName, getCommunityColor } from "@/app/lib/utils";
import { Post } from "@/app/ui/components/homepagepost";
import { CreatePostIcon } from "@/app/ui/components/icons";
import { formatDistance } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import postgres from "postgres";

export const metadata: Metadata = {
    title: "Community"
}

export default async function Page(props: { params: Promise<{ id: number }> }) {
    const params = await props.params;
    const id = params.id;
    const community = (await fetchCommunityPageData(id))[0];
    const session = await verifySession();
    if (!session) redirect("/login");
    const userID = session.userId;
    const existedSice = formatDistance(community.created_at, new Date(), { addSuffix: true });
    const creator = (await fetchDefinedUserById(community.creator))[0];

    return (
        <main className="bg-dark-200 mx-2 rounded-t-md grid grid-rows-[200px_auto]">
            <div className="h-48 overflow-hidden relative w-full after:absolute after:size-full after:bg-linear-to-r after:from-dark-300 after:to-transparent after:top-0 after:left-0">
                <CommunityBanner communityID={community.id} />
                <div className="z-1 absolute left-18 bottom-0 bg-dark-200 p-2 pb-0 rounded-t-[30px]">
                    <CommunityTag community={community} />
                </div>
            </div>
            <div className="grid grid-cols-[auto_300px] mx-2 gap-2">
                <div className="relative overflow-y-auto w-full">
                    <CommunityPosts communityID={community.id} userID={userID} />
                </div>
                <div className="bg-dark-300 rounded-t-md flex flex-col gap-2 p-2">
                    <h1 className="mx-auto font-bold text-xl">{formatCommunityName(community.name, true)}</h1>

                    <div className="flex flex-col gap-2 p-2">
                        <div className="relative w-full h-10 flex items-center justify-center select-none">
                            <Link
                                href={`/app/create/post?community=${community.id}`}
                                className="absolute w-full h-[110%] grid grid-cols-[30px_auto] gap-2 items-center transition duration-100 px-2 pt-1 pb-1 cursor-pointer hover:bg-dark-50 hover:[&_svg]:text-primary-300 rounded-md">
                                <CreatePostIcon width="25px" className="text-primary-600 transition duration-100 m-auto" />
                                <span>Create post</span>
                            </Link>
                        </div>
                        <hr className="w-full h-1 my-2 rounded-full bg-dark-50 border-none opacity-85" />
                        <div className="ml-3 flex flex-col gap-1">
                            <div className="flex flex-row gap-2">
                                <span>Posts: </span>
                                <span className="text-primary-300 font-bold">{community.posts}</span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Total likes: </span>
                                <span className="text-primary-300 font-bold">{community.total_likes}</span>
                            </div>
                        </div>
                        <hr className="w-full h-1 my-2 rounded-full bg-dark-50 border-none opacity-85" />
                        <div className="ml-3 flex flex-col gap-1">
                            <div className="flex flex-row gap-2">
                                <span>Creator: </span>
                                <span className="text-primary-300">{creator.name}</span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Created: </span>
                                <span className="text-primary-300">{existedSice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function CommunityBanner({ communityID }: { communityID: number }) {
    return (
        <img src={`/community-banner-images/${communityID}.jpg`} className="w-full -translate-y-1/5" />
    );
}

function CommunityTag({ community }: { community: postgres.Row }) {
    const bgColor = getCommunityColor(community.color);
    return (
        <div className={`${bgColor} rounded-full px-4 py-1 flex select-none`}>
            <span className="font-bold text-2xl -translate-y-[1px]">{formatCommunityName(community.name, true)}</span>
        </div>
    );
}

export async function CommunityPosts({ communityID, userID }: { communityID: number, userID: number }) {
    const posts = await fetchCommunityPosts(userID, communityID);

    return (
        <div className="flex flex-col gap-2 absolute mr-2 h-full w-full">
            {posts.map(post => (
                <Post key={post.id} post={post} userID={userID} />
            ))}
        </div>
    );
}