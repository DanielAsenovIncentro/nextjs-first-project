"use client";

import { formatCommunityName, getCommunityColor } from "@/app/lib/utils";
import postgres from "postgres";
import { Dropdown } from "./dropdown";
import { ChangeEvent, ChangeEventHandler, useActionState, useEffect, useState } from "react";
import { AddImageIcon, ArrowDownIcon } from "./icons";
import clsx from "clsx";
import { createPost } from "@/app/lib/action";
import { useSearchParams } from "next/navigation";

export function CreatePostForm({ communities, userID }: { communities: Array<postgres.Row>, userID: number }) {
    const [errorMessage, formAction, isPending] = useActionState(createPost, undefined);
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const communityID = params.has("community") ? Number(params.get("community")) : -1;

    return (
        <form action={formAction} className="grid grid-cols-[auto_280px]">
            <input type="hidden" name="user-id" value={userID} />
            <div className="flex flex-col gap-2 px-4">
                <CommunitySelect communities={communities} communityID={communityID} />
                <input
                    type="text" name="title" placeholder="Title" required
                    className="border-1 border-light-300 px-4 py-2 rounded-md outline-none focus:border-primary-300 transition duration-150"
                />
                <textarea
                    name="content" placeholder="Content" required
                    className="border-1 border-light-300 px-4 py-2 rounded-md w-full outline-none focus:border-primary-300 transition duration-150 min-h-47 max-h-72"
                />
            </div>
            <ImageSelect />
            <div className="mt-2 ml-4">
                <button type="submit" className="rounded-md px-4 py-2 bg-primary-600 text-light-100 cursor-pointer transition duration-100 hover:bg-primary-800">Post</button>
            </div>
        </form>
    );
}

function CommunitySelect({ communities, communityID }: { communities: Array<postgres.Row>, communityID: number }) {
    const [selectedCommunity, setSelectedCommunity] = useState(communityID);
    const [showDropdown, setShowDropdown] = useState(false);

    const selectedCommunityData: { name: string, color: number|null } = {name: "", color: null}
    communities.forEach(community => {
        if(community.id == selectedCommunity) {
            selectedCommunityData.name = community.name;
            selectedCommunityData.color = community.color;
        }
    });
    
    function handleCommunityClick(community: postgres.Row) {
        setSelectedCommunity(community.id);
        setShowDropdown(false);
    }

    function handleGeneralCommunityClick() {
        setSelectedCommunity(-1);
        setShowDropdown(false);
    }

    return (
        <div>
            <input type="hidden" name="community" value={selectedCommunity} />
            <Dropdown activatedBy={(
                <div className="grid grid-cols-[auto_25px] px-4 py-2 border-1 border-light-300 rounded-md cursor-pointer select-none" onClick={() => { setShowDropdown(true); }}>
                    {selectedCommunity == -1 ? (
                        <span>General</span>
                    ) : (
                        <span className={`${getCommunityColor(selectedCommunityData.color)} text-sm rounded-full px-[7px] flex items-center justify-center w-max`}>
                            <span className="transform -translate-y-[1px]">{formatCommunityName(selectedCommunityData.name, true)}</span>
                        </span>
                    )}
                    <ArrowDownIcon width="25px" className="text-light-100" />
                </div>
            )} content={(
                <div className="w-[250px] flex flex-col max-h-43 overflow-y-auto select-none">
                    <div
                        key={-1} onClick={handleGeneralCommunityClick}
                        className="cursor-pointer transition duration-50 hover:bg-primary-600 px-4 py-1"
                    >
                        <span>General</span>
                    </div>
                    {communities.map(community => (
                        <div
                            key={community.id} onClick={() => { handleCommunityClick(community) }}
                            className="cursor-pointer transition duration-50 hover:bg-primary-600 px-4 py-1"
                        >
                            <span className={`${getCommunityColor(community.color)} text-sm rounded-full px-[7px] flex items-center justify-center w-max`}>
                                <span className="transform -translate-y-[1px]">{formatCommunityName(community.name, true)}</span>
                            </span>
                        </div>
                    ))}
                </div>
            )} className="!bg-dark-100" showDropdown={showDropdown} />
        </div>
    );
}

export function ImageSelect() {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [preview, setPreview] = useState<string>();

    useEffect(() => {
        if (!selectedFile) { setPreview(undefined); return; }
        const objectURL = URL.createObjectURL(selectedFile);
        setPreview(objectURL);
        return () => URL.revokeObjectURL(objectURL); // Memory cleanup
    }, [selectedFile]);

    function onSelectFile(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        if (!event.target.files || event.target.files.length <= 0) { setSelectedFile(undefined); return; }
        setSelectedFile(event.target.files[0]);
    }

    return (
        <div className="w-64">
            {selectedFile && (
                <div className="w-64 h-auto border-2 border-light-300 rounded-t-md border-dashed relative">
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-7 cursor-pointer z-0 text-white">Change Image</span>
                    <img src={preview} alt="Selected Image" />
                </div>
            )}
            <div className={`relative w-64 h-64 hover:[&>input]:border-primary-300 hover:[&>div]:text-primary-300 hover:[&>div]:rotate-z-3 hover:[&>div]:scale-103 ${selectedFile && "!h-auto [&>div]:hidden"}`}>
                <input
                    type="file" name="image" multiple={false} onChange={(event) => { onSelectFile(event) }}
                    className={clsx(
                        "cursor-pointer transition duration-150 text-transparent z-[2]", {
                        "absolute w-full h-full border-2 border-light-300 p-2 rounded-md border-dashed": !selectedFile,
                        "w-full h-8 bg-primary-600 rounded-b-md hover:bg-primary-800 text-light-100 opacity-50": selectedFile
                    }
                    )}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[0] text-light-300 transition duration-100">
                    <AddImageIcon width="35px" />
                </div>
            </div>
        </div>
    );
}