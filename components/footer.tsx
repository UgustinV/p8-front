"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname === "/messages";

    return (
        <footer className={`w-full ${isMessagesPage ? "lg:hidden" : ""}`}>
            <div className="flex flex-row justify-between items-center px-10 w-full h-17.5 text-[12px] text-(--dark-grey) bg-white">
                <Image src="/logo_picto.svg" alt="Kasa Logo" width={50} height={50} />
                <p>&copy; {new Date().getFullYear()} Kasa. All rights reserved.</p>
            </div>
        </footer>
    );
}