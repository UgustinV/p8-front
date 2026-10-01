'use server'

import { redirect } from 'next/navigation'
import {
    SignupFormSchema,
    LoginFormSchema,
    RequestResetFormSchema,
    ResetPasswordFormSchema,
    FormState,
    AuthResponse,
    PasswordResetRequestResponse,
} from '@/app/lib/definitions'
import { apiFetch, ApiRequestError } from '@/app/lib/api'
import { createSession, deleteSession } from '@/app/lib/session'

/** Valide les champs d'inscription, crée le compte via l'API puis ouvre une session. 
 * 
 * @param state - L'état actuel du formulaire.
 * @param formData - Les données du formulaire d'inscription.
 * @returns Le nouvel état du formulaire après la tentative d'inscription.
*/
export async function signup(state: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = SignupFormSchema.safeParse({
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }

    const { lastName, firstName, email, password } = validatedFields.data

    let auth: AuthResponse
    try {
        auth = await apiFetch<AuthResponse>('/auth/register', {
            method: 'POST',
            body: { name: `${firstName} ${lastName}`, email, password, role: 'client' },
        })
    } catch (error) {
        return { message: error instanceof ApiRequestError ? error.message : 'Une erreur est survenue lors de la création du compte.' }
    }

    await createSession(auth.token, auth.user)
    redirect('/')
}

/** Valide les identifiants, authentifie l'utilisateur via l'API puis ouvre une session.
 *
 * @param state - L'état actuel du formulaire.
 * @param formData - Les données du formulaire de connexion.
 * @returns Le nouvel état du formulaire après la tentative de connexion.
 */
export async function login(state: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }

    let auth: AuthResponse
    try {
        auth = await apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: validatedFields.data,
        })
    } catch (error) {
        return { message: error instanceof ApiRequestError ? error.message : 'Une erreur est survenue lors de la connexion.' }
    }

    await createSession(auth.token, auth.user)
    redirect('/logements')
}

/** Supprime la session courante et redirige vers la page de connexion.
 *
 * @returns Une promesse résolue lorsque la déconnexion est effectuée.
 */
export async function logout(): Promise<void> {
    await deleteSession()
    redirect('/login')
}

/** Valide l'email et demande un lien de réinitialisation de mot de passe via l'API.
 *
 * @param state - L'état actuel du formulaire.
 * @param formData - Les données du formulaire de réinitialisation de mot de passe.
 * @returns Le nouvel état du formulaire après la tentative de demande de réinitialisation.
 */
export async function requestPasswordReset(state: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = RequestResetFormSchema.safeParse({
        email: formData.get('email'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }

    try {
        const result = await apiFetch<PasswordResetRequestResponse>('/auth/request-reset', {
            method: 'POST',
            body: validatedFields.data,
        })
        return { message: result.message }
    } catch (error) {
        return { message: error instanceof ApiRequestError ? error.message : 'Une erreur est survenue.' }
    }
}

type ResetPasswordState = { errors?: { token?: string[]; password?: string[] }; message?: string } | undefined

/** Valide le token et le nouveau mot de passe, puis réinitialise via l'API.
 *
 * @param state - L'état actuel du formulaire.
 * @param formData - Les données du formulaire de réinitialisation de mot de passe.
 * @returns Le nouvel état du formulaire après la tentative de réinitialisation.
 */
export async function resetPassword(state: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
    const validatedFields = ResetPasswordFormSchema.safeParse({
        token: formData.get('token'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }

    try {
        await apiFetch('/auth/reset-password', {
            method: 'POST',
            body: validatedFields.data,
        })
    } catch (error) {
        return { message: error instanceof ApiRequestError ? error.message : 'Une erreur est survenue.' }
    }

    redirect('/login')
}