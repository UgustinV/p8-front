"use client";

import { useState } from "react";
import { PropertyBase } from "@/app/lib/definitions";
import { PropertyCard } from "@/components/propertyCard";

export const LikedPropertiesGrid = ({ initialProperties }: { initialProperties: PropertyBase[] }) => {
    const [properties, setProperties] = useState(initialProperties);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-17.5">
            {properties.map((property) => (
                <PropertyCard
                    key={property.id}
                    property={property}
                    liked
                    onUnlike={(id) => setProperties((prev) => prev.filter((p) => p.id !== id))}
                />
            ))}
        </div>
    );
}