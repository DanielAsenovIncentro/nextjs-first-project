"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { JSX } from "react";

export function Dropdown({ content, activatedBy, direction, showDropdown, className }: { content: JSX.Element, activatedBy: JSX.Element, direction?: string, showDropdown?: boolean, className?: string }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => setOpen(false), [pathname])

    function handleOpen() {
        setOpen(!open);
    }

    return (
        <div className="relative">
            <div onClick={handleOpen}>
                {activatedBy}
            </div>
            {(showDropdown === true || (showDropdown !== false && open)) && (
                <>
                    <div
                        className="fixed w-full h-full bg-black top-0 left-0 z-2 opacity-0"
                        onClick={handleOpen}
                    ></div>
                    <div className={`absolute bg-dark-300 py-4 rounded-md z-3 ${direction == "left" ? "right-[0%]" : "left-[0%]"} ${className}`}>
                        {content}
                    </div>
                </>

            )}
        </div>
    )
}