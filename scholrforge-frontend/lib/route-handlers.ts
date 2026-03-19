import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession, type SessionUser } from './session'
import { API_BASE_URL } from './constants'

function forwardSpringCookies(springRes: Response, nextRes: NextResponse): NextResponse {
    const setCookie = springRes.headers.get('set-cookie')
    if (setCookie) nextRes.headers.set('set-cookie', setCookie)
    return nextRes
}

export async function handleLogin(req: NextRequest): Promise<NextResponse> {
    let email: string
    let password: string
    let rememberMe: boolean | undefined

    try {
        const body = await req.json()
        email = body.email
        password = body.password
        rememberMe = body.rememberMe ?? false
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const res = await fetch(`${API_BASE_URL}/v3/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return NextResponse.json(
            { error: (err as { message?: string }).message ?? 'Invalid credentials' },
            { status: res.status }
        )
    }

    const data = (await res.json()) as { user: SessionUser; access_token: string }
    await createSession(data.user)

    const response = NextResponse.json({
        user: data.user,
        access_token: data.access_token,
    })

    return forwardSpringCookies(res, response)
}

export async function handleRegister(req: NextRequest): Promise<NextResponse> {
    let name: string
    let username: string
    let email: string
    let password: string

    try {
        const body = await req.json()
        name = body.name
        username = body.username
        email = body.email
        password = body.password
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!name || !username || !email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const res = await fetch(`${API_BASE_URL}/v3/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return NextResponse.json(
            { error: (err as { message?: string }).message ?? 'Registration failed' },
            { status: res.status }
        )
    }

    const data = (await res.json()) as { user: SessionUser; access_token: string }
    await createSession(data.user)

    const response = NextResponse.json({
        user: data.user,
        access_token: data.access_token,
    })

    return forwardSpringCookies(res, response)
}

export async function handleLogout(req: NextRequest): Promise<NextResponse> {
    const jwtCookie = req.cookies.get('jwt')?.value

    await fetch(`${API_BASE_URL}/v3/auth/logout`, {
        method: 'POST',
        headers: {
            ...(jwtCookie ? { Cookie: `jwt=${jwtCookie}` } : {}),
        },
    }).catch(() => { })

    await deleteSession()

    const response = NextResponse.json({ success: true })
    response.cookies.delete('jwt')
    return response
}

export async function handleRefresh(req: NextRequest): Promise<NextResponse> {
    const jwtCookie = req.cookies.get('jwt')?.value

    const res = await fetch(`${API_BASE_URL}/v3/auth/refresh`, {
        method: 'POST',
        headers: {
            ...(jwtCookie ? { Cookie: `jwt=${jwtCookie}` } : {}),
        },
    })

    if (!res.ok) {
        await deleteSession()
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    const data = (await res.json()) as { user: SessionUser; access_token: string }
    await createSession(data.user)

    const response = NextResponse.json({
        user: data.user,
        access_token: data.access_token,
    })

    return forwardSpringCookies(res, response)
}