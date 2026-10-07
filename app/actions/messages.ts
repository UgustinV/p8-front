'use server'

import { Conversation, ConversationSummary, ConversationCreate, Message, Ok } from '@/app/lib/definitions'
import { apiFetch } from '@/app/lib/api'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

/** Crée une conversation avec un hôte à propos d'un logement, puis redirige vers la messagerie.
 *
 * @param hostId - L'identifiant de l'hôte à contacter.
 * @param propertyId - L'identifiant du logement concerné.
 * @param _formData - Données du formulaire, non utilisées (requis par la signature d'une action liée avec bind).
 * @returns Ne retourne rien : redirige vers `/messages?conversation=<id>`.
 */
export async function startConversationWithHost(hostId: number, propertyId: string, _formData: FormData): Promise<void> {
    const conversation = await createConversation({ recipient_id: hostId, property_id: propertyId })
    redirect(`/messages?conversation=${conversation.id}`)
}

/** Récupère les conversations de l'utilisateur connecté - nécessite d'être authentifié.
 *
 * @returns La liste des résumés de conversation (dernier message, nombre de non-lus).
 */
export async function listConversations(): Promise<ConversationSummary[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<ConversationSummary[]>('/api/conversations', { token: session.token })
}

/** Récupère une conversation par son identifiant (ID) - nécessite d'être authentifié.
 *
 * @param id - L'identifiant de la conversation.
 * @returns La conversation demandée.
 */
export async function getConversation(id: number): Promise<Conversation> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Conversation>(`/api/conversations/${id}`, { token: session.token })
}

/** Crée une nouvelle conversation (optionnellement avec un premier message) - nécessite d'être authentifié.
 *
 * @param input - Le destinataire, le logement concerné et le message initial optionnel.
 * @returns La conversation créée.
 */
export async function createConversation(input: ConversationCreate): Promise<Conversation> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Conversation>('/api/conversations', {
        method: 'POST',
        token: session.token,
        body: input,
    })
}

/** Récupère les messages d'une conversation - nécessite d'être authentifié.
 *
 * @param conversationId - L'identifiant de la conversation.
 * @param beforeId - Si fourni, ne retourne que les messages antérieurs à celui-ci (pagination).
 * @returns La liste des messages.
 */
export async function listMessages(conversationId: number, beforeId?: number): Promise<Message[]> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    const query = beforeId ? `?before_id=${beforeId}` : ''
    return apiFetch<Message[]>(`/api/conversations/${conversationId}/messages${query}`, { token: session.token })
}

/** Envoie un message dans une conversation existante - nécessite d'être authentifié.
 *
 * @param conversationId - L'identifiant de la conversation.
 * @param body - Le contenu du message.
 * @returns Le message créé.
 */
export async function sendMessage(conversationId: number, body: string): Promise<Message> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Message>(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        token: session.token,
        body: { body },
    })
}

/** Marque une conversation comme lue pour l'utilisateur connecté - nécessite d'être authentifié.
 *
 * @param conversationId - L'identifiant de la conversation.
 * @returns Une confirmation de la mise à jour.
 */
export async function markConversationRead(conversationId: number): Promise<Ok> {
    const session = await getSession()
    if (!session) throw new Error('Authentification requise.')

    return apiFetch<Ok>(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        token: session.token,
    })
}