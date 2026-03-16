import { create } from 'zustand';

export interface UIState {
  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modals
  isSearchOpen: boolean;
  searchQuery: string;

  // User preferences
  theme: 'dark' | 'light';
  compactMode: boolean;

  // Notifications
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }>;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCompactMode: (compact: boolean) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  isSearchOpen: false,
  searchQuery: '',
  theme: 'dark',
  compactMode: false,
  notifications: [],

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  setSearchOpen: (open) => {
    set({ isSearchOpen: open });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  },

  setCompactMode: (compact) => {
    set({ compactMode: compact });
  },

  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id,
          duration: notification.duration ?? 3000,
        },
      ],
    }));

    // Auto-remove notification after duration
    if (notification.duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration ?? 3000);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
