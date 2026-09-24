import { listUserFavorites } from "@/app/actions/users";
import { LikedPropertiesGrid } from "@/components/likedPropertiesGrid";
import { getSession } from "@/app/lib/session";

export default async function LikedPage() {
    const session = await getSession();
    const user = session?.user;
    const likedProperties = user ? await listUserFavorites(user.id) : [];
    return (
        <div className="flex flex-col items-center text-center mx-4 lg:mx-35 my-17.5">
            <h1 className="text-[32px] text-(--main-red) font-bold mb-2">Vos favoris</h1>
            <p className="text-[14px]">Retrouvez ici tous les logements que vous avez aimés.</p>
            <p className="text-[14px]">Prêts à réserver ? Un simple clic et votre prochain séjour est en route.</p>
            <LikedPropertiesGrid initialProperties={likedProperties} />
        </div>
    );
}