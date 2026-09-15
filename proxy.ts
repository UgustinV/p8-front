import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'

const publicRoutes = ['/login', '/register']

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isPublicRoute = publicRoutes.includes(pathname)
    const session = await getSession()

    if (!isPublicRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL('/logements', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}