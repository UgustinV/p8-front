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
    redirect('/')
}

export async function logout(): Promise<void> {
    await deleteSession()
    redirect('/login')
}

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