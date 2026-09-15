'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, undefined)

    return (
        <div className="flex flex-col items-center my-34 w-6/11 py-20 bg-white rounded-[10px] text-center">
            <h1 className="w-1/2 text-[32px] font-bold mb-2 text-(--main-red)">Rejoignez la communauté Kasa</h1>
            <p className="w-1/2 mb-9.5">Créez votre compte et commencez à voyager autrement : réservez des logements uniques, découvrez de nouvelles destinations et partagez vos propres lieux avec d’autres voyageurs.</p>
            <form action={formAction} className="flex flex-col items-center w-1/2">
                <label htmlFor="lastName" className='w-full text-[14px] text-left font-medium'>Nom</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full border border-(--light-grey) p-2 rounded mb-5.5"
                />
                {state?.errors?.lastName && <p className="text-(--main-red)">{state.errors.lastName[0]}</p>}

                <label htmlFor="firstName" className='w-full text-[14px] text-left font-medium'>Prénom</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full border border-(--light-grey) p-2 rounded mb-5.5"
                />
                {state?.errors?.firstName && <p className="text-(--main-red)">{state.errors.firstName[0]}</p>}

                <label htmlFor="email" className='w-full text-[14px] text-left font-medium'>Adresse email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border border-(--light-grey) p-2 rounded mb-5.5"
                />
                {state?.errors?.email && <p className="text-(--main-red)">{state.errors.email[0]}</p>}

                <label htmlFor="password" className='w-full text-[14px] text-left font-medium'>Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full border border-(--light-grey) p-2 rounded mb-5.5"
                />
                {state?.errors?.password && <p className="text-(--main-red)">{state.errors.password[0]}</p>}

                <label htmlFor="confirm-user-policy" className="flex flex-row items-center gap-1 w-full text-[12px] text-left mb-9.5">
                    <input type="checkbox" id="confirm-user-policy" name="confirm-user" required className="mr-2 text-(--dark-grey) hover:cursor-pointer" />
                    J'accepte les <a href="#" className="underline text-(--dark-grey)">conditions générales d'utilisation</a>
                </label>

                {state?.message && <p role="alert" className="text-(--main-red)">{state.message}</p>}

                <button type="submit" disabled={isPending} className="hover:cursor-pointer bg-(--main-red) text-white text-[14px] py-2 px-16 rounded-[10px] mb-5.5">
                    {isPending ? 'Inscription...' : "S'inscrire"}
                </button>
                <p className="text-(--main-red) text-[14px] mt-2">Déjà membre ? <Link href="/login">Se connecter</Link></p>
            </form>
        </div>
    );
}