import 'server-only'
import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { AuthUser } from '@/app/lib/definitions'

const COOKIE_NAME = 'session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

const secret = process.env.SESSION_SECRET
if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set.')
}
const encodedSecret: string = secret

type Session = {
    token: string
    user: AuthUser
    expiresAt: string
}

function sign(payload: string): string {
    return createHmac('sha256', encodedSecret).update(payload).digest('base64url')
}

function serialize(session: Session): string {
    const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
    return `${payload}.${sign(payload)}`
}

// rejects a tampered cookie value by checking its HMAC signature
function deserialize(cookieValue: string): Session | null {
    const [payload, signature] = cookieValue.split('.')
    if (!payload || !signature) return null

    const expected = sign(payload)
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    try {
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as Session
    } catch {
        return null
    }
}

export async function createSession(token: string, user: AuthUser): Promise<void> {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
    const cookieStore = await cookies()

    cookieStore.set(COOKIE_NAME, serialize({ token, user, expiresAt: expiresAt.toISOString() }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies()
    const raw = cookieStore.get(COOKIE_NAME)?.value
    if (!raw) return null

    const session = deserialize(raw)
    if (!session || new Date(session.expiresAt) < new Date()) return null

    return session
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}