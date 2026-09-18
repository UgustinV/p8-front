"use client";

import { useState, useTransition } from "react";
import { PropertyBase } from "@/app/lib/definitions";
import { addFavorite, removeFavorite } from "@/app/actions/properties";
import Link from "next/dist/client/link";
import Image from "next/image";

type PropertyCardProps = {
    property: PropertyBase;
    liked?: boolean;
    onUnlike?: (propertyId: string) => void;
};

export const PropertyCard = ({ property, liked: initialLiked = false, onUnlike }: PropertyCardProps) => {
    const [liked, setLiked] = useState(initialLiked);
    const [isPending, startTransition] = useTransition();

    const handleToggleFavorite = () => {
        const nextLiked = !liked;
        setLiked(nextLiked);
        startTransition(async () => {
            try {
                if (nextLiked) {
                    await addFavorite(property.id);
                } else {
                    await removeFavorite(property.id);
                    onUnlike?.(property.id);
                }
            } catch (error) {
                setLiked(!nextLiked);
                console.error(error);
            }
        });
    };

    return (
        <div className="relative bg-white">
            <button onClick={handleToggleFavorite} disabled={isPending} className={`absolute top-4 right-4 ${liked ? "bg-(--main-red)" : "bg-(--light-grey)"} p-2 rounded-[5px] w-8 h-8 cursor-pointer hover:opacity-75`}>
                <Image src={liked ? "/favoris-selected.svg" : "/favoris.svg"} alt={property.title} width={16} height={16} className="h-4 w-4" />
            </button>
            <Link className="rounded-b-[10px]" href={`/logements/${property.id}`}>
                <Image src={property.cover ?? "/default-cover.jpg"} alt={property.title} className="w-full min-h-94 object-cover rounded-t-[10px] pb-4" width={400} height={300} />
                <div className="px-6 pb-6">
                    <h2 className="text-lg font-bold text-(--dark-grey)">{property.title}</h2>
                    <p className="text-sm text-gray-500 mb-15.5">{property.location}</p>
                    <div className="flex flex-row gap-1">
                        <p className="text-sm font-medium">{property.price_per_night} €</p><p className="text-sm text-(--dark-grey)">par nuit</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}