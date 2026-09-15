'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, undefined)

    return (
        <div className="flex flex-col items-center my-34 w-6/11 py-20 bg-white rounded-[10px] text-center">
            <h1 className="w-1/2 text-[32px] font-bold mb-2 text-(--main-red)">Heureux de vous revoir</h1>
            <p className="w-1/2 mb-9.5">Connectez-vous pour retrouver vos réservations, vos annonces et tout ce qui rend vos séjours uniques.</p>
            <form action={formAction} className="flex flex-col items-center w-1/2">
                <label
                    htmlFor="email"
                    className='w-full text-[14px] text-left font-medium'
                >
                    Adresse email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border border-(--light-grey) p-2 rounded mb-5.5"
                />
                {state?.errors?.email && <p className="text-(--main-red)">{state.errors.email[0]}</p>}
                <label
                    htmlFor="password"
                    className='w-full text-[14px] text-left font-medium'
                >
                    Mot de passe
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full border border-(--light-grey) p-2 rounded mb-9.5"
                />
                {state?.errors?.password && <p className="text-(--main-red)">{state.errors.password[0]}</p>}
                {state?.message && <p role="alert" className="text-(--main-red)">{state.message}</p>}
                <button
                    type="submit"
                    disabled={isPending}
                    className="hover:cursor-pointer bg-(--main-red) text-white text-[14px] py-2 px-16 mb-5.5 rounded-[10px]"
                >
                    {isPending ? 'Connexion...' : 'Se connecter'}
                </button>
                <p className="text-(--main-red) text-[14px] mb-3">Mot de passe oublié ?</p>
                <p className="text-(--main-red) text-[14px]">Pas encore de compte ? <Link href="/register">Inscrivez-vous</Link></p>
            </form>
        </div>
    );
}
