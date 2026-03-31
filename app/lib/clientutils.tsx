"use client";

import Image from 'next/image';
import { useState, useEffect, RefObject } from 'react';

export function useIsVisible(ref: RefObject<any>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        // Create an IntersectionObserver to observe the ref's visibility
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting)
        );

        // Start observing the element
        observer.observe(ref.current);

        // Cleanup the observer when the component unmounts or ref changes
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}

export function AppLogo({ className }: { className?: string }) {
    return (
        <>
            <Image src="/Logo.png" alt="Logo" width={100} height={100} className={className || "size-10"} />
        </>
    );
}