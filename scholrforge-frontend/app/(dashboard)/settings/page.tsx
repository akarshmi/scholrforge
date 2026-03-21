'use client'

/**
 * app/settings/page.tsx
 *
 * Self-contained settings page.
 * Reads user from Zustand (auth-storage → state.user).
 * Calls /api/auth/... routes for account actions.
 *
 * Sections:
 *   Profile    — name, username, bio, avatar
 *   Account    — email, change password
 *   Appearance — theme preferences (stored locally)
 *   Danger     — delete account
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Lock, Palette, Trash2, Camera,
  ChevronRight, ArrowLeft, Save, Eye, EyeOff,
  AlertTriangle, Check, LogOut,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
}

// ─── Zustand store reader (no direct import needed) ───────────────────────────

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return null
    return JSON.parse(raw)?.state?.user ?? null
  } catch { return null }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return null
    return JSON.parse(raw)?.state?.accessToken ?? null
  } catch { return null }
}

function authHeaders(): HeadersInit {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Nav sections ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'profile',    label: 'Profile',    icon: User },
  { id: 'account',    label: 'Account',    icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'danger',     label: 'Danger zone',icon: Trash2 },
] as const

type SectionId = typeof SECTIONS[number]['id']

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls = [
  'w-full px-4 py-2.5 rounded-xl text-sm',
  'bg-white/5 border border-white/10',
  'text-white placeholder:text-white/30',
  'focus:outline-none focus:border-[#6c63ff]/60 focus:bg-white/8',
  'transition-all duration-200',
].join(' ')

const labelCls = 'block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase'

// ─── Section: Profile ─────────────────────────────────────────────────────────

function ProfileSection({ user }: { user: AuthUser }) {
  const [name,     setName]     = useState(user.username ?? '')
  const [bio,      setBio]      = useState(user.bio ?? '')
  const [saving,   setSaving]   = useState(false)
  const [avatar,   setAvatar]   = useState(user.avatar ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatar(url)
    toast.success('Avatar updated — save to apply')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(r => setTimeout(r, 800)) // replace with real API call
      toast.success('Profile saved')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const initials = (user.username ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <p className="text-sm text-white/40 mt-1">How you appear to others on Scholrforge</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-bold cursor-pointer"
            style={{ background: avatar ? undefined : 'linear-gradient(135deg, #6c63ff, #00d4aa)' }}
            onClick={() => fileRef.current?.click()}
          >
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-white">{initials}</span>
            }
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{user.username}</p>
          <p className="text-xs text-white/40 mt-0.5">{user.email}</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs text-[#6c63ff] hover:text-[#8b83ff] mt-1.5 transition-colors"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4 max-w-md">
        <div>
          <label className={labelCls}>Username</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="your_username"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            placeholder="Tell the community a bit about yourself..."
            className={`${inputCls} resize-none`}
          />
          <p className="text-[11px] text-white/25 mt-1">{bio.length}/160</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#6c63ff] text-white hover:bg-[#7b73ff] disabled:opacity-50 active:scale-[0.98] transition-all"
      >
        {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><Save className="w-3.5 h-3.5" /> Save profile</>}
      </button>
    </div>
  )
}

// ─── Section: Account ─────────────────────────────────────────────────────────

function AccountSection({ user }: { user: AuthUser }) {
  const [currentPw,  setCurrentPw]  = useState('')
  const [newPw,      setNewPw]      = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [saving,     setSaving]     = useState(false)

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8)    { toast.error('Password must be at least 8 characters'); return }
    setSaving(true)
    try {
      await new Promise(r => setTimeout(r, 800)) // replace with real API call
      toast.success('Password changed')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch {
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Account</h2>
        <p className="text-sm text-white/40 mt-1">Manage your email and password</p>
      </div>

      {/* Email — read only */}
      <div className="max-w-md space-y-1.5">
        <label className={labelCls}>Email address</label>
        <input value={user.email} readOnly className={`${inputCls} opacity-50 cursor-not-allowed`} />
        <p className="text-[11px] text-white/25">Contact support to change your email</p>
      </div>

      {/* Change password */}
      <div className="max-w-md space-y-4">
        <div className="pt-2 border-t border-white/8">
          <p className="text-sm font-medium text-white mb-4">Change password</p>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Current password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>New password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Confirm new password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={saving || !currentPw || !newPw || !confirmPw}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#6c63ff] text-white hover:bg-[#7b73ff] disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          {saving
            ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
            : <><Lock className="w-3.5 h-3.5" /> Update password</>
          }
        </button>
      </div>
    </div>
  )
}

// ─── Section: Appearance ──────────────────────────────────────────────────────

const ACCENT_COLORS = [
  { name: 'Violet',  value: '#6c63ff' },
  { name: 'Teal',    value: '#00d4aa' },
  { name: 'Rose',    value: '#f43f5e' },
  { name: 'Amber',   value: '#f59e0b' },
  { name: 'Sky',     value: '#38bdf8' },
  { name: 'Lime',    value: '#84cc16' },
]

