import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from './constants'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionUser {
    id: string
    username: string
    email: string
    role: 'student' | 'admin'
}

export interface Session extends JWTPayload {
    user: SessionUser
    expiresAt: number
}

// ─── Secret ───────────────────────────────────────────────────────────────────

function getSecret(): Uint8Array {
    const secret = process.env.SESSION_SECRET
    if (!secret || secret.length < 32) {
        throw new Error('SESSION_SECRET must be at least 32 characters')
    }
    return new TextEncoder().encode(secret)
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSession(user: SessionUser): Promise<void> {
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

    const token = await new SignJWT({ user, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getSecret())

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(expiresAt),
    })
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getServerSession(): Promise<Session | null> {
    const cookieStore = await cookies()
    const raw = cookieStore.get(SESSION_COOKIE)?.value
    if (!raw) return null

    try {
        const { payload } = await jwtVerify(raw, getSecret())
        const session = payload as Session

        if (Date.now() > session.expiresAt) {
            await deleteSession()
            return null
        }

        return session
    } catch {
        await deleteSession()
        return null
    }
}

export async function getServerUser(): Promise<SessionUser | null> {
    const session = await getServerSession()
    return session?.user ?? null
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
}

// ─── Verify (edge-compatible, no Node APIs) ───────────────────────────────────

export async function verifySessionToken(
    raw: string
): Promise<Session | null> {
    try {
        const { payload } = await jwtVerify(raw, getSecret())
        const session = payload as Session
        if (Date.now() > session.expiresAt) return null
        return session
    } catch {
        return null
    }
}