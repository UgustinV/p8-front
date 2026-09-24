import { listProperties } from "@/app/actions/properties";
import { listUserFavorites } from "@/app/actions/users";
import { getSession } from "@/app/lib/session";
import { HowToCard } from "@/components/howToCard";
import { PropertyCard } from "@/components/propertyCard";
import Image from "next/image";
export default async function LogementsPage() {
    const session = await getSession();
    const user = session?.user;
    const likedProperties = user ? await listUserFavorites(user.id) : [];
    const properties = await listProperties();
    const howToContents = [
        { title: "Recherchez", description: "Entrez votre destination, vos dates et laissez Kasa faire le reste" },
        { title: "Réservez", description: "Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés." },
        { title: "Vivez l’expérience", description: "Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout." }
    ];
    return (
        <div className="lg:mx-40 flex flex-col w-full my-10 px-4">
            <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-[32px] font-bold text-(--main-red) mb-2">Chez vous, partout et ailleurs</h1>
                <p className="text-sm mb-10">Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.</p>
                <Image src="/properties_page_illustration.png" alt="Image illustrative des propriétés" width={1117} height={894} className="w-full object-cover h-114.5 rounded-[20px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} liked={likedProperties.some((likedProperty) => likedProperty.id === property.id)} />
                ))}
            </div>
            <div className="flex flex-col items-center text-center gap-10 px-2 lg:p-10 bg-white rounded-[10px]">
                <div className="max-w-180">
                    <h3 className="text-2xl font-bold mb-2">Comment ça marche ?</h3>
                    <p className="text-wrap wrap-normal">
                        Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel, Kasa vous aide à trouver un lieu qui vous ressemble.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 text-left">
                    {howToContents.map((content, index) => (
                        <HowToCard key={index} title={content.title} description={content.description} />
                    ))}
                </div>
            </div>
        </div>
    );
}