import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
  login: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setToken: (token) => {
    set({ token });
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
