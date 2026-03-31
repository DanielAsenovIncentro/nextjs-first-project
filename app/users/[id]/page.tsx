import { verifySession } from "@/app/lib/dal";
import { fetchDefinedUserById, fetchProfilePostsByUser, fetchUserPageInfo } from "@/app/lib/data";
import { Post } from "@/app/ui/components/homepagepost";
import LeftNav from "@/app/ui/components/leftnav";
import { UserProfileImage } from "@/app/ui/components/user";
import { formatDistance } from "date-fns";
import { useFormatter } from "next-intl";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page(props: {
    params: Promise<{ id: number }>
}) {
    const params = await props.params;
    const userID = await params.id;
    const session = await verifySession();
    if(!session) redirect("/login");
    const viewAs = session.userId;
    const user = (await fetchUserPageInfo(userID))[0];
    const joinedSice = formatDistance(user.created_at, new Date(), { addSuffix: true });
    

    return (
        <main className="rounded-md bg-dark-200">
            <div className="grid grid-rows-[192px_auto] relative">
                <UserProfileBanner userID={user.id} hasBanner={user.has_banner_image} />
                <div className="absolute top-48 left-0 -translate-y-7/10 translate-x-32 flex flex-row items-center gap-16">
                    <UserProfileImage id={userID} hasImage={user.has_profile_image} styles="size-40 border-10 border-dark-200" />
                    <div className="-translate-y-1">
                        <h1 className="text-2xl font-bold scale-175 select-none drop-shadow-[0_0_10px_black]">{user.name}</h1>
                    </div>
                </div>
                <div className="flex flex-row justify-end h-[calc(100vh-50px-192px)]">
                    <div className="w-152 flex flex-col gap-8 [&_span]:text-primary-300 [&_span]:font-bold">
                        <div className="flex flex-col mt-16 mx-8">
                            <h1 className="mb-2 text-primary-100">User information</h1>
                            <div className="flex flex-col gap-2 bg-dark-100 rounded-md p-2">
                                <p>Posts: <span>{user.posts_created}</span></p>
                                <p>Comments: <span>{user.comments}</span></p>
                                <p>Likes: <span>{user.post_likes}</span></p>
                            </div>
                        </div>
                        <div className="flex flex-col mx-8">
                            <h1 className="mb-2 text-primary-100">Other information</h1>
                            <div className="flex flex-col gap-2 bg-dark-100 rounded-md p-2">
                                <p>Joined: <span>{joinedSice}</span></p>
                                <p>Liked posts: <span>{user.posts_liked}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-y-auto bg-dark-300 p-2 w-full">
                        <UserPosts userID={userID} viewAs={viewAs} />
                    </div>
                </div>
            </div>
        </main>
    )
}

function UserProfileBanner({ userID, hasBanner, className }: { userID: number, hasBanner: boolean, className?: string }) {
    return (
        <div className="w-full h-48 overflow-hidden select-none relative after:absolute after:size-full after:bg-linear-to-r after:from-dark-300 after:to-transparent after:top-0 after:left-0">
            {hasBanner ? (
                <img
                    src={`/user-banner-images/${userID}.jpg`} alt="banner" draggable="false"
                    className={`${className} w-full h-auto rounded-md -translate-y-1/2 after:absolute after:size-full after:bg-linear-to-r after:from-dark-300 after:to-transparent`}
                />

            ) : (
                <div className="w-full h-full bg-primary-800 rounded-md"></div>
            )}
        </div>
    );
}

async function UserPosts({ userID, viewAs }:{ userID: number, viewAs: number }) {
    const posts = await fetchProfilePostsByUser(viewAs, userID);

    return (
        <div className="flex flex-col gap-2 absolute mr-2 h-full">
            {posts.map(post => (
                <Post key={post.id} post={post} userID={viewAs} />
            ))}
        </div>
    );
}