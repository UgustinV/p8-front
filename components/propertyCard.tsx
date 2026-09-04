import { PropertyBase } from "@/app/lib/definitions";
import Link from "next/dist/client/link";
import Image from "next/image";

export const PropertyCard = ({ property }: { property: PropertyBase }) => {
    return (
        <Link className="bg-white rounded-b-[10px]" href={`/logements/${property.id}`}>
            <Image src={property.cover ?? "/default-cover.jpg"} alt={property.title} className="w-full h-60 object-cover rounded-t-[10px] pb-4" width={400} height={300} />
            <div className="px-6 pb-6">
                <h2 className="text-lg font-bold text-(--dark-grey)">{property.title}</h2>
                <p className="text-sm text-gray-500 mb-15.5">{property.location}</p>
                <div className="flex flex-row gap-1">
                    <p className="text-sm font-medium">{property.price_per_night} €</p><p className="text-sm text-(--dark-grey)">par nuit</p>
                </div>
            </div>
        </Link>
    );
}