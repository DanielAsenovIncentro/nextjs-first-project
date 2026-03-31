"use client";

import Link from "next/link";
import { BackIcon } from "./components/icons";

// Basic skeletons ================================================================================================

function TextSkeleton({ className }: { className?: string }) {
    return (
        <div className={`h-5 rounded-sm bg-dark-50 ${className ? className : "w-32"}`}></div>
    )
}

function CircleSkeleton({ className }: { className?: string }) {
    return (
        <div className={`rounded-full bg-dark-50 ${className ? className : "size-8"}`}></div>
    )
}

// Component skeletons ================================================================================================

export function ImagePostSkeleton() {
    return (
        <div className="h-48 w-full bg-dark-100 rounded-md overflow-hidden flex flex-row justify-between">
            <div className="p-3 flex flex-col gap-3 w-full">
                <div className="flex flex-row items-center gap-3">
                    <CircleSkeleton />
                    <TextSkeleton />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <TextSkeleton className="w-full" />
                    <TextSkeleton className="w-2/5" />
                </div>
            </div>
            <div className="flex flex-row">
                <div className="p-3">
                    <div className="bg-dark-50 w-84 h-full rounded-md"></div>
                </div>
                <div className="h-full bg-dark-200 flex flex-col justify-between items-center py-2 w-[50px]">
                    <CircleSkeleton />
                    <CircleSkeleton />
                </div>
            </div>
        </div>
    )
}

export function TextPostSkeleton() {
    return (
        <div className="h-32 w-full bg-dark-100 rounded-md overflow-hidden grid grid-cols-[auto_50px]">
            <div className="p-3 flex flex-col gap-3">
                <div className="flex flex-row items-center gap-3">
                    <CircleSkeleton />
                    <TextSkeleton />
                </div>
                <div className="flex flex-col gap-3">
                    <TextSkeleton className="w-full" />
                    <TextSkeleton className="w-2/5" />
                </div>
            </div>
            <div className="h-full bg-dark-200 flex flex-col justify-between items-center py-2">
                <CircleSkeleton />
                <CircleSkeleton />
            </div>
        </div>
    )
}

export function CommentSkeleton() {
    return (
        <div className="p-3 flex flex-col gap-3 bg-dark-100 mx-2 rounded-md">
            <div className="flex flex-row items-center gap-3">
                <CircleSkeleton />
                <TextSkeleton />
            </div>
            <div className="flex flex-col gap-3">
                <TextSkeleton className="w-4/5" />
            </div>
        </div>
    )
}

export function LongCommentSkeleton() {
    return (
        <div className="p-3 flex flex-col gap-3 bg-dark-100 mx-2 rounded-md">
            <div className="flex flex-row items-center gap-3">
                <CircleSkeleton />
                <TextSkeleton />
            </div>
            <div className="flex flex-col gap-3">
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-3/5" />
            </div>
        </div>
    )
}

export function RightMessageSkeleton() {
    return (
        <div className="flex flex-row items-center w-full px-4 justify-end">
            <div className="flex items-end gap-1 flex-row-reverse">
                <div className="dm-message w-32 h-12 px-4 py-2 pb-3 rounded-md relative max-w-64 bg-dark-300 after:bg-dark-300 after:right-0"></div>
                <span className="opacity-40 text-xs absolute left-0 select-none text-primary-300 opacity-80">
                    <TextSkeleton className="w-12" />
                </span>
            </div>
        </div>
    );
}

export function LeftMessageSkeleton() {
    return (
        <div className="flex flex-row items-center w-full px-4 justify-end">
            <div className="flex items-end gap-1 flex-row-reverse w-full justify-end">
                <div className="dm-message translate-x-4 w-32 h-12 px-4 py-2 pb-3 rounded-md relative max-w-64 bg-dark-50 after:bg-dark-50 after:left-0 after:translate-x-[-100%] ml-8"></div>
                <span className="opacity-40 text-xs absolute left-0 select-none text-primary-300 opacity-80">
                    <TextSkeleton className="w-12" />
                </span>
            </div>
        </div>
    );
}

export function LongRightMessageSkeleton() {
    return (
        <div className="flex flex-row items-center w-full px-4 justify-end">
            <div className="flex items-end gap-1 flex-row-reverse">
                <div className="dm-message w-64 h-24 px-4 py-2 pb-3 rounded-md relative max-w-64 bg-dark-300 after:bg-dark-300 after:right-0"></div>
                <span className="opacity-40 text-xs absolute left-0 select-none text-primary-300 opacity-80">
                    <TextSkeleton className="w-12" />
                </span>
            </div>
        </div>
    );
}

