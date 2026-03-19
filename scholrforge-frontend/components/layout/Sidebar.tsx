// ── Sidebar.tsx ───────────────────────────────────────────────────────────────
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/store/useUIStore'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Home, Compass, Zap, Upload, Bookmark,
  LogOut, X, LayoutGrid, LogIn, User,
  Settings, ChevronRight, Shield,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavLink {
  href: string
  icon: React.ElementType
  label: string
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/feed' || href === '/') return pathname === href
  return pathname.startsWith(href)
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: NavLink & { active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden"
      style={
        active
          ? { background: 'rgba(108,99,255,0.18)', color: '#ffffff' }
          : { color: 'rgba(255,255,255,0.45)' }
      }
      onMouseEnter={e => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.color = 'rgba(255,255,255,0.85)'
          el.style.background = 'rgba(255,255,255,0.05)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.color = 'rgba(255,255,255,0.45)'
          el.style.background = 'transparent'
        }
      }}
    >
      {active && (
        <>
          <motion.div
            layoutId="active-bar"
            className="absolute left-0 inset-y-2.5 w-[3px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, #6c63ff, #00d4aa)' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          />
          <motion.div
            layoutId="active-bg"
            className="absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(ellipse at 0% 50%, rgba(108,99,255,0.15), transparent 70%)',
            }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          />
        </>
      )}

      <Icon
        className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ color: active ? '#8b84ff' : 'inherit' }}
      />
      <span className="flex-1 tracking-tight">{label}</span>

      {active && (
        <motion.span
          layoutId="active-dot"
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: '#00d4aa' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
        />
      )}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const sidebarCollapsed = useUIStore(s => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore(s => s.setSidebarCollapsed)
  const { user, logout } = useAuthStore()

  const closeMobile = () => setSidebarCollapsed(true)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navLinks: NavLink[] = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/feed', icon: Zap, label: 'Feed' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    ...(user ? [
      { href: '/projects/new', icon: Upload, label: 'Upload' },
      { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    ] : []),
  ]

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? ''

  return (
    <>
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed left-0 top-0 h-screen w-60 z-50 flex flex-col
          border-r border-white/[0.06]
          transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0 lg:z-0
          ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `}
        style={{ background: '#08080f' }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full shrink-0"
          style={{
            background: 'linear-gradient(to right, rgba(108,99,255,0.8), rgba(0,212,170,0.5), transparent)',
          }}
        />

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
              style={{
                background: 'rgba(108,99,255,0.15)',
                border: '1px solid rgba(108,99,255,0.3)',
                boxShadow: '0 0 12px rgba(108,99,255,0.15)',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" style={{ color: '#6c63ff' }} />
            </div>
            <span
              className="text-sm font-bold tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #a09cff, #00d4aa)' }}
            >
              scholrforge
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-none">
          {navLinks.map(({ href, icon, label }) => (
            <NavItem
              key={`${href}-${label}`}
              href={href}
              icon={icon}
              label={label}
              active={isActivePath(pathname ?? '', href)}
              onClick={() => { if (window.innerWidth < 1024) closeMobile() }}
            />
          ))}

          <div className="my-3 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ color: 'rgba(255,77,109,0.75)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(255,77,109,0.08)'
                el.style.color = 'rgba(255,77,109,1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.color = 'rgba(255,77,109,0.75)'
              }}
            >
              <Shield className="w-4 h-4 shrink-0" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User section */}
        <div className="shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user ? (
            <div className="space-y-1">
              <Link
                href={`/u/${user.username}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
                    boxShadow: '0 2px 8px rgba(108,99,255,0.3)',
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user.username}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              <div className="flex gap-1">
                <Link
                  href="/settings"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(255,255,255,0.8)'
                    el.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(255,255,255,0.4)'
                    el.style.background = 'transparent'
                  }}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                  style={{ color: 'rgba(255,77,109,0.6)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(255,77,109,1)'
                    el.style.background = 'rgba(255,77,109,0.08)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(255,77,109,0.6)'
                    el.style.background = 'transparent'
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 px-1">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
                  boxShadow: '0 4px 14px rgba(108,99,255,0.3)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(108,99,255,0.5)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(108,99,255,0.3)')}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'rgba(255,255,255,0.8)'
                  el.style.borderColor = 'rgba(108,99,255,0.4)'
                  el.style.background = 'rgba(108,99,255,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'rgba(255,255,255,0.45)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.background = 'transparent'
                }}
              >
                <User className="w-4 h-4" />
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}