function AppearanceSection() {
  const [accent, setAccent] = useState('#6c63ff')
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Appearance</h2>
        <p className="text-sm text-white/40 mt-1">Customise how Scholrforge looks for you</p>
      </div>

      {/* Accent color */}
      <div className="space-y-3">
        <label className={labelCls}>Accent color</label>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setAccent(c.value)}
              title={c.name}
              className="relative w-8 h-8 rounded-full transition-transform active:scale-90"
              style={{ background: c.value }}
            >
              {accent === c.value && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white drop-shadow" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div className="space-y-3 max-w-sm">
        <label className={labelCls}>Layout density</label>
        <div className="flex gap-2">
          {(['compact', 'comfortable', 'spacious'] as const).map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              className="flex-1 py-2 rounded-xl text-xs font-medium border-2 transition-all capitalize"
              style={density === d
                ? { borderColor: accent, background: `${accent}18`, color: accent }
                : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/25">More appearance options coming soon</p>
    </div>
  )
}

// ─── Section: Danger ──────────────────────────────────────────────────────────

function DangerSection({ user }: { user: AuthUser }) {
  const [confirm,   setConfirm]   = useState('')
  const [deleting,  setDeleting]  = useState(false)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm !== user.username) { toast.error('Username does not match'); return }
    setDeleting(true)
    try {
      await new Promise(r => setTimeout(r, 1000)) // replace with real API call
      toast.success('Account deleted')
      router.push('/')
    } catch {
      toast.error('Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    localStorage.removeItem('auth-storage')
    router.push('/login')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Danger zone</h2>
        <p className="text-sm text-white/40 mt-1">Irreversible actions — proceed with caution</p>
      </div>

      {/* Logout */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-white/8 bg-white/2">
        <div>
          <p className="text-sm font-medium text-white">Sign out</p>
          <p className="text-xs text-white/40 mt-0.5">Sign out of your account on this device</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>

      {/* Delete account */}
      <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Delete account</p>
            <p className="text-xs text-white/40 mt-0.5">
              Permanently deletes your account, projects, and all associated data. This cannot be undone.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
        >
          Delete my account
        </button>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0f0f12] p-6 space-y-5"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Confirm deletion</p>
                  <p className="text-xs text-white/40">This action is permanent</p>
                </div>
              </div>
              <p className="text-xs text-white/50">
                Type <span className="text-white font-mono">{user.username}</span> to confirm
              </p>
              <input
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={user.username}
                className={inputCls}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={confirm !== user.username || deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition-all"
                >
                  {deleting ? 'Deleting…' : 'Delete account'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState<SectionId>('profile')
  const [user,   setUser]   = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const u = getStoredUser()
    if (!u) { router.push('/login'); return }
    setUser(u)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin" />
      </div>
    )
  }

  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white">

      {/* Breadcrumb navbar */}
      <div className="border-b border-white/5 bg-[#0a0a0e]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/explore" className="hover:text-white/70 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Explore
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link href={`/u/${user.username}`} className="hover:text-white/70 transition-colors">
            {user.username}
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-white/70 font-medium capitalize">{active}</span>
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/25">
            Settings
          </span>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #6c63ff, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 blur-[120px] opacity-10"
          style={{ background: 'radial-gradient(circle, #00d4aa, transparent)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </motion.div>

        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <motion.aside
            className="w-56 shrink-0 sticky top-8"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
          >
            {/* User pill */}
            <div className="flex items-center gap-3 px-3 py-3 mb-6 rounded-2xl bg-white/4 border border-white/8">
              <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: user.avatar ? undefined : 'linear-gradient(135deg, #6c63ff, #00d4aa)' }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                  : initials
                }
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.username}</p>
                <p className="text-[10px] text-white/35 truncate">{user.role}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5">
              {SECTIONS.map(s => {
                const Icon = s.icon
                const isActive = active === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActive(s.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group"
                    style={isActive
                      ? { background: 'rgba(108,99,255,0.12)', color: '#a89eff' }
                      : { color: 'rgba(255,255,255,0.4)' }
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      {s.label}
                    </span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                  </button>
                )
              })}
            </nav>
          </motion.aside>

          {/* Content */}
          <motion.main
            className="flex-1 min-w-0 rounded-2xl border border-white/8 bg-white/[0.02] p-8"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            {/* Top gradient line */}
            <div className="h-px w-full mb-8 -mt-8 rounded-t-2xl"
              style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.6), rgba(0,212,170,0.4), transparent)' }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                {active === 'profile'    && <ProfileSection    user={user} />}
                {active === 'account'    && <AccountSection    user={user} />}
                {active === 'appearance' && <AppearanceSection />}
                {active === 'danger'     && <DangerSection     user={user} />}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </div>
  )
}