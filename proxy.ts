import { NextRequest, NextResponse } from 'next/server'
import { verifySessionCookie } from '@/app/lib/session'

const authRoutes = ['/login', '/register']
const privateRoutePrefixes = ['/liked', '/messages', '/new-logement']

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuthRoute = authRoutes.includes(pathname)
    const isPrivateRoute = privateRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
    const session = verifySessionCookie(request.cookies.get('session')?.value)

    if (isPrivateRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/logements', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}