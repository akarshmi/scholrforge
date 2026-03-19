// ── TopBar.tsx ────────────────────────────────────────────────────────────────
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/useUIStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Search, Bell, Menu, Upload, LayoutGrid } from 'lucide-react'

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'alice_dev starred your project', time: '2m ago', dot: '#6c63ff' },
  { id: '2', text: 'New review on AI Chatbot Platform', time: '1h ago', dot: '#00d4aa' },
  { id: '3', text: 'Your project hit 1k downloads', time: '3h ago', dot: '#ffd700' },
]

export default function TopBar() {
  const setSearchOpen = useUIStore(s => s.setSearchOpen)
  const setSidebarCollapsed = useUIStore(s => s.setSidebarCollapsed)
  const { user } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  // ✅ REMOVED: duplicate ⌘K listener — SearchCommand already owns this globally.
  //    Having two listeners means two calls to setSearchOpen on every keystroke.

  // Close notif panel on outside click
  useEffect(() => {
    if (!notifOpen) return
    const handler = () => setNotifOpen(false)
    // setTimeout defers until after the current click event finishes bubbling,
    // otherwise the click that opened the panel immediately closes it.
    const t = setTimeout(() => document.addEventListener('click', handler), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('click', handler)
    }
  }, [notifOpen])

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-border/50 backdrop-blur-xl shrink-0"
      style={{ background: 'rgba(10,10,15,0.85)' }}
    >
      <div className="flex h-13 items-center gap-3 px-4 sm:px-5">

        {/* Mobile: hamburger + logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'rgba(108,99,255,0.2)' }}
            >
              <LayoutGrid className="w-3.5 h-3.5" style={{ color: '#6c63ff' }} />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              scholrforge
            </span>
          </Link>
        </div>

        {/* Desktop search trigger */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex flex-1 max-w-sm items-center gap-2.5 h-9 px-3.5 rounded-xl border border-border/50 bg-muted/15 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all text-sm"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left text-xs">Search projects, users...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border border-border/50 bg-muted/30 text-muted-foreground/60 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* ✅ Mobile search icon — moved BEFORE the right-side group so ml-auto
            pushes it to the right without conflicting with the avatar/bell cluster */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors ml-auto"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Right-side actions */}
        <div className="flex items-center gap-1.5 md:ml-auto">

          {/* Upload shortcut */}
          {user && (
            <Link
              href="/projects/new"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(108,99,255,0.15)',
                color: '#6c63ff',
                border: '1px solid rgba(108,99,255,0.3)',
              }}
            >
              <Upload className="w-3.5 h-3.5" /> Upload
            </Link>
          )}

          {/* Notifications */}
          {user && (
            // ✅ stopPropagation on the wrapper so clicks inside don't
            //    bubble up to the document and trigger the outside-click handler
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(prev => !prev)
                  setHasUnread(false)
                }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <Bell className="w-[18px] h-[18px]" />
                {hasUnread && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-background"
                    style={{ background: '#ff4d6d' }}
                  />
                )}
              </button>

              {notifOpen && (
                <div
                  className="absolute right-0 top-11 w-80 rounded-2xl border border-border/50 overflow-hidden z-50"
                  style={{ background: '#0f0f18' }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                    <span className="text-xs font-semibold text-foreground">Notifications</span>
                    <button
                      type="button"
                      className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="divide-y divide-border/30">
                    {MOCK_NOTIFICATIONS.map(({ id, text, time, dot }) => (
                      <div
                        key={id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-muted/10 transition-colors cursor-pointer"
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: dot }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">{text}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2.5 border-t border-border/40">
                    <button
                      type="button"
                      className="text-xs text-center w-full"
                      style={{ color: '#6c63ff' }}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Avatar */}
          {user && (
            <Link
              href={`/u/${user.username}`}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)' }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </Link>
          )}

          {/* Guest sign in */}
          {!user && (
            <Link
              href="/login"
              className="h-8 px-4 rounded-xl text-xs font-semibold text-white flex items-center transition-all active:scale-[0.98]"
              style={{ background: '#6c63ff' }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}