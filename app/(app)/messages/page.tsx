import { redirect } from "next/navigation";
import { listConversations } from "@/app/actions/messages";
import { getSession } from "@/app/lib/session";
import { MessagesPanel } from "@/components/messagesPanel";

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ conversation?: string }> }) {
    const session = await getSession();
    if (!session) redirect("/login");

    const { conversation } = await searchParams;
    const conversations = await listConversations();

    return (
        <MessagesPanel
            conversations={conversations}
            currentUserId={session.user.id}
            initialSelectedId={conversation ? Number(conversation) : undefined}
        />
    );
}