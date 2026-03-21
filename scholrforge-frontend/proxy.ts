import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/session'
import { SESSION_COOKIE, ROUTES } from '@/lib/constants'

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const raw = req.cookies.get(SESSION_COOKIE)?.value

    const isProtected = ROUTES.protected.some((r) => pathname.startsWith(r))
    const isAuthRoute = ROUTES.authOnly.some((r) => pathname.startsWith(r))

    if (!isProtected && !isAuthRoute) return NextResponse.next()

    const session = raw ? await verifySessionToken(raw) : null
    const isValid = !!session

    if (isProtected && !isValid) {
        const url = req.nextUrl.clone()
        url.pathname = ROUTES.login
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
    }

    if (isAuthRoute && isValid) {
        // ✅ Only redirect if user is NOT coming from registration
        const from = req.nextUrl.searchParams.get('from')
        const isPostRegister = req.headers.get('referer')?.includes('/register')

        if (!isPostRegister) {
            return NextResponse.redirect(new URL(ROUTES.feed, req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}