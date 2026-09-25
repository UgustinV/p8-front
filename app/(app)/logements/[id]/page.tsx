import { getProperty } from "@/app/actions/properties";
import { PropertyGallery } from "@/components/propertyGallery";
import { MainButton } from "@/components/mainButton";
import { Tag } from "@/components/tag";
import Image from "next/image";
import Link from "next/link";

export default async function LogementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const property = await getProperty(id)
    return (
        <div className="flex flex-col w-full gap-6 lg:mx-40 mx-4 lg:my-21.5 my-4">
            <Link href="/logements" className="flex flex-row items-center gap-1 bg-(--light-grey) p-2.5 rounded-[10px] w-fit my-4">
                <Image src="/back.svg" alt="Retour aux annonces" width={24} height={24} />
                <span className="text-(--dark-grey) font-medium">Retour aux annonces</span>
            </Link>
            <div className="flex flex-col lg:flex-row w-full gap-2.5">
                <div className="flex flex-col w-full lg:w-2/3 gap-6">
                    <PropertyGallery images={property.pictures ?? []} alt={property.title} />
                    <div className="bg-white rounded-[10px] p-6">
                        <h1 className="font-bold text-2xl mb-2.5">{property.title}</h1>
                        <div className="flex flex-row items-center gap-2 mb-8">
                            <Image src="/localisation.svg" alt="Icône de localisation" width={16} height={16} />
                            <h2 className="text-(--dark-grey) font-medium text-sm">{property.location}</h2>
                        </div>
                        <p className="font-medium">{property.description}</p>
                        <div className="flex flex-col my-10 gap-4">
                            <span className="font-bold">Équipements</span>
                            <div className="grid grid-cols-3 gap-2 w-full lg:max-w-2/5 items-center">
                                {property.equipments?.map((equipment, index) => (
                                    <Tag key={index} label={equipment}></Tag>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col my-10 gap-4">
                            <span className="font-bold">Catégories</span>
                            <div className="grid grid-cols-3 gap-2 w-full lg:max-w-2/5 items-center">
                                {property.tags?.map((tag, index) => (
                                    <Tag key={index} label={tag}></Tag>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start bg-white w-full lg:w-1/3 h-fit p-6 rounded-[10px] gap-2 text-[16px]">
                    <span className="font-bold">Votre hôte</span>
                    <div className="flex flex-row items-center gap-4.5 py-4">
                        <Image src={property.host?.picture ?? "/default-profile.png"} alt={"Photo de profil de l'hôte"} width={82} height={82} className="w-20.5 h-20.5 rounded-[10px]" />
                        <p className="font-medium">{property.host?.name}</p>
                        <div className="flex flex-row gap-1 bg-(--light-grey) w-fit p-2 rounded-[10px]">
                            <Image src="/rating.svg" alt="Icône de notation" width={16} height={16} />
                            <p className="font-medium">{property.rating_avg}</p>
                        </div>
                    </div>
                    <MainButton label="Contacter l'hôte" href={`/messages/${property.host?.id}`}></MainButton>
                </div>
            </div>
        </div>
    );
}