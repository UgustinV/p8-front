import { NextResponse } from 'next/server'
import { deleteSession } from '@/app/lib/session'

export async function GET(request: Request) {
    await deleteSession()
    return NextResponse.redirect(new URL('/login', request.url))
}