"use client";

import clsx from "clsx";
import postgres from "postgres";
import { SetStateAction, useEffect, useState } from "react";
import { DeleteMessageButton } from "./deletemessagebutton";
import { BackIcon, SendMessageIcon } from "./icons";
import Link from "next/link";
import { UserProfileImage } from "./user";
import { onDMGoBack, sendDM } from "@/app/lib/action";
import { DMListSkeleton } from "../skeletons";
import { Dispatch } from "react";
import { useRef } from "react";

const emojis = require("emoji.json");
const MAX_EMOJI_LIST_DISPLAY = 7;
const MESSAGE_REFRESH_INTERVAL = 1000; // ms

const emotes: Record<string, string> = {
    ":shrug:": "¯\\_(ツ)_/¯"
}

const reactions: Record<number, string> = {
    0: "❤️",
    1: "🤣",
    2: "😄",
    3: "😭"
}

function parseEmotes(text: string) {
    Object.keys(emotes).forEach(emoteKey => {
        if (text.includes(emoteKey)) {
            text = text.replaceAll(emoteKey, emotes[emoteKey]);
        }
    });
    return text;
}

function updateTyping(user1ID: number, user2ID: number, typing: boolean) {
    const baseURL = window.location.href.split("/app")[0];
    const url = `${baseURL}/api/get/typing`;
    const requestOptions = {
        method: "POST",
        body: JSON.stringify({ "user1": user1ID, "user2": user2ID, "typing": typing })
    }
    fetch(url, requestOptions);
}

