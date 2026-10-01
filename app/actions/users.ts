'use server'

import { User, UserCreate, UserUpdate, PropertyBase } from '@/app/lib/definitions'
import { apiFetch } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'

/** Récupère la liste des utilisateurs ; nécessite d'être authentifié.
 *
 * @returns La liste des utilisateurs.
 */
export async function listUsers(): Promise<User[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User[]>('/api/users', { token: session.token })
}

/**
 * Récupère les détails d'un utilisateur spécifique ; nécessite d'être authentifié.
 *
 * @param id - L'identifiant de l'utilisateur.
 * @returns Les détails de l'utilisateur.
 */
export async function getUser(id: number): Promise<User> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User>(`/api/users/${id}`, { token: session.token })
}

/**
 * Crée un nouvel utilisateur ; nécessite d'être authentifié.
 *
 * @param user - Les informations de l'utilisateur à créer.
 * @returns Les détails de l'utilisateur créé.
 */
export async function createUser(user: UserCreate): Promise<User> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User>('/api/users', {
        method: 'POST',
        token: session.token,
        body: user,
    })
}

/**
 * Met à jour un utilisateur existant ; nécessite d'être authentifié.
 *
 * @param id - L'identifiant de l'utilisateur à mettre à jour.
 * @param user - Les nouvelles informations de l'utilisateur.
 * @returns Les détails de l'utilisateur mis à jour.
 */
export async function updateUser(id: number, user: UserUpdate): Promise<User> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User>(`/api/users/${id}`, {
        method: 'PATCH',
        token: session.token,
        body: user,
    })
}

/**
 * Récupère la liste des favoris d'un utilisateur spécifique ; nécessite d'être authentifié.
 *
 * @param id - L'identifiant de l'utilisateur.
 * @returns La liste des logements favoris de l'utilisateur.
 */
export async function listUserFavorites(id: number): Promise<PropertyBase[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<PropertyBase[]>(`/api/users/${id}/favorites`, { token: session.token })
}