export function LongLeftMessageSkeleton() {
    return (
        <div className="flex flex-row items-center w-full px-4 justify-end">
            <div className="flex items-end gap-1 flex-row-reverse w-full justify-end">
                <div className="dm-message translate-x-4 w-64 h-32 px-4 py-2 pb-3 rounded-md relative max-w-64 bg-dark-50 after:bg-dark-50 after:left-0 after:translate-x-[-100%] ml-8"></div>
                <span className="opacity-40 text-xs absolute left-0 select-none text-primary-300 opacity-80">
                    <TextSkeleton className="w-12" />
                </span>
            </div>
        </div>
    );
}

export function DMUserSkeleton() {
    return (
        <div>
            <div className="flex flex-row justify-between bg-dark-200 py-2 divide-1 px-3 rounded-md w-full h-12">
                <div className="flex flex-row items-center gap-2">
                    <CircleSkeleton />
                    <TextSkeleton />
                </div>
            </div>
        </div>
    );
}

// Section skeletons ================================================================================================

export function HomePagePostsSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <TextPostSkeleton />
            <ImagePostSkeleton />
            <ImagePostSkeleton />
            <TextPostSkeleton />
            <ImagePostSkeleton />
            <TextPostSkeleton />
        </div>
    );
}

export function PostCommentsSkeleton() {
    return (
        <div className="flex flex-col h-full">
            <h1 className="flex justify-center items-center font-bold py-2">Comments</h1>
            <div className="py-2 text-transparent flex flex-row gap-2 justify-center items-center bg-dark-300 rounded-sm m-2 py-1 select-none">Add comment</div>
            <div className="flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-155px)]">
                <CommentSkeleton />
                <LongCommentSkeleton />
                <CommentSkeleton />
                <LongCommentSkeleton />
                <LongCommentSkeleton />
                <CommentSkeleton />
                <LongCommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
            </div>
        </div>
    );
}

export function MessagesSkeleton() {
    return (
        <div className="flex flex-col py-4 w-full h-max gap-2 absolute">
            <RightMessageSkeleton />
            <LeftMessageSkeleton />
            <LongRightMessageSkeleton />
            <LongLeftMessageSkeleton />
            <LeftMessageSkeleton />
            <RightMessageSkeleton />
            <RightMessageSkeleton />
            <LongLeftMessageSkeleton />
            <RightMessageSkeleton />
            <LongRightMessageSkeleton />
        </div>
    )
}

export function DMListSkeleton() {
    return (
        <div className="bg-dark-100 w-full h-full rounded-t-md p-2 flex flex-col gap-2">
            <div className="bg-dark-300 h-12 rounded-md flex items-center justify-center">
                <h1 className="font-bold">DM List</h1>
            </div>
            <div className="flex flex-col gap-1 opacity-50">
                <DMUserSkeleton />
                <DMUserSkeleton />
                <DMUserSkeleton />
                <DMUserSkeleton />
                <DMUserSkeleton />
                <DMUserSkeleton />
            </div>
        </div>
    );
}

export function PostSkeleton() {
    return (
        <div className="bg-dark-300 flex flex-col p-2">
            <div>
                <Link href="/" className="text-light-100 size-auto opacity-50 z-1 transition duration-100 hover:transform hover:translate-x-[5px] hover:opacity-100 w-[max-content] flex flex-row gap-2 items-center ml-2 mt-2 pr-2 select-none">
                    <BackIcon width="30px" />
                    <span>Back</span>
                </Link>
            </div>
            <div className="ml-2">
                <div className="flex flex-row items-center gap-3 m-4">
                    <CircleSkeleton className="size-10" />
                    <TextSkeleton />
                </div>
                <div className="mb-5">
                    <TextSkeleton className="w-92 ml-2" />
                </div>
                <div className="flex flex-col gap-2 [&>*]:bg-dark-100">
                    <TextSkeleton className="w-[calc(100%-16px)] m-auto" />
                    <TextSkeleton className="w-[calc(100%-16px)] m-auto" />
                    <TextSkeleton className="w-128 ml-2" />
                </div>
                <div className="mt-4 ml-2 flex flex-row items-center gap-4">
                    <div className="bg-dark-50 w-18 h-12 rounded-full"></div>
                    <div className="bg-dark-50 w-18 h-12 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}