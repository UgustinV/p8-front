import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center gap-10 my-10 mx-4 lg:mx-40">
            <section className="flex flex-col items-center gap-5 w-full">
                <h1 className="text-[32px] font-bold text-(--main-red)">À propos</h1>
                <p>Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.</p>
                <p className="max-w-200 text-center">Depuis notre création, nous mettons en relation des voyageurs en quête d’authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.</p>
                <Image src="/about-heading-image.png" alt="À propos de Kasa" width={1152} height={648} className="w-full h-114.5 object-cover rounded-[20px] mt-5" />
            </section>
            <section className="flex flex-col lg:flex-row gap-4">
                <div className="flex flex-col gap-4 w-full lg:w-5/9 py-10 lg:py-28">
                    <h2 className="text-lg font-bold text-(--main-red)">Notre mission est simple : </h2>
                    <ol className="list-decimal list-inside flex flex-col gap-4 text-sm">
                        <li>Offrir une plateforme fiable et simple d’utilisation</li>
                        <li>Proposer des hébergements variés et de qualité</li>
                        <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
                    </ol>
                    <Image
                        src="/about-content-image.png"
                        alt="Notre mission"
                        width={600}
                        height={400}
                        className="object-cover rounded-[20px] w-full h-114.5 lg:hidden"
                    />
                    <p className="text-(--main-red) text-lg font-medium">Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.</p>
                </div>
                <Image
                    src="/about-content-image.png"
                    alt="Notre mission"
                    width={600}
                    height={400}
                    className="hidden lg:block object-cover rounded-[20px] w-full h-114.5 lg:w-4/9"
                />
            </section>
        </div>
    );
}