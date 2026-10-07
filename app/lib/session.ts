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

/** Signe le secret avec HMAC-SHA256 pour en garantir l'intégrité.
 *
 * @param payload - Secret encodé à signer.
 * @returns La signature encodée en base64url.
 */
function sign(payload: string): string {
    return createHmac('sha256', encodedSecret).update(payload).digest('base64url')
}

/** Sérialise une session en une chaîne `payload.signature` stockable en cookie.
 *
 * @param session - La session à sérialiser.
 * @returns La valeur de cookie signée.
 */
function serialize(session: Session): string {
    const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
    return `${payload}.${sign(payload)}`
}

/** Vérifie la signature d'une valeur de cookie et la décode en session.
 *
 * @param cookieValue - La valeur brute du cookie, au format `payload.signature`.
 * @returns La session décodée, ou `null` si la signature est invalide ou absente.
 */
function deserialize(cookieValue: string): Session | null {
    const [payload, signature] = cookieValue.split('.')
    if (!payload || !signature) return null

    const expected = sign(payload)
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    // vérifie que la signature correspond à celle attendue, en utilisant une comparaison sécurisée dans le temps pour éviter les attaques timing-attack.
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    try {
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as Session
    } catch {
        return null
    }
}

/** Vérifie une valeur brute de cookie de session et retourne la session si elle est valide et non expirée.
 *
 * @param raw - La valeur brute du cookie `session`, ou `undefined`.
 * @returns La session si valide, sinon `null`.
 */
export function verifySessionCookie(raw: string | undefined): Session | null {
    if (!raw) return null

    const session = deserialize(raw)
    if (!session || new Date(session.expiresAt) < new Date()) return null

    return session
}

/** Crée une nouvelle session utilisateur et crée le cookie signé en httpOnly.
 *
 * @param token - Le token d'authentification retourné par l'API.
 * @param user - L'utilisateur à associer à la session.
 */
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

/**
 * Lit et vérifie le cookie de session, retourne `null` si absent, falsifié ou expiré.
 *
 * @returns La session utilisateur si valide, sinon `null`.
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies()
    return verifySessionCookie(cookieStore.get(COOKIE_NAME)?.value)
}

/** Supprime le cookie de session, ce qui déconnecte l'utilisateur. */
export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}