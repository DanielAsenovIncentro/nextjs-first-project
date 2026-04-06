"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { SadFaceIcon, SearchIcon } from "./icons";
import { homePageSearch } from "@/app/lib/action";
import { useDebouncedCallback } from "use-debounce";
import postgres from "postgres";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { UserProfileImage } from "./user";
import { formatCommunityName, getCommunityColor } from "@/app/lib/utils";


export function Searchbar() {
    const [content, setContent] = useState<string>("");
    const [hideResults, setHideResults] = useState<boolean>(true);
    const [results, setResults] = useState({})

    const getData = async (query: string) => { setResults(await homePageSearch(query)); }

    const handleSearchContentChange = useDebouncedCallback((value: string) => {
        setContent(value);
        setHideResults(false)
        if (value.length >= 1) {
            setResults({ loading: true });
            getData(value);
        }
        else setResults({});
    }, 300);

    return (
        <div className="bg-dark-200 w-full flex flex-row justify-between items-center rounded-full pl-4 pr-2 py-1 relative">
            <input
                type="text" placeholder="Search..." onChange={(event) => { handleSearchContentChange(event.target.value) }}
                className="w-full outline-none"
            />
            <SearchIcon width="25px" className="text-light-100 opacity-50" />
            {Object.keys(results).length > 0 && !hideResults && (
                <Results data={results} setHideResults={setHideResults} />
            )}
        </div>
    );
}

function Results({ data, setHideResults }: { data: { loading?: boolean, posts?: Array<postgres.Row>, users?: Array<postgres.Row>, communities?: Array<postgres.Row> }, setHideResults: Dispatch<SetStateAction<boolean>> }) {
    const currentDate = new Date();
    console.log(data);

    function handleResultClick() {
        setHideResults(true);
    }

    return (
        <>
            <div className="absolute bg-dark-300 w-screen h-screen left-0 z-2 -translate-x-[728px] translate-y-[433px] opacity-30" onClick={handleResultClick}></div>
            <div className="absolute top-0 left-0 w-full h-max bg-primary-900 rounded-md transform translate-y-[41px] z-3 p-2 after:bg-primary-900 after:absolute after:size-3 after:top-[-6px] after:left-4 after:rotate-z-45 drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]">
                {data.loading ? (
                    <div className="flex items-center gap-2 justify-left text-primary-300">
                        <SearchIcon width="20px" />
                        <span className="transform -translate-y-[1px]">Searching...</span>
                    </div>
                ) : (
                    <>
                        {((data.posts && data.posts.length > 0) || (data.users && data.users.length > 0) || (data.communities && data.communities.length > 0)) ? ( // There's data
                            <div className="flex flex-col gap-2">
                                {data.posts && data.posts.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-primary-300">Posts</h1>
                                        <div className="flex flex-col bg-dark-200 rounded-md">
                                            {data.posts.map((post, i) => (
                                                <Link
                                                    href={`/app/posts/${post.id}`} key={i} onClick={handleResultClick}
                                                    className="h-8 flex flex-row justify-between items-center px-2 py-1 rounded-md transition duration-50 cursor-pointer hover:bg-dark-100"
                                                >
                                                    <span>{post.title}</span>
                                                    <span className="text-primary-300">{formatCreatedAt(post.created_at, currentDate)}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.users && data.users.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-primary-300">Users</h1>
                                        <div className="flex flex-col bg-dark-200 rounded-md">
                                            {data.users.map((user, i) => (
                                                <Link
                                                    href={`/app/users/${user.id}`} key={i} onClick={handleResultClick}
                                                    className="h-8 flex flex-row justify-left items-center gap-2 px-2 py-1 rounded-md transition duration-50 cursor-pointer hover:bg-dark-100"
                                                >
                                                    <UserProfileImage id={user.id} hasImage={user.has_profile_image} styles="size-5" />
                                                    <span>{user.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.communities && data.communities.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-primary-300">Communities</h1>
                                        <div className="flex flex-col bg-dark-200 rounded-md">
                                            {data.communities.map((community, i) => (
                                                <Link
                                                    href={`/app/communities/${community.id}`} key={i} onClick={handleResultClick}
                                                    className="h-8 flex flex-row justify-between items-center gap-2 px-2 py-1 rounded-md transition duration-50 cursor-pointer hover:bg-dark-100"
                                                >
                                                    <CommunityTag id={community.id} name={community.name} colorID={community.color} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 justify-left text-primary-300">
                                <SadFaceIcon width="20px" />
                                <span className="transform -translate-y-[1px]">No results</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

function formatCreatedAt(createdAt: Date, currentDate: Date) {
    return formatDistance(createdAt, currentDate, { addSuffix: true })
}

export function CommunityTag({ id, name, colorID }:{ id: number, name: string, colorID?: number }) {
    const bgColor = getCommunityColor(colorID);
    return (
        <div>
            <span className={`${bgColor} text-sm rounded-full px-[7px] flex items-center justify-center`}>
                <span className="transform -translate-y-[1px]">{formatCommunityName(name, true)}</span>
            </span>
        </div>
    );
}