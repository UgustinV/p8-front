'use server'

import { Conversation, ConversationSummary, ConversationCreate, Message, Ok } from '@/app/lib/definitions'
import { apiFetch } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export async function startConversationWithHost(hostId: number, propertyId: string, _formData: FormData): Promise<void> {
    const conversation = await createConversation({ recipient_id: hostId, property_id: propertyId })
    redirect(`/messages?conversation=${conversation.id}`)
}

export async function listConversations(): Promise<ConversationSummary[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<ConversationSummary[]>('/api/conversations', { token: session.token })
}

export async function getConversation(id: number): Promise<Conversation> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Conversation>(`/api/conversations/${id}`, { token: session.token })
}

export async function createConversation(input: ConversationCreate): Promise<Conversation> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Conversation>('/api/conversations', {
        method: 'POST',
        token: session.token,
        body: input,
    })
}

export async function listMessages(conversationId: number, beforeId?: number): Promise<Message[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    const query = beforeId ? `?before_id=${beforeId}` : ''
    return apiFetch<Message[]>(`/api/conversations/${conversationId}/messages${query}`, { token: session.token })
}

export async function sendMessage(conversationId: number, body: string): Promise<Message> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Message>(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        token: session.token,
        body: { body },
    })
}

export async function markConversationRead(conversationId: number): Promise<Ok> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Ok>(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        token: session.token,
    })
}