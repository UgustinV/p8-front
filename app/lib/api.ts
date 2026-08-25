import 'server-only'

const API_BASE_URL = process.env.API_URL ?? 'http://localhost:8000'

export class ApiRequestError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiRequestError'
        this.status = status
    }
}

type ApiFetchOptions = {
    method?: string
    token?: string
    body?: unknown
    headers?: HeadersInit
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { method = 'GET', token, body, headers } = options
    const isFormData = body instanceof FormData

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        cache: 'no-store',
        body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
        headers: {
            ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    })

    if (response.status === 204) {
        return undefined as T
    }

    const payload = await response.json().catch(() => undefined)

    if (!response.ok) {
        const message = (payload as { error?: string } | undefined)?.error ?? `Erreur ${response.status}.`
        throw new ApiRequestError(message, response.status)
    }

    return payload as T
}