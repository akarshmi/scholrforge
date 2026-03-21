import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession, type SessionUser } from './session'
import { API_BASE_URL } from './constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function forwardSpringCookies(springRes: Response, nextRes: NextResponse): NextResponse {
    const setCookie = springRes.headers.get('set-cookie')
    if (setCookie) nextRes.headers.set('set-cookie', setCookie)
    return nextRes
}

// Refresh token cookie name must match Spring Boot config:
//   JWT_REFRESH_TOKEN_COOKIE_NAME=refreshToken  (your yml default)
const REFRESH_COOKIE = process.env.JWT_REFRESH_TOKEN_COOKIE_NAME ?? 'refreshToken'

// ─── Auth ─────────────────────────────────────────────────────────────────────

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
            { status: res.status },
        )
    }

    const data = (await res.json()) as { user: SessionUser; access_token: string }
    await createSession(data.user)

    // access_token is returned to the browser — Zustand stores it in
    // localStorage under auth-storage → state.accessToken
    const response = NextResponse.json({ user: data.user, access_token: data.access_token })
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
            { status: res.status },
        )
    }

    const data = (await res.json()) as { user: SessionUser; access_token: string }
    await createSession(data.user)

    const response = NextResponse.json({ user: data.user, access_token: data.access_token })
    return forwardSpringCookies(res, response)
}

export async function handleLogout(req: NextRequest): Promise<NextResponse> {
    // Uses the refresh token cookie — correct, Spring Boot reads it for logout
    const refreshCookie = req.cookies.get(REFRESH_COOKIE)?.value

    await fetch(`${API_BASE_URL}/v3/auth/logout`, {
        method: 'POST',
        headers: {
            ...(refreshCookie ? { Cookie: `${REFRESH_COOKIE}=${refreshCookie}` } : {}),
        },
    }).catch(() => {})

    await deleteSession()

    const response = NextResponse.json({ success: true })
    response.cookies.delete(REFRESH_COOKIE)
    return response
}

export async function handleRefresh(req: NextRequest): Promise<NextResponse> {
    // Uses the refresh token cookie — correct, Spring Boot reads it for refresh
    const refreshCookie = req.cookies.get(REFRESH_COOKIE)?.value

    const res = await fetch(`${API_BASE_URL}/v3/auth/refresh`, {
        method: 'POST',
        headers: {
            ...(refreshCookie ? { Cookie: `${REFRESH_COOKIE}=${refreshCookie}` } : {}),
        },
    })

    if (!res.ok) {
        await deleteSession()
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    const data = (await res.json()) as { user: SessionUser; access_token: string }
    await createSession(data.user)

    const response = NextResponse.json({ user: data.user, access_token: data.access_token })
    return forwardSpringCookies(res, response)
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Step 1 — POST /api/projects
 * Forwards JSON metadata to Spring Boot. No files, no multipart.
 */
export async function handleCreateProject(req: NextRequest): Promise<NextResponse> {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 })
    }

    console.log('[handleCreateProject] body:', JSON.stringify(body, null, 2))

    const auth = req.headers.get('authorization')

    const url = `${API_BASE_URL}/v4/projects`
    console.log('[handleCreateProject] calling:', url)

    const upstream = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify(body),
    })

    const ct     = upstream.headers.get('content-type') ?? ''
    const isJson = ct.includes('application/json')
    const data   = isJson ? await upstream.json() : await upstream.text()

    console.log('[handleCreateProject] Spring Boot →', upstream.status, data)

    if (!upstream.ok)
        return NextResponse.json({ error: 'Upstream error', detail: data }, { status: upstream.status })

    return NextResponse.json({ success: true, data }, { status: upstream.status })
}

/**
 * Step 2 — POST /api/projects/:id/upload
 * Forwards a single ZIP file to Spring Boot.
 * Single file = no FileCountLimitExceededException.
 */
export async function handleUploadProjectFile(req: NextRequest, projectId: string): Promise<NextResponse> {
    let incoming: FormData
    try {
        incoming = await req.formData()
    } catch {
        return NextResponse.json({ error: 'Body must be multipart/form-data' }, { status: 400 })
    }

    const zipFile = incoming.get('zipFile')
    if (!(zipFile instanceof File)) {
        return NextResponse.json({ error: 'Missing required field: zipFile' }, { status: 422 })
    }

    console.log(`[handleUploadProjectFile] projectId: ${projectId}, file: ${zipFile.name} (${(zipFile.size / 1024).toFixed(1)} KB)`)

    // Rebuild FormData so fetch generates a fresh boundary
    const out = new FormData()
    out.append('zipFile', zipFile, zipFile.name)

    const auth = req.headers.get('authorization')

    const upstream = await fetch(`${API_BASE_URL}/v4/projects/${projectId}/upload`, {
        method: 'POST',
        headers: {
            ...(auth ? { Authorization: auth } : {}),
        },
        body: out,
    })

    const ct     = upstream.headers.get('content-type') ?? ''
    const isJson = ct.includes('application/json')
    const data   = isJson ? await upstream.json() : await upstream.text()

    console.log('[handleUploadProjectFile] Spring Boot →', upstream.status, data)

    if (!upstream.ok)
        return NextResponse.json({ error: 'Upstream error', detail: data }, { status: upstream.status })

    return NextResponse.json({ success: true, data }, { status: upstream.status })
}