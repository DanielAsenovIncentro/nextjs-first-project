import Link from "next/link";
import { fetchCommunities } from "../lib/data";
import RightNav from "../ui/components/rightnav";
import { formatCommunityName, getCommunityColor } from "../lib/utils";
import postgres from "postgres";

export default function Page() {
    return (
        <main className="grid grid-cols-[auto_300px]">
            <CommunityList />
            <RightNav />
        </main>
    );
}

async function CommunityList() {
    const communities = await fetchCommunities();
    return (
        <div className="relative flex overflow-y-auto m-2">
            <div className="absolute flex flex-col gap-2 w-full">
                {communities.map(community => (
                    <Link
                        key={community.id} href={`/communities/${community.id}`}
                        className="relative w-full h-32 z-1 bg-dark-100 rounded-md hover:[&_img]:brightness-75 hover:[&>div]:opacity-100"
                    >
                        <div className="relative w-full h-full rounded-md overflow-hidden after:absolute after:size-full after:bg-linear-to-r after:from-dark-300 after:to-transparent after:top-0 after:left-0">
                            <img
                                src={`/community-banner-images/${community.id}.jpg`} alt="Community Banner"
                                className="absolute w-full h-auto brightness-50 z-0 -translate-y-1/3 transition duration-100"
                            />
                        </div>
                        <div className="absolute left-0 bottom-0 opacity-75 flex flex-row items-center gap-2">
                            <CommunityTag community={community} />
                            {community.description && (
                                <span>{community.description}</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function CommunityTag({ community }: { community: postgres.Row }) {
    const bgColor = getCommunityColor(community.color);
    return (
        <div className={`${bgColor} rounded-tr-full pl-3 pr-6 py-1 flex select-none`}>
            <span className="font-bold text-2xl -translate-y-[1px]">{formatCommunityName(community.name, true)}</span>
        </div>
    );
}