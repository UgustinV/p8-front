"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Conversation } from "@/components/conversation";
import { listMessages, sendMessage, markConversationRead } from "@/app/actions/messages";
import { parseUtcDate, type ConversationSummary, type Message } from "@/app/lib/definitions";

type MessagesPanelProps = {
    conversations: ConversationSummary[];
    currentUserId: number;
    initialSelectedId?: number;
};

function getOtherParticipant(conversation: ConversationSummary, currentUserId: number) {
    return conversation.participants.find((participant) => participant.id !== currentUserId);
}

export const MessagesPanel = ({ conversations, currentUserId, initialSelectedId }: MessagesPanelProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId ?? conversations[0]?.id ?? null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [readIds, setReadIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (selectedId === null) return;

        let cancelled = false;
        listMessages(selectedId).then((data) => {
            if (!cancelled) setMessages(data);
        });
        markConversationRead(selectedId).then(() => {
            if (!cancelled) setReadIds((current) => new Set(current).add(selectedId));
        });

        return () => {
            cancelled = true;
        };
    }, [selectedId]);

    const selectedConversation = conversations.find((conv) => conv.id === selectedId);
    const contact = selectedConversation ? getOtherParticipant(selectedConversation, currentUserId) : undefined;

    const handleSendMessage = async (body: string) => {
        if (selectedId === null) return;
        const message = await sendMessage(selectedId, body);
        setMessages((current) => [...current, message]);
    };

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col w-full h-full self-stretch lg:h-screen bg-white rounded-[10px] overflow-hidden p-6">
                <Link href="/logements" className="flex flex-row items-center gap-1 bg-(--light-grey) p-2.5 rounded-[10px] w-fit mb-6 text-sm font-medium text-(--dark-grey)">
                    <span aria-hidden>←</span> Retour
                </Link>
                <h1 className="text-2xl font-bold mb-6">Messages</h1>
                <p className="text-sm text-(--dark-grey)">Vous n&apos;avez aucune conversation pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row w-full h-full self-stretch lg:h-screen bg-white rounded-[10px] overflow-hidden">
            <aside className="flex flex-col w-full md:w-1/3 lg:w-2/5 p-6 md:border-r border-(--light-grey) overflow-y-auto">
                <Link href="/logements" className="flex flex-row items-center gap-1 bg-(--light-grey) p-2.5 rounded-[10px] w-fit mb-6 text-sm font-medium text-(--dark-grey)">
                    <span aria-hidden>←</span> Retour
                </Link>
                <h1 className="text-2xl font-bold mb-6">Messages</h1>
                <div className="flex flex-col">
                    {conversations.map((conv) => {
                        const otherParticipant = getOtherParticipant(conv, currentUserId);
                        const isUnread = conv.unread_count > 0 && !readIds.has(conv.id);

                        return (
                            <button
                                key={conv.id}
                                type="button"
                                onClick={() => setSelectedId(conv.id)}
                                className={`flex flex-row items-start gap-3 py-3 px-2 -mx-2 rounded-[10px] text-left border-b border-(--light-grey) last:border-none hover:cursor-pointer ${
                                    conv.id === selectedId ? "bg-(--light-grey)" : ""
                                }`}
                            >
                                <div className="w-8 h-8 rounded-[10px] bg-(--dark-grey) shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-row items-center justify-between gap-2">
                                        <span className="font-semibold text-sm">{otherParticipant?.name ?? "Utilisateur"}</span>
                                        {conv.last_message && (
                                            <span className="text-xs text-(--dark-grey) whitespace-nowrap">
                                                {parseUtcDate(conv.last_message.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-(--dark-grey) truncate">{conv.last_message?.body ?? "Nouvelle conversation"}</p>
                                </div>
                                {isUnread && <span className="w-2 h-2 rounded-full bg-(--main-red) mt-1.5 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {selectedId !== null && (
                <Conversation
                    contactName={contact?.name ?? "Utilisateur"}
                    currentUserId={currentUserId}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                />
            )}
        </div>
    );
};