export function ClientDMContainer({ user1, user2 }: { user1: postgres.Row, user2: postgres.Row }) {
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [goBack, setGoBack] = useState(false);
    const [emojiMatch, setEmojiMatch] = useState("");
    const [typing, setTyping] = useState(false); // Check whether the other user is typing
    const [messages, setMessages] = useState([]);

    const inputRef = useRef<HTMLInputElement>(null);

    function checkForEmojies(text: string) {
        if (!text.includes(":")) return;
        const strings = text.split(":");
        const last = strings[strings.length - 1];
        if (last.includes(" ")) setEmojiMatch("");
        else setEmojiMatch(last);
    }

    // function checkMarkdown(text: string) {
    //     if(!text.includes("*")) return;
    //     const strings = text.split("*");
    //     if(strings.length <= 1 || strings.length % 2 == 0) return
    //     console.log(strings);
    //     for(let i = 1; i < strings.length; i += 2) {
    //         const formattedText = text.replace(`*${strings[i]}*`, `<b>${strings[i]}</b>`);
    //         setContent(formattedText);
    //     }
    // }

    function handleMessageChange(value: string) {
        checkForEmojies(value);
        const parsedEmotesText = parseEmotes(value);
        setContent(parsedEmotesText);

        // checkMarkdown(parsedEmotesText);
        updateTyping(user1.id, user2.id, parsedEmotesText.length > 0);
    }

    function handleSubmit() {
        setSubmitted(content);
        setContent("");
        updateTyping(user1.id, user2.id, false);
    }

    function handleSubmitGoBack() {
        setGoBack(true);
    }

    const focusInput = () => {
        inputRef.current?.focus();
    }

    useEffect(() => {
        setSubmitted("");
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            const baseURL = window.location.href.split("/app")[0];
            const typingUrl = `${baseURL}/api/get/typing?user1=${user1.id}&user2=${user2.id}`;
            fetch(typingUrl).then(response => response.json()).then(res => {
                if (res.users.includes(user1.id)) setTyping(true);
                else setTyping(false);
            })
            const messagesURL = `${baseURL}/api/get/messages?user1=${user1.id}&user2=${user2.id}`;
            fetch(messagesURL).then(response => response.json()).then(res => {
                setMessages(res);
            })
        }, MESSAGE_REFRESH_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    });

    return (
        <>
            {!goBack ? (
                <div className="grid grid-rows-[50px_auto_60px] h-full max-h-[calc(100vh-50px)] bg-dark-100 p-2 rounded-t-md relative">
                    <div className="bg-dark-300 flex flex-row items-center justify-left gap-2 pl-2 rounded-md">
                        <form action={onDMGoBack} onSubmit={handleSubmitGoBack} className="opacity-60 transition duration-100 hover:transform hover:translate-x-1 hover:opacity-100 cursor-pointer flex">
                            <button type="submit" className="cursor-pointer">
                                <BackIcon width="30px" className="mr-2" />
                            </button>
                        </form>
                        <Link href={`/app/users/${user2.id}`} className="flex flex-row items-center gap-3 h-full px-4 transition duration-100 hover:bg-dark-200 -translate-x-2">
                            <UserProfileImage id={user2.id} hasImage={user2.has_profile_image} styles="size-8" />
                            <span className="font-bold">{user2.name}</span>
                        </Link>
                    </div>
                    <div className="relative overflow-y-scroll flex flex-col-reverse no-scrollbar">
                        <Messages messages={messages} user1={user1} user2={user2} submitted={submitted} typing={typing} />
                    </div>
                    <form action={sendDM} onSubmit={handleSubmit} className="grid grid-cols-[auto_50px] gap-2 mx-2">
                        <div className="flex m-auto mt-0 w-full h-12 relative">
                            <input type="hidden" name="user1" value={user1.id} />
                            <input type="hidden" name="user2" value={user2.id} />
                            <input
                                maxLength={500} ref={inputRef}
                                type="text" placeholder={`Message ${user2.name}...`} name="content" onChange={(e) => { handleMessageChange(e.target.value) }} value={content}
                                className="outline-none w-full px-5 border-1 border-light-300 rounded-full"
                            />
                            {emojiMatch && (
                                <EmojiList query={emojiMatch} content={content} setContent={setContent} setEmojiMatch={setEmojiMatch} focusInput={focusInput} />
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-primary-600 text-light-300 w-12 h-12 rounded-full flex transition duration-100 hover:bg-primary-900 cursor-pointer hover:[&>*]:-rotate-z-10"
                        >
                            <SendMessageIcon width="30px" className="m-auto translate-x-[2px] transition duration-200" />
                        </button>
                    </form>
                </div>
            ) : (
                <DMListSkeleton />
            )}
        </>
    );
}

function Messages({ messages, user1, user2, submitted, typing }: { messages: Array<postgres.Row>, user1: postgres.Row, user2: postgres.Row, submitted: string, typing: boolean }) {
    return (
        <div className="flex flex-col py-4 w-full h-max gap-1 absolute">
            {messages.map(message => (
                <div key={message.id} className={clsx(
                    "flex flex-row items-center w-full px-4", {
                    "justify-end": message.author == user1.id,
                    "justify-start": message.author == user2.id
                })}>
                    <Message message={message} user1={user1} user2={user2} />
                </div>
            ))}
            {submitted && (
                <div className="flex flex-row items-center w-full px-4 justify-end">
                    <Message message={submitted} user1={user1} user2={user2} />
                </div>
            )}
            {typing && (
                <div className="typing-animation relative w-10 h-6 flex flex-row justify-center items-center gap-[3px] bg-dark-50 after:bg-dark-50 rounded-sm ml-12 after:size-2 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:rotate-z-45 after:-translate-x-1">
                    <div className="size-[6px] rounded-full bg-light-300"></div>
                    <div className="size-[6px] rounded-full bg-light-300"></div>
                    <div className="size-[6px] rounded-full bg-light-300"></div>
                </div>
            )}
        </div>
    )
}

function Message({ message, user1, user2 }: { message: postgres.Row | string, user1: postgres.Row, user2: postgres.Row }) {

    if (typeof (message) == "string") {
        return (
            <>
                {message.length > 0 && (
                    <div className="flex items-end gap-1 flex-row-reverse">
                        <div className="dm-message w-max px-4 py-2 pb-3 rounded-md relative max-w-64 bg-primary-900 after:bg-primary-900 after:right-0">
                            <span>{message}</span>
                        </div>
                        <span className="opacity-40 text-xs absolute left-0 select-none text-primary-300 opacity-80">sending...</span>
                    </div>
                )}
            </>
        )
    } else {
        const date = message.created_at.toString();
        const formattedTime = formatTime(date);

        return (
            <div className={clsx(
                "flex items-end gap-1", {
                "flex-row-reverse": message.author == user1.id
            })}>
                <div className={clsx(
                    "dm-message relative w-max px-4 py-2 pb-3 rounded-md relative max-w-64 hover:[&>form]:block", {
                    "bg-primary-600 after:bg-primary-600 after:right-0": message.author == user1.id,
                    "bg-dark-50 after:bg-dark-50 after:left-0 after:translate-x-[-100%] ml-8": message.author == user2.id
                })}>
                    <span>{message.content}</span>
                    {message.author == user1.id && (
                        <DeleteMessageButton messageID={message.id} />
                    )}
                    {message.reaction && (
                        <div className="select-none">
                            {message.author == user1.id ? (
                                <div className="absolute left-0 bottom-2 -translate-x-1/2 bg-dark-100 rounded-full border-2 border-primary-600 bg-primary-900 size-7 flex justify-center items-center">
                                    <div className="-translate-y-[1px]">{reactions[message.reaction]}</div>
                                </div>
                            ) : (
                                <div className="absolute right-0 bottom-2 translate-x-1/2 bg-dark-100 rounded-full border-2 border-dark-50 bg-dark-300 size-7 flex justify-center items-center">
                                    <div className="-translate-y-[2px]">{reactions[message.reaction]}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <span className={clsx(
                    "opacity-40 text-xs absolute left-0 select-none", {
                    "text-primary-300 opacity-80": message.author == user1.id
                }
                )}>{formattedTime}</span>
            </div>
        );
    }
}

function EmojiList({ query, content, setContent, setEmojiMatch, focusInput }: { query: string, content: string, setContent: Dispatch<SetStateAction<string>>, setEmojiMatch: Dispatch<SetStateAction<string>>, focusInput: () => void }) {
    const selectedEmojies = [];

    for (let emoji of emojis) {
        if (emoji.name.replaceAll(" ", "").includes(query) && selectedEmojies.length < MAX_EMOJI_LIST_DISPLAY) {
            selectedEmojies.push(emoji);
        }
    }

    function handleClick(emoji: { name: string, char: string }) {
        const fullQuery = `:${query}`;
        const index = content.indexOf(fullQuery);
        const newContent = content.substring(0, index) + emoji.char;
        setContent(newContent);
        setEmojiMatch("");
        focusInput();
    }

    function getHighlightedName(query: string, emojiName: string) {
        const shortName = emojiName.split(":")[0];
        if (!shortName.includes(query)) return shortName;
        const index = shortName.indexOf(query);
        const start = shortName.substring(0, index);
        const end = shortName.substring(index + query.length);
        return <span>{start}<span className="text-primary-300">{query}</span>{end}</span>
    }

    return (
        <>
            {selectedEmojies.length > 0 && (
                <div className="absolute bottom-0 -translate-y-16 flex flex-col bg-dark-300 py-2 rounded-md w-full">
                    {selectedEmojies.map((emoji, i) => (
                        <div
                            key={i} onClick={() => { handleClick(emoji) }}
                            className="flex flex-row justify-between items-center cursor-pointer hover px-2 transition duration-50 hover:bg-primary-900 py-1">
                            <span className="text-xl -translate-y-[2px]">{emoji.char}</span>
                            <span className="mr-2">{getHighlightedName(query, emoji.name)}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

function formatTime(date: string) {
    const fullTime = date.split("T")[1].split(".")[0];
    return fullTime.split(":")[0] + ":" + fullTime.split(":")[1];
}