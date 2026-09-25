"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createProperty } from "@/app/actions/properties";
import { uploadImage } from "@/app/actions/uploads";

const EQUIPMENTS_COLUMN_1 = [
    "Micro-Ondes", "Douche italienne", "Frigo", "WIFI", "Parking",
    "Sèche Cheveux", "Machine à laver", "Cuisine équipée", "Télévision",
    "Chambre Séparée", "Climatisation", "Frigo Américain",
];

const EQUIPMENTS_COLUMN_2 = [
    "Clic-clac", "Four", "Rangements", "Lit", "Bouilloire",
    "SDB", "Toilettes sèches", "Cintres", "Baie vitrée", "Hotte",
    "Baignoire", "Vue Parc",
];

const DEFAULT_CATEGORIES = [
    "Parc", "Night Life", "Culture", "Nature", "Touristique",
    "Vue sur mer", "Pour les couples", "Famille", "Forêt",
];

function ImagePickerRow({ fileName, onChange }: { fileName?: string; onChange: (file: File | null) => void }) {
    return (
        <div className="flex flex-row items-center gap-2">
            <div className="flex-1 border border-(--light-grey) rounded p-2 text-sm text-(--dark-grey) truncate">
                {fileName ?? "Aucune image sélectionnée"}
            </div>
            <label className="bg-(--main-red) text-white w-9 h-9 flex items-center justify-center rounded-[10px] font-bold hover:cursor-pointer shrink-0">
                +
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
            </label>
        </div>
    );
}

export default function NewLogementPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [location, setLocation] = useState("");

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pictureFiles, setPictureFiles] = useState<(File | null)[]>([null]);

    const [hostName, setHostName] = useState("");
    const [hostPictureFile, setHostPictureFile] = useState<File | null>(null);

    const [equipments, setEquipments] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleEquipment = (name: string) => {
        setEquipments((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
    };

    const toggleCategory = (name: string) => {
        setSelectedCategories((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
    };

    const handleAddCategory = () => {
        const label = newCategory.trim();
        if (!label || categories.includes(label)) return;
        setCategories((current) => [...current, label]);
        setSelectedCategories((current) => [...current, label]);
        setNewCategory("");
    };

    const handlePictureChange = (index: number, file: File | null) => {
        setPictureFiles((current) => current.map((item, i) => (i === index ? file : item)));
    };

    const handleAddPictureSlot = () => {
        setPictureFiles((current) => [...current, null]);
    };

    const uploadIfPresent = async (file: File | null, purpose: "property-cover" | "property-picture" | "user-picture") => {
        if (!file) return undefined;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", purpose);
        const result = await uploadImage(formData);
        return result.url;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsPending(true);

        try {
            const coverUrl = await uploadIfPresent(coverFile, "property-cover");
            const pictureUrls = (
                await Promise.all(pictureFiles.map((file) => uploadIfPresent(file, "property-picture")))
            ).filter((url): url is string => Boolean(url));
            const hostPictureUrl = await uploadIfPresent(hostPictureFile, "user-picture");

            const property = await createProperty({
                title,
                description,
                cover: coverUrl,
                location: [postalCode, location].filter(Boolean).join(" "),
                pictures: pictureUrls,
                equipments,
                tags: selectedCategories,
                host: { name: hostName, picture: hostPictureUrl },
            });

            router.push(`/logements/${property.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la création de la propriété.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col w-full gap-6 mx-4 lg:mx-40 my-10">
            <Link href="/logements" className="flex flex-row items-center gap-1 bg-(--light-grey) p-2.5 rounded-[10px] w-fit text-(--dark-grey) font-medium">
                <Image src="/back.svg" alt="Retour aux annonces" width={16} height={16} />
                Retour
            </Link>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="font-bold text-xl">Ajouter une propriété</h1>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-(--main-red) text-white text-sm font-semibold py-2 px-6 rounded-[10px] hover:cursor-pointer disabled:opacity-60"
                    >
                        {isPending ? "Ajout..." : "Ajouter"}
                    </button>
                </div>

                {error && <p role="alert" className="text-(--main-red)">{error}</p>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-5 bg-white rounded-[10px] p-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="font-medium text-sm">Titre de la propriété</label>
                            <input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex : Appartement cosy au cœur de Paris"
                                required
                                className="border border-(--light-grey) rounded p-2 text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="description" className="font-medium text-sm">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Décrivez votre propriété en détail..."
                                required
                                rows={4}
                                className="border border-(--light-grey) rounded p-2 text-sm resize-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="postalCode" className="font-medium text-sm">Code postal</label>
                            <input
                                id="postalCode"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="border border-(--light-grey) rounded p-2 text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="location" className="font-medium text-sm">Localisation</label>
                            <input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="border border-(--light-grey) rounded p-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-5 bg-white rounded-[10px] p-6">
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-sm">Image de couverture</span>
                                <ImagePickerRow fileName={coverFile?.name} onChange={setCoverFile} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-sm">Image du logement</span>
                                {pictureFiles.map((file, index) => (
                                    <ImagePickerRow key={index} fileName={file?.name} onChange={(picked) => handlePictureChange(index, picked)} />
                                ))}
                                <button type="button" onClick={handleAddPictureSlot} className="text-(--main-red) text-sm text-left hover:cursor-pointer">
                                    + Ajouter une image
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 bg-white rounded-[10px] p-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="hostName" className="font-medium text-sm">Nom de l&apos;hôte</label>
                                <input
                                    id="hostName"
                                    value={hostName}
                                    onChange={(e) => setHostName(e.target.value)}
                                    required
                                    className="border border-(--light-grey) rounded p-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-sm">Photo de profil</span>
                                <ImagePickerRow fileName={hostPictureFile?.name} onChange={setHostPictureFile} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-white rounded-[10px] p-6">
                        <span className="font-bold text-sm">Équipements</span>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex flex-col gap-2">
                                {EQUIPMENTS_COLUMN_1.map((equipment) => (
                                    <label key={equipment} className="flex flex-row items-center gap-2 hover:cursor-pointer">
                                        <input type="checkbox" checked={equipments.includes(equipment)} onChange={() => toggleEquipment(equipment)} />
                                        {equipment}
                                    </label>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2">
                                {EQUIPMENTS_COLUMN_2.map((equipment) => (
                                    <label key={equipment} className="flex flex-row items-center gap-2 hover:cursor-pointer">
                                        <input type="checkbox" checked={equipments.includes(equipment)} onChange={() => toggleEquipment(equipment)} />
                                        {equipment}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-white rounded-[10px] p-6">
                        <span className="font-bold text-sm">Catégories</span>
                        <div className="grid grid-cols-4 gap-2">
                            {categories.map((category) => (
                                <button
                                    type="button"
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className={`py-2 text-center text-[12px] rounded-[5px] hover:cursor-pointer ${
                                        selectedCategories.includes(category) ? "bg-(--main-red) text-white" : "bg-(--light-grey) text-(--dark-grey)"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <label htmlFor="newCategory" className="font-medium text-sm">Ajouter une catégorie personnalisée</label>
                            <div className="flex flex-row gap-2">
                                <input
                                    id="newCategory"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Nouveau tag"
                                    className="flex-1 border border-(--light-grey) rounded p-2 text-sm"
                                />
                                <button type="button" onClick={handleAddCategory} className="bg-(--main-red) text-white w-10 rounded-[10px] font-bold hover:cursor-pointer">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}