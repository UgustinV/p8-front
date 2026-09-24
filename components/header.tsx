"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <header ref={headerRef} className="relative w-full lg:w-6/11">
            <nav className="flex flex-row items-center justify-between px-5 py-3 lg:rounded-[10px] lg:px-25 lg:py-2 lg:mt-10 w-full text-[12px] text-(--dark-grey) bg-white drop-shadow-sm">
                <Link href="/logements" className="lg:hidden">
                    <Image src="/logo_picto.svg" alt="Kasa Logo" width={40} height={40} />
                </Link>
                <Link href="/logements" className="text-sm hidden lg:block">
                    Accueil
                </Link>
                <Link href="/about" className="text-sm hidden lg:block">
                    A Propos
                </Link>
                <Link href="/logements" className="text-sm hidden lg:block">
                    <Image src="/logo.svg" alt="Kasa Logo" width={113} height={40} />
                </Link>
                <Link href="/new-logement" className="text-sm text-(--main-red) hidden lg:block">
                    + Ajouter un logement
                </Link>
                <div className="hidden lg:flex flex-row items-center gap-2.5">
                    <Link href="/liked" className="text-sm">
                        <Image src="/favoris-red.svg" alt="Kasa Favoris" width={16} height={16} />
                    </Link>
                    <div className="border-l border-(--main-red) h-1.25"></div>
                    <Link href="/messages" className="text-sm">
                        <Image src="/message-red.svg" alt="Kasa Message" width={16} height={16} />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="lg:hidden"
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isMenuOpen}
                >
                    <Image src={isMenuOpen ? "/close.svg" : "/menu.svg"} alt="" width={45} height={45} />
                </button>
            </nav>

            {/* overlays page content below the nav instead of pushing it down */}
            {isMenuOpen && (
                <div className="absolute top-full inset-x-0 z-50 flex flex-col items-center gap-4 py-5 lg:hidden bg-white text-sm shadow-md">
                    <Link href="/logements" onClick={() => setIsMenuOpen(false)}>
                        Accueil
                    </Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                        A Propos
                    </Link>
                    <Link href="/new-logement" className="text-(--main-red)" onClick={() => setIsMenuOpen(false)}>
                        + Ajouter un logement
                    </Link>
                    <Link href="/liked" onClick={() => setIsMenuOpen(false)}>
                        Favoris
                    </Link>
                    <Link href="/messages" onClick={() => setIsMenuOpen(false)}>
                        Messages
                    </Link>
                </div>
            )}
        </header>
    );
}