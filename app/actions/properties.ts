'use server'

import {
    PropertyBase,
    PropertyDetail,
    PropertyCreate,
    PropertyUpdate,
    Rating,
    RatingCreate,
    RatingsSummary,
    Ok,
} from '@/app/lib/definitions'
import { apiFetch, ApiRequestError } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'

/** Récupère la liste de tous les logements publiés.
 *
 * @returns La liste des logements.
 */
export async function listProperties(): Promise<PropertyBase[]> {
    return apiFetch<PropertyBase[]>('/api/properties')
}

/**
 * Récupère les détails d'un logement spécifique.
 *
 * @param id - L'identifiant du logement.
 * @returns Les détails du logement.
 */
export async function getProperty(id: string): Promise<PropertyDetail | null> {
    try {
        return await apiFetch<PropertyDetail>(`/api/properties/${id}`)
    } catch (error) {
        if (error instanceof ApiRequestError && error.status === 404) {
            return null
        }
        throw error
    }
}

/**
 * Crée un nouveau logement.
 *
 * @param property - Les informations du logement à créer.
 * @returns Les détails du logement créé.
 */
export async function createProperty(property: PropertyCreate): Promise<PropertyDetail> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<PropertyDetail>('/api/properties', {
        method: 'POST',
        token: session.token,
        body: property,
    })
}

/**
 * Met à jour un logement existant.
 *
 * @param id - L'identifiant du logement à mettre à jour.
 * @param property - Les nouvelles informations du logement.
 * @returns Les détails du logement mis à jour.
 */
export async function updateProperty(id: string, property: PropertyUpdate): Promise<PropertyDetail> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<PropertyDetail>(`/api/properties/${id}`, {
        method: 'PATCH',
        token: session.token,
        body: property,
    })
}

/**
 * Supprime un logement existant.
 *
 * @param id - L'identifiant du logement à supprimer.
 * @returns Une promesse résolue lorsque le logement est supprimé.
 */
export async function deleteProperty(id: string): Promise<void> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    await apiFetch<void>(`/api/properties/${id}`, {
        method: 'DELETE',
        token: session.token,
    })
}

/**
 * Récupère la liste des évaluations d'un logement spécifique.
 *
 * @param propertyId - L'identifiant du logement.
 * @returns La liste des évaluations du logement.
 */
export async function listRatings(propertyId: string): Promise<Rating[]> {
    return apiFetch<Rating[]>(`/api/properties/${propertyId}/ratings`)
}

/**
 * Ajoute une évaluation à un logement spécifique.
 *
 * @param propertyId - L'identifiant du logement.
 * @param rating - Les informations de l'évaluation à ajouter.
 * @returns Le résumé des évaluations du logement après l'ajout.
 */
export async function addRating(propertyId: string, rating: RatingCreate): Promise<RatingsSummary> {
    return apiFetch<RatingsSummary>(`/api/properties/${propertyId}/ratings`, {
        method: 'POST',
        body: rating,
    })
}

/**
 * Ajoute un logement aux favoris de l'utilisateur.
 *
 * @param propertyId - L'identifiant du logement à ajouter aux favoris.
 * @returns Une confirmation de l'ajout aux favoris.
 */
export async function addFavorite(propertyId: string): Promise<Ok> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Ok>(`/api/properties/${propertyId}/favorite`, {
        method: 'POST',
        token: session.token,
    })
}

/**
 * Retire un logement des favoris de l'utilisateur.
 *
 * @param propertyId - L'identifiant du logement à retirer des favoris.
 * @returns Une confirmation du retrait des favoris.
 */
export async function removeFavorite(propertyId: string): Promise<Ok> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Ok>(`/api/properties/${propertyId}/favorite`, {
        method: 'DELETE',
        token: session.token,
    })
}