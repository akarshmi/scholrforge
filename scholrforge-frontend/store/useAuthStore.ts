import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  login: (user: User, accessToken: string) => void
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<string>
}

const isAuthPage = () =>
  typeof window !== 'undefined' &&
  (window.location.pathname.startsWith('/login') ||
    window.location.pathname.startsWith('/register'))

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      login: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true, isLoading: false })
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          })
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false })
        }
      },

      refreshAccessToken: async () => {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          // ✅ Don't redirect if already on auth page — prevents reload loop
          if (!isAuthPage()) {
            await get().logout()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          }
          throw new Error('Session expired')
        }

        const data: { access_token: string; user: User } = await response.json()

        set({
          accessToken: data.access_token,
          user: data.user,
          isAuthenticated: true,
        })

        return data.access_token
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)