"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Carousel } from "@/components/carousel";

type PropertyGalleryProps = {
    images: string[];
    alt: string;
};

export const PropertyGallery = ({ images, alt }: PropertyGalleryProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const close = useCallback(() => setOpenIndex(null), []);

    useEffect(() => {
        if (openIndex === null) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };
        document.addEventListener("keydown", handleKeyDown);
        // prevent background scroll while the modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [openIndex, close]);

    return (
        <>
            <div className="grid grid-cols-4 grid-rows-5 lg:grid-cols-4 lg:grid-rows-2 gap-2 lg:gap-4 h-150">
                {images.map((image, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        aria-label={`Agrandir l'image ${index + 1}`}
                        className={`relative hover:cursor-pointer ${index === 0 ? "col-span-4 row-span-4 lg:col-span-2 lg:row-span-2" : ""}`}
                    >
                        <Image
                            src={image}
                            alt={`Image ${index + 1} de la propriété`}
                            fill
                            sizes={index === 0 ? "50vw" : "25vw"}
                            className="object-cover rounded-[10px]"
                        />
                    </button>
                ))}
            </div>

            {openIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={alt}
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={close}
                >
                    <div className="relative" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            onClick={close}
                            aria-label="Fermer"
                            className="absolute -top-10 right-0 text-white text-2xl hover:cursor-pointer"
                        >
                            ✕
                        </button>
                        <Carousel images={images} alt={alt} startIndex={openIndex} />
                    </div>
                </div>
            )}
        </>
    );
};