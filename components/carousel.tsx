"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

type CarouselProps = {
    images: string[];
    alt: string;
    startIndex?: number;
};

export const Carousel = ({ images, alt, startIndex = 0 }: CarouselProps) => {
    const [index, setIndex] = useState(startIndex);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasMultiple = images.length > 1;

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    const goPrev = useCallback(() => {
        setIndex((current) => (current === 0 ? images.length - 1 : current - 1));
    }, [images.length]);

    const goNext = useCallback(() => {
        setIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    }, [images.length]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") goPrev();
        if (event.key === "ArrowRight") goNext();
    };

    if (images.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="relative inline-block outline-none"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={alt}
            onKeyDown={handleKeyDown}
        >
            {/* remounting on index change replays the fade-in animation */}
            <Image
                key={index}
                src={images[index]}
                alt={`${alt} - image ${index + 1} sur ${images.length}`}
                width={1600}
                height={1000}
                sizes="90vw"
                priority
                className="block w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-[10px]"
                style={{ animation: "fadeIn 0.4s ease-in-out" }}
            />

            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Image précédente"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-4 py-2 rounded-full hover:cursor-pointer"
                    >
                        <Image src="/backward.svg" alt="" width={20} height={20} />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Image suivante"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-4 py-2 rounded-full hover:cursor-pointer"
                    >
                        <Image src="/forward.svg" alt="" width={20} height={20} />
                    </button>
                    <div aria-live="polite" className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}/{images.length}
                    </div>
                </>
            )}
        </div>
    );
};