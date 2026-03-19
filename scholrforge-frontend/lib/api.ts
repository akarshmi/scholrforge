import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/store/useAuthStore'
import { APP_URL, API_BASE_URL } from './constants'

// ─── Error Class ──────────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// ─── Client → Next.js route handlers ─────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : APP_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Server-side → Spring Boot (no interceptors) ──────────────────────────────

export const springApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Token refresh queue ──────────────────────────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  )
  failedQueue = []
}

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !original._retry) {
      // ✅ Skip refresh for auth routes — no session exists yet
      if (original.url?.includes('/api/auth/')) {
        const data = error.response?.data as Record<string, unknown> | undefined
        return Promise.reject(
          new AppError(401, (data?.message as string) ?? 'Invalid email or password', {})
        )
      }

      // Queue concurrent 401s
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const newToken = await useAuthStore.getState().refreshAccessToken()
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ── Normalize all errors to AppError ──
    const status = error.response?.status ?? 500
    const data = error.response?.data as Record<string, unknown> | undefined
    const message =
      (data?.message as string) ??
      (data?.error as string) ??
      error.message ??
      'An unexpected error occurred'
    const details = (data?.details as Record<string, unknown>) ?? {}

    return Promise.reject(new AppError(status, message, details))
  }
)

// ─── Typed request helper ─────────────────────────────────────────────────────

export async function makeRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: unknown,
  config?: object
): Promise<T> {
  const response = await api[method]<T>(url, data as never, config)
  return response.data
}

export default api