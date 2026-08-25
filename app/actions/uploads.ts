'use server'

import { UploadResponse } from '@/app/lib/definitions'
import { apiFetch } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'

export type DeleteImagesResult = {
    ok: boolean
    deleted: string[]
    not_found: string[]
    errors: { filename: string; error: string }[]
}

export async function uploadImage(formData: FormData): Promise<UploadResponse> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<UploadResponse>('/api/uploads/image', {
        method: 'POST',
        token: session.token,
        body: formData,
    })
}

export async function deleteImages(input: { filenames?: string[]; urls?: string[] }): Promise<DeleteImagesResult> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<DeleteImagesResult>('/api/uploads/images', {
        method: 'DELETE',
        token: session.token,
        body: input,
    })
}