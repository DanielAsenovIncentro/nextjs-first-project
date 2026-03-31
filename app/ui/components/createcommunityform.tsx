"use client";

import { communityColors, formatCommunityName, getCommunityColor } from "@/app/lib/utils";
import { ChangeEvent, Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { AddImageIcon } from "./icons";
import clsx from "clsx";
import { createCommunity } from "@/app/lib/action";

export function CreateCommunityForm({ userID }: { userID: number }) {
    const [errorMessage, formAction, isPending] = useActionState(createCommunity, undefined);

    const [selectedColor, setSelectedColor] = useState<number>(-1);
    const [preview, setPreview] = useState<string>();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <form action={formAction}>
            <input type="hidden" name="color" value={selectedColor} />
            <input type="hidden" name="user-id" value={userID} />
            <div className="grid grid-cols-[auto_280px]">
                <input type="hidden" name="user-id" value={userID} />
                <div className="flex flex-col gap-2 px-4">
                    <div className="flex flex-row w-full">
                        <span className="text-xl font-bold flex items-center justify-center mr-2">s/</span>
                        <input
                            type="text" name="name" placeholder="Tag" value={name} onChange={(e) => { setName(e.target.value.replaceAll(" ", "")); }} required
                            className="w-full border-1 border-light-300 px-4 py-2 rounded-md outline-none focus:border-primary-300 transition duration-150"
                        />
                    </div>
                    <input
                        type="text" name="description" placeholder="Description" value={description} onChange={(e) => { setDescription(e.target.value); }}
                        className="border-1 border-light-300 px-4 py-2 rounded-md w-full outline-none focus:border-primary-300 transition duration-150"
                    />
                    <ColorSelect selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </div>
                <ImageSelect preview={preview} setPreview={setPreview} />
            </div>
            <h1 className="font-bold text-2xl p-4 mt-8 ml-2">Preview</h1>
            <div className="px-6 py-2">
                <CommunityPreview color={selectedColor} name={name} description={description} imageURL={preview} />
            </div>
            <div className="mt-2 ml-4">
                <button type="submit" className="rounded-md px-4 py-2 bg-primary-600 text-light-100 cursor-pointer transition duration-100 hover:bg-primary-800">Create</button>
            </div>
        </form>
    );
}

function ColorSelect({ selectedColor, setSelectedColor }: { selectedColor: number, setSelectedColor: Dispatch<SetStateAction<number>> }) {
    const communityColorObjects: Array<{ id: number, color: string }> = Array();
    for (const [key, value] of Object.entries(communityColors)) {
        const obj = { id: Number(key), color: value }
        communityColorObjects.push(obj);
    }

    return (
        <div className="grid grid-cols-5 w-full h-full gap-2">
            {communityColorObjects.map((communityColor, i) => (
                <div
                    key={i} onClick={() => { setSelectedColor(communityColor.id) }}
                    className={`${communityColor.color} ${selectedColor == communityColor.id && "border-1 border-light-300 !m-0"} m-px w-full rounded-md brightness-80 cursor-pointer transition duration-100 hover:border-light-300 hover:brightness-100`}
                ></div>
            ))}
        </div>
    );
}

function CommunityPreview({ name, color, description, imageURL }: { name: string, color: number, description: string, imageURL: string|undefined }) {
    return (
        <div className="relative w-full h-32 z-1 bg-dark-100 rounded-md">
            <div className="relative w-full h-full rounded-md overflow-hidden after:absolute after:size-full after:bg-linear-to-r after:from-dark-300 after:to-transparent after:top-0 after:left-0">
                <img
                    src={imageURL} alt="Community Banner"
                    className="absolute w-full h-auto brightness-75 z-0 -translate-y-1/3 transition duration-100"
                />
            </div>
            <div className="absolute left-0 bottom-0 opacity-100 flex flex-row items-center gap-2">
                <CommunityTag name={name} color={color} />
                {description && (
                    <span>{description}</span>
                )}
            </div>
        </div>
    );
}

function CommunityTag({ name, color }: { name: string, color: number }) {
    const bgColor = getCommunityColor(color);
    return (
        <div className={`${bgColor} rounded-tr-full pl-3 pr-6 py-1 flex select-none`}>
            <span className="font-bold text-2xl -translate-y-[1px]">{formatCommunityName(name, true)}</span>
        </div>
    );
}

function ImageSelect({ preview, setPreview }:{ preview: string|undefined, setPreview: Dispatch<SetStateAction<string|undefined>> }) {
    const [selectedFile, setSelectedFile] = useState<File>();

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