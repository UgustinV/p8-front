'use server'

import { User, UserCreate, UserUpdate, PropertyBase } from '@/app/lib/definitions'
import { apiFetch } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'

export async function listUsers(): Promise<User[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User[]>('/api/users', { token: session.token })
}

export async function getUser(id: number): Promise<User> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User>(`/api/users/${id}`, { token: session.token })
}

export async function createUser(user: UserCreate): Promise<User> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User>('/api/users', {
        method: 'POST',
        token: session.token,
        body: user,
    })
}

export async function updateUser(id: number, user: UserUpdate): Promise<User> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<User>(`/api/users/${id}`, {
        method: 'PATCH',
        token: session.token,
        body: user,
    })
}

export async function listUserFavorites(id: number): Promise<PropertyBase[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<PropertyBase[]>(`/api/users/${id}/favorites`, { token: session.token })
}