import * as z from 'zod'

export const SignupFormSchema = z.object({
    lastName: z
    .string()
    .min(1, { error: 'Le nom est requis.' })
    .trim(),
    firstName: z
    .string()
    .min(1, { error: 'Le prénom est requis.' })
    .trim(),
    email: z.email({ error: 'Veuillez entrer un email valide.' }).trim(),
    password: z
    .string()
    .min(6, { error: 'Le mot de passe doit contenir au moins 6 caractères.' })
    .trim(),
})

export const LoginFormSchema = z.object({
    email: z.email({ error: 'Veuillez entrer un email valide.' }).trim(),
    password: z.string().min(1, { error: 'Le mot de passe est requis.' }).trim(),
})

export const RequestResetFormSchema = z.object({
    email: z.email({ error: 'Veuillez entrer un email valide.' }).trim(),
})

export const ResetPasswordFormSchema = z.object({
    token: z.string().min(1, { error: 'Jeton invalide.' }),
    password: z
    .string()
    .min(6, { error: 'Le mot de passe doit contenir au moins 6 caractères.' })
    .trim(),
})

export type FormState =
| {
    errors?: {
        lastName?: string[]
        firstName?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
}
| undefined

export type SessionPayload = {
    token: string
    expiresAt: Date
}

export type Role = 'owner' | 'client' | 'admin'

export type User = {
    id: number
    name: string
    picture?: string | null
    role: Role
}

export type AuthUser = User & {
    email?: string | null
}

export type AuthResponse = {
    token: string
    user: AuthUser
}

export type PasswordResetRequestResponse = {
    ok: boolean
    message: string
    token?: string // only present outside production
}

export type UserCreate = {
    name: string
    picture?: string | null
    role?: Role
}

export type UserUpdate = Partial<UserCreate>

export type PropertyHost = {
    id: number
    name: string
    picture?: string | null
}

export type PropertyBase = {
    id: string
    slug?: string
    title: string
    description?: string | null
    cover?: string | null
    location?: string | null
    price_per_night: number
    rating_avg?: number
    ratings_count?: number
    host?: PropertyHost
}

export type PropertyDetail = PropertyBase & {
    pictures?: string[]
    equipments?: string[]
    tags?: string[]
}

export type PropertyCreate = {
    id?: string
    title: string
    description?: string
    cover?: string
    location?: string
    price_per_night?: number
    host_id?: number
    host?: {
        name: string
        picture?: string
    }
    pictures?: string[]
    equipments?: string[]
    tags?: string[]
}

export type PropertyUpdate = Partial<
    Pick<PropertyCreate, 'title' | 'description' | 'cover' | 'location' | 'host_id' | 'price_per_night'>
>

export type Rating = {
    id: number
    score: number
    comment?: string | null
    created_at: string
    user: User
}

export type RatingCreate = {
    user_id: number
    score: number
    comment?: string
}

export type RatingsSummary = {
    rating_avg: number
    ratings_count: number
    ratings: Rating[]
}

export type UploadPurpose = 'property-cover' | 'property-picture' | 'user-picture' | 'other'

export type UploadResponse = {
    url: string
    filename?: string
    size?: number
    mimetype?: string
    purpose?: UploadPurpose | null
    property_id?: string | null
    instructions?: string
}

export type Ok = {
    ok: boolean
}

export type ApiError = {
    error: string
}