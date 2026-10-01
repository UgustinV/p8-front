import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { NewLogementForm } from "@/components/newLogementForm";

export default async function NewLogementPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    return <NewLogementForm user={session.user} />;
}