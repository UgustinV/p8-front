import Link from "next/link";

export const MainButton = ({ label, href }: { label: string; href: string }) => {
    return (
        <Link href={href} className="w-full bg-(--main-red) text-white text-center font-semibold py-2.5 rounded-[10px]">
            {label}
        </Link>
    );
};