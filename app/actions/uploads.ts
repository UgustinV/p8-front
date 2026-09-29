'use server'

import { createHash } from 'node:crypto'
import { UploadPurpose, UploadResponse } from '@/app/lib/definitions'
import { getSession } from '@/app/lib/session'

export type DeleteImagesResult = {
    ok: boolean
    deleted: string[]
    not_found: string[]
    errors: { public_id: string; error: string }[]
}

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER ?? 'kasa'

function getCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Configuration Cloudinary manquante.')
    }

    return { cloudName, apiKey, apiSecret }
}

// Cloudinary signature: sha1 of sorted "key=value" pairs plus the api secret
function signParams(params: Record<string, string | number>, apiSecret: string): string {
    const toSign = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&')

    return createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex')
}

export async function uploadImage(formData: FormData): Promise<UploadResponse> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    const file = formData.get('file')
    if (!(file instanceof Blob)) throw new Error('Aucun fichier fourni.')

    const purpose = formData.get('purpose')
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()

    const timestamp = Math.floor(Date.now() / 1000)
    const signature = signParams({ folder: CLOUDINARY_FOLDER, timestamp }, apiSecret)

    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('api_key', apiKey)
    uploadData.append('timestamp', String(timestamp))
    uploadData.append('folder', CLOUDINARY_FOLDER)
    uploadData.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
    })

    const payload = await response.json().catch(() => undefined)

    if (!response.ok) {
        throw new Error(payload?.error?.message ?? `Erreur ${response.status}.`)
    }

    return {
        url: payload.secure_url,
        public_id: payload.public_id,
        purpose: typeof purpose === 'string' ? (purpose as UploadPurpose) : undefined,
    } as UploadResponse
}

export async function deleteImages(input: { publicIds: string[] }): Promise<DeleteImagesResult> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()

    const deleted: string[] = []
    const not_found: string[] = []
    const errors: { public_id: string; error: string }[] = []

    for (const public_id of input.publicIds) {
        const timestamp = Math.floor(Date.now() / 1000)
        const signature = signParams({ public_id, timestamp }, apiSecret)

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    public_id,
                    api_key: apiKey,
                    timestamp: String(timestamp),
                    signature,
                }),
            })

            const payload = await response.json().catch(() => undefined)

            if (payload?.result === 'ok') {
                deleted.push(public_id)
            } else if (payload?.result === 'not found') {
                not_found.push(public_id)
            } else {
                errors.push({ public_id, error: payload?.error?.message ?? `Erreur ${response.status}.` })
            }
        } catch (error) {
            errors.push({ public_id, error: error instanceof Error ? error.message : 'Erreur inconnue.' })
        }
    }

    return { ok: errors.length === 0, deleted, not_found, errors }
}