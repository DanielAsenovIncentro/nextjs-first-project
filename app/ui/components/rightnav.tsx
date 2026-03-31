import Link from "next/link";
import { CreatePostIcon, ExploreIcon, FlagIcon, RandomIcon } from "./icons";
import { getPostsAmount } from "@/app/lib/data";
import { AppLogo } from "@/app/lib/clientutils";

export default async function RightNav() {
    const posts = (await getPostsAmount())[0].count;
    const randomPostID = Math.floor(Math.random() * Number(posts) + 1);

    return (
        <aside className="bg-dark-300 pr-2">
            <div className="flex flex-col bg-dark-200 h-full rounded-t-md">
                <Link href="/" className="font-bold relative h-max mx-auto mt-7 mb-1 w-max flex flex-row items-center justify-center gap-3 transition duration-100 hover:brightness-110 hover:[&>img]:rotate-z-5">
                    <AppLogo className="size-7 transition duration-250" />
                    <div className="w-32 h-full flex items-center w-full -translate-y-[2px]">MyApp</div>
                </Link>
                <div className="flex flex-col p-4 justify-center items-center [&_div]:h-10">
                    <div className="relative w-[90%] h-10 flex items-center justify-center">
                        <Link
                            href="/create/post"
                            className="absolute w-[111%] h-[110%] grid grid-cols-[30px_auto] gap-2 items-center transition duration-100 px-2 pt-1 pb-1 cursor-pointer hover:bg-dark-50 hover:[&_svg]:text-primary-300 rounded-md">
                            <CreatePostIcon width="25px" className="text-primary-600 transition duration-100 m-auto" />
                            <span>Create post</span>
                        </Link>
                    </div>
                    <div className="relative w-[90%] h-10 flex items-center justify-center">
                        <Link
                            href="/create/community"
                            className="absolute w-[111%] h-[110%] grid grid-cols-[30px_auto] gap-2 items-center transition duration-100 px-2 pt-1 pb-1 cursor-pointer hover:bg-dark-50 hover:[&_svg]:text-primary-300 rounded-md">
                            <FlagIcon width="25px" className="text-primary-600 transition duration-100 m-auto" />
                            <span>Create community</span>
                        </Link>
                    </div>
                    <hr className="w-full h-1 my-4 rounded-full bg-dark-50 border-none opacity-85" />
                    <div className="relative w-[90%] h-10 flex items-center justify-center">
                        <Link
                            href={`/communities`}
                            className="absolute w-[111%] h-[110%] grid grid-cols-[30px_auto] gap-2 items-center transition duration-100 px-2 pt-1 pb-1 cursor-pointer hover:bg-dark-50 hover:[&_svg]:text-primary-300 rounded-md">
                            <ExploreIcon width="35px" className="text-primary-600 transition duration-100 m-auto -translate-x-[3px]" />
                            <span>Explore communities</span>
                        </Link>
                    </div>
                    <div className=" relative w-[90%] h-10 flex items-center justify-center">
                        <Link
                            href={`/posts/${randomPostID}`}
                            className="absolute w-[111%] h-[110%] grid grid-cols-[30px_auto] gap-2 items-center transition duration-100 px-2 pt-1 pb-1 cursor-pointer hover:bg-dark-50 hover:[&_svg]:text-primary-300 rounded-md">
                            <RandomIcon width="30px" className="text-primary-600 transition duration-100 m-auto" />
                            <span>Random post</span>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}