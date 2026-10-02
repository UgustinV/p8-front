"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import Image from "next/image";
import { parseUtcDate, type Message } from "@/app/lib/definitions";

type ConversationProps = {
    contactName: string;
    currentUserId: number;
    contactPicture: string;
    userPicture: string;
    messages: Message[];
    onSendMessage: (body: string) => Promise<void>;
    onBack: () => void;
};

function formatTime(iso: string) {
    return parseUtcDate(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
    return parseUtcDate(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export const Conversation = ({ contactName, currentUserId, contactPicture, userPicture, messages, onSendMessage, onBack }: ConversationProps) => {    const [draft, setDraft] = useState("");
    const [isSending, setIsSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: "end" });
    }, [messages]);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const body = draft.trim();
        if (!body) return;

        setIsSending(true);
        try {
            await onSendMessage(body);
            setDraft("");
        } finally {
            setIsSending(false);
        }
    };

    let lastDate: string | null = null;

    return (
        <section className="flex flex-col flex-1 bg-background">
            <button
                type="button"
                onClick={onBack}
                className="flex md:hidden flex-row items-center gap-1 bg-(--light-grey) p-2.5 rounded-[10px] w-fit m-4 text-sm font-medium text-(--dark-grey) hover:cursor-pointer"
            >
                <span aria-hidden>←</span> Retour
            </button>
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                {messages.map((message) => {
                    const messageDate = formatDate(message.created_at);
                    const showDivider = messageDate !== lastDate;
                    lastDate = messageDate;
                    const isMe = message.sender_id === currentUserId;

                    return (
                        <div key={message.id}>
                            {showDivider && (
                                <div className="flex items-center gap-4 my-4">
                                    <hr className="flex-1 border-(--light-grey)" />
                                    <span className="text-xs text-(--dark-grey) whitespace-nowrap">{messageDate}</span>
                                    <hr className="flex-1 border-(--light-grey)" />
                                </div>
                            )}
                            <div className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                                <Image
                                    src={isMe ? userPicture : contactPicture}
                                    alt={isMe ? `Profil du message ${message.id} de vous` : `Profil du message ${message.id} de ${contactName}`}
                                    width={32}
                                    height={32}
                                    className={`w-8 h-8 rounded-[10px] shrink-0 ${isMe ? (userPicture === "/profile.svg" ? "bg-(--dark-grey) p-2" : "") : (contactPicture === "/profile.svg" ? "bg-(--dark-grey) p-2" : "")}`}
                                />
                                <div className={`flex flex-col gap-1 max-w-xs ${isMe ? "items-end" : "items-start"}`}>
                                    <span className="text-xs text-(--dark-grey)">{isMe ? "Vous" : contactName} • {formatTime(message.created_at)}</span>
                                    <p className={`text-sm p-4 ${isMe ? "bg-(--main-red) text-white rounded-l-4xl rounded-br-4xl" : "bg-white rounded-r-4xl rounded-bl-4xl"}`}>
                                        {message.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && (
                    <p className="text-sm text-(--dark-grey) text-center my-10">Aucun message pour le moment.</p>
                )}
                <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-row items-center gap-2 p-4 border-t border-(--light-grey)">
                <label htmlFor="message-input" className="sr-only">Message</label>
                <input
                    id="message-input"
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Envoyer un message"
                    className="flex-1 border border-(--light-grey) rounded-[10px] p-3 text-sm bg-white"
                />
                <button type="submit" disabled={isSending} className="bg-(--main-red) text-white w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 disabled:opacity-60">
                    <Image src="/send.svg" alt="Envoyer" width={16} height={16} />
                </button>
            </form>
        </section>
    );
};