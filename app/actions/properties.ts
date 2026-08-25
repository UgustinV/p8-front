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
import { apiFetch } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'

export async function listProperties(): Promise<PropertyBase[]> {
    return apiFetch<PropertyBase[]>('/api/properties')
}

export async function getProperty(id: string): Promise<PropertyDetail> {
    return apiFetch<PropertyDetail>(`/api/properties/${id}`)
}

export async function createProperty(property: PropertyCreate): Promise<PropertyDetail> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<PropertyDetail>('/api/properties', {
        method: 'POST',
        token: session.token,
        body: property,
    })
}

export async function updateProperty(id: string, property: PropertyUpdate): Promise<PropertyDetail> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<PropertyDetail>(`/api/properties/${id}`, {
        method: 'PATCH',
        token: session.token,
        body: property,
    })
}

export async function deleteProperty(id: string): Promise<void> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    await apiFetch<void>(`/api/properties/${id}`, {
        method: 'DELETE',
        token: session.token,
    })
}

export async function listRatings(propertyId: string): Promise<Rating[]> {
    return apiFetch<Rating[]>(`/api/properties/${propertyId}/ratings`)
}

export async function addRating(propertyId: string, rating: RatingCreate): Promise<RatingsSummary> {
    return apiFetch<RatingsSummary>(`/api/properties/${propertyId}/ratings`, {
        method: 'POST',
        body: rating,
    })
}

export async function addFavorite(propertyId: string): Promise<Ok> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Ok>(`/api/properties/${propertyId}/favorite`, {
        method: 'POST',
        token: session.token,
    })
}

export async function removeFavorite(propertyId: string): Promise<Ok> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Ok>(`/api/properties/${propertyId}/favorite`, {
        method: 'DELETE',
        token: session.token,
    })
}