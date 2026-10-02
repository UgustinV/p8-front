import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center text-center gap-5 my-34 mx-4 w-full lg:w-6/11 py-20">
            <h1 className="text-8xl font-bold text-(--main-red)">404</h1>
            <p className="max-w-100">Il semble que la page que vous cherchez ait pris des vacances… ou n&apos;ait jamais existé.</p>
            <Link href="/logements" className="bg-(--main-red) text-white text-sm font-semibold py-2.5 px-10 rounded-[10px]">
                Accueil
            </Link>
        </div>
    );
}