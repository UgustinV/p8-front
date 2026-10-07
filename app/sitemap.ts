import type { MetadataRoute } from "next";
import { listProperties } from "@/app/actions/properties";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://p8-front.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
        { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
        { url: `${BASE_URL}/logements`, changeFrequency: "daily", priority: 0.9 },
    ];

    try {
        const properties = await listProperties();
        const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
            url: `${BASE_URL}/logements/${property.id}`,
            changeFrequency: "weekly",
            priority: 0.7,
        }));

        return [...staticRoutes, ...propertyRoutes];
    } catch {
        // En cas d'erreur lors de la récupération des propriétés, on se rabat sur les routes statiques.
        return staticRoutes;
    }
}