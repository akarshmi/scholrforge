import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import {
    createSession,
    deleteSession,
    getServerUser,
    type SessionUser,
} from './session'
import { API_BASE_URL } from './constants'

// ─── Route Guards ─────────────────────────────────────────────────────────────

export async function requireAuth(from?: string): Promise<SessionUser> {
    const user = await getServerUser()
    if (!user) {
        const params = from ? `?from=${encodeURIComponent(from)}` : ''
        redirect(`/login${params}`)
    }
    return user
}

export async function requireAdmin(): Promise<SessionUser> {
    const user = await requireAuth('/admin')
    if (user.role !== 'admin') redirect('/403')
    return user
}

export async function redirectIfAuthenticated(to = '/feed'): Promise<void> {
    const user = await getServerUser()
    if (user) redirect(to)
}

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginResult =
    | { success: true; user: SessionUser; access_token: string }
    | { success: false; error: string; status: number }

type RegisterResult =
    | { success: true; user: SessionUser }
    | { success: false; error: string; status: number }

// ─── API → Spring Boot ────────────────────────────────────────────────────────

export async function loginWithBackend(
    email: string,
    password: string,
    rememberMe?: boolean
): Promise<LoginResult> {
    try {
        const res = await fetch(`${API_BASE_URL}/v3/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe }),
        })
        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            return {
                success: false,
                error: (body as { message?: string })?.message ?? 'Invalid credentials',
                status: res.status,
            }
        }

        const data = (await res.json()) as { user: SessionUser; access_token: string }
        await createSession(data.user)
        return { success: true, user: data.user, access_token: data.access_token }
    } catch {
        return { success: false, error: 'Could not connect to server.', status: 503 }
    }
}

export async function registerWithBackend(payload: {
    username: string
    email: string
    password: string
}): Promise<RegisterResult> {
    try {
        const res = await fetch(`${API_BASE_URL}/v3/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            return {
                success: false,
                error: (body as { message?: string })?.message ?? 'Registration failed.',
                status: res.status,
            }
        }

        const data = (await res.json()) as { user: SessionUser }
        await createSession(data.user)
        return { success: true, user: data.user }
    } catch {
        return { success: false, error: 'Could not connect to server.', status: 503 }
    }
}

export async function logoutFromBackend(): Promise<void> {
    const cookieStore = await cookies()
    const jwtCookie = cookieStore.get('jwt')?.value

    try {
        await fetch(`${API_BASE_URL}/v3/auth/logout`, {
            method: 'POST',
            headers: {
                ...(jwtCookie ? { Cookie: `jwt=${jwtCookie}` } : {}),
            },
        })
    } catch {
        // best-effort
    } finally {
        await deleteSession()
    }
}

export async function verifyWithBackend(): Promise<SessionUser | null> {
    const cookieStore = await cookies()
    const jwtCookie = cookieStore.get('jwt')?.value

    if (!jwtCookie) return null

    try {
        const res = await fetch(`${API_BASE_URL}/v3/auth/me`, {
            headers: { Cookie: `jwt=${jwtCookie}` },
            cache: 'no-store',
        })

        if (!res.ok) {
            await deleteSession()
            return null
        }

        const user = (await res.json()) as SessionUser
        await createSession(user)
        return user
    } catch {
        return null
    }
}