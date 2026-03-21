'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import {
  MessageCircle, Users, Edit3, Check, X,
  Github, Twitter, Globe, Linkedin, Calendar,
  Star, Download, Eye, ArrowLeft, ChevronRight,
  MapPin, BookOpen, TrendingUp, UserPlus, UserCheck,
  Camera, Lock, Trash2, Shield, Loader2, AlertCircle, Plus,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { springApi, api } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  username: string
  name: string
  email: string
  phone?: string | null
  avatarUrl?: string | null
  provider: string
  createdAt: string
  updatedAt: string
  emailVerified: boolean
  role: string
  status: string
  bio?: string | null
  location?: string | null
  website?: string | null
  github?: string | null
  twitter?: string | null
  linkedin?: string | null
}

interface Project {
  id: string
  projectTitle: string
  description: string
  slug: string
  projectType: string
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: string
  githubUrl?: string
  demoVideoUrl?: string
  downloadUrl?: string
  viewCount: number
  downloadCount: number
  avgRating: number
  createdAt: string
  updatedAt: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const difficultyConfig = {
  BEGINNER: { label: 'Beginner', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
  INTERMEDIATE: { label: 'Intermediate', class: 'bg-amber-500/10  text-amber-400   border-amber-500/25', dot: 'bg-amber-400' },
  ADVANCED: { label: 'Advanced', class: 'bg-rose-500/10   text-rose-400    border-rose-500/25', dot: 'bg-rose-400' },
}

const statusConfig: Record<string, { label: string; class: string }> = {
  APPROVED: { label: 'Live', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
  UNDER_REVIEW: { label: 'In Review', class: 'bg-amber-500/10  text-amber-400   border-amber-500/25' },
  DRAFT: { label: 'Draft', class: 'bg-zinc-500/10   text-zinc-400    border-zinc-500/25' },
  REJECTED: { label: 'Rejected', class: 'bg-rose-500/10   text-rose-400    border-rose-500/25' },
}

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }
function timeAgo(iso: string) { return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
function getInitials(name: string) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) }

type Tab = 'projects' | 'about' | 'settings'

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-border/30" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground tracking-wide">Loading profile…</p>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-rose-400" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-lg">Profile not found</p>
          <p className="text-sm text-muted-foreground mt-1">This profile may not exist or was removed.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onRetry} className="px-4 py-2 rounded-xl text-sm border border-border/60 hover:border-violet-500/40 transition-colors">
            Try again
          </button>
          <Link href="/explore" className="px-4 py-2 rounded-xl text-sm bg-violet-600 text-white hover:bg-violet-500 transition-colors">
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index, isOwner }: { project: Project; index: number; isOwner: boolean }) {
  const diff = difficultyConfig[project.difficultyLevel] ?? difficultyConfig.BEGINNER
  const status = statusConfig[project.status] ?? statusConfig.DRAFT

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block h-full">
        <div className="relative h-full flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden
          hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/8 hover:-translate-y-1
          transition-all duration-300">

          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/0
            group-hover:from-violet-500/3 transition-all duration-500 pointer-events-none" />

          <div className="relative flex flex-col gap-3 p-5 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-sm leading-snug text-foreground
                group-hover:text-violet-300 transition-colors duration-200 flex-1 line-clamp-2">
                {project.projectTitle}
              </h3>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${diff.class}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                  {diff.label}
                </span>
                {isOwner && project.status !== 'APPROVED' && (
                  <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.class}`}>
                    {status.label}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {project.description}
            </p>

            <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-lg
              bg-muted/30 border border-border/40 text-muted-foreground font-medium w-fit">
              {project.projectType}
            </span>
          </div>

          <div className="relative px-5 py-3 border-t border-border/30 bg-muted/5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground/70">
                  {project.avgRating > 0 ? project.avgRating.toFixed(1) : '—'}
                </span>
              </span>
              <span className="w-px h-3 bg-border/50" />
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />{fmt(project.downloadCount)}
              </span>
              <span className="w-px h-3 bg-border/50" />
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />{fmt(project.viewCount)}
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-violet-400 opacity-0 -translate-x-1
              group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ user, onClose, onSave }: {
  user: UserProfile
  onClose: () => void
  onSave: (u: Partial<UserProfile>) => Promise<void>
}) {
  const [form, setForm] = useState({
    name: user.name ?? '',
    bio: user.bio ?? '',
    location: user.location ?? '',
    website: user.website ?? '',
    github: user.github ?? '',
    twitter: user.twitter ?? '',
    linkedin: user.linkedin ?? '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  const inputCls = `w-full h-9 px-3 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground
    placeholder:text-muted-foreground/40 outline-none focus:border-violet-500/60
    focus:ring-2 focus:ring-violet-500/10 transition-all`
  const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl overflow-hidden
          max-h-[90vh] flex flex-col shadow-2xl shadow-black/40"
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <h2 className="text-sm font-semibold text-foreground">Edit Profile</h2>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-4 flex items-center gap-4 border-b border-border/40">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              {getInitials(user.name)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-violet-600 flex items-center justify-center">
              <Camera className="w-2.5 h-2.5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Display Name</label>
              <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Your name" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Bio</label>
              <textarea value={form.bio} onChange={set('bio')} rows={3}
                className={`${inputCls} h-auto py-2.5 resize-none leading-relaxed`}
                placeholder="Tell people about yourself" />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input value={form.location} onChange={set('location')} className={inputCls} placeholder="City, Country" />
            </div>
            <div>
              <label className={labelCls}>Website</label>
              <input value={form.website} onChange={set('website')} className={inputCls} placeholder="https://…" />
            </div>
            <div>
              <label className={labelCls}>GitHub</label>
              <input value={form.github} onChange={set('github')} className={inputCls} placeholder="username" />
            </div>
            <div>
              <label className={labelCls}>Twitter</label>
              <input value={form.twitter} onChange={set('twitter')} className={inputCls} placeholder="username" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>LinkedIn</label>
              <input value={form.linkedin} onChange={set('linkedin')} className={inputCls} placeholder="username" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-border/40">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-border/60 text-sm font-medium
              text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold
              transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({ user }: { user: UserProfile }) {
  const [notifications, setNotifications] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange}
      className="w-10 h-5 rounded-full transition-all duration-200 relative shrink-0"
      style={{ background: value ? '#7c3aed' : 'rgba(255,255,255,0.08)' }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: value ? '1.25rem' : '0.125rem' }} />
    </button>
  )

  const sectionCls = "bg-card border border-border/50 rounded-2xl overflow-hidden"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">

        <div className={sectionCls}>
          <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Account</h3>
          </div>
          <div className="divide-y divide-border/30">
            {[
              { label: 'Email Address', value: user.email },
              { label: 'Username', value: `@${user.username}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div>
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{value}</p>
                </div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60
                  text-muted-foreground hover:text-foreground hover:border-violet-500/40
                  hover:bg-violet-500/5 transition-all shrink-0">
                  Change
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionCls}>
          <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Privacy</h3>
          </div>
          <div className="divide-y divide-border/30">
            {[
              { label: 'Private Profile', desc: 'Only followers can see your projects', value: privateProfile, toggle: () => setPrivateProfile(v => !v) },
              { label: 'Email Notifications', desc: 'Receive updates about your projects', value: notifications, toggle: () => setNotifications(v => !v) },
            ].map(({ label, desc, value, toggle }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Toggle value={value} onChange={toggle} />
              </div>
            ))}
          </div>
        </div>

        <div className={sectionCls}>
          <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Security</h3>
          </div>
          <div className="px-5 py-4">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60
              text-sm font-medium text-muted-foreground hover:text-foreground
              hover:border-violet-500/40 hover:bg-violet-500/5 transition-all">
              <Lock className="w-3.5 h-3.5" /> Change Password
            </button>
          </div>
        </div>

        <div className={`${sectionCls} !border-rose-500/20`}>
          <div className="px-5 py-3.5 border-b border-rose-500/20 flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Danger Zone</h3>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently remove your account and all data</p>
            </div>
            <button className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-all">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-3 h-fit">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Account Info</p>
        {[
          { label: 'Member Since', value: timeAgo(user.createdAt) },
          { label: 'Account Type', value: user.role },
          { label: 'Status', value: user.status },
          { label: 'Email Verified', value: user.emailVerified ? 'Yes' : 'No' },
          { label: 'Auth Provider', value: user.provider },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UserProfileContent({ username }: { username: string }) {
  const { isAuthenticated, user: authUser, accessToken } = useAuthStore()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<Tab>('projects')
  const [followed, setFollowed] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const isOwnProfile = isAuthenticated && authUser?.username === username

  // ── Fetch ──────────────────────────────────────────────────────────────────
  //
  // BUG FIX — two root causes:
  //
  // 1. Owner path called `/api/auth/me/projects` through the Next.js proxy.
  //    If that proxy route doesn't exist the fetch throws, the catch silently
  //    runs setProjects([]), and you see an empty grid with no error.
  //    Fix: owner now calls Spring directly at /v4/users/me/projects with the
  //    Authorization header — no extra Next.js proxy route required.
  //
  // 2. Response may be envelope-wrapped: { data: [...] } or { content: [...] }.
  //    Fix: extractList unwraps any known envelope before setting state.
  //
  const extractList = (payload: unknown): Project[] => {
    if (Array.isArray(payload)) return payload
    if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>
      for (const key of ['data', 'content', 'projects', 'items', 'results']) {
        if (Array.isArray(obj[key])) return obj[key] as Project[]
      }
    }
    return []
  }

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(false)

    try {
      const res = await springApi.get<UserProfile>(`/v4/users/${username}`)
      setProfile(res.data)
    } catch {
      setError(true)
      setLoading(false)
      return
    }

    try {
      if (isOwnProfile && accessToken) {
        const res = await springApi.get<unknown>('/v4/users/me/projects', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setProjects(extractList(res.data))
      } else {
        const res = await springApi.get<unknown>(`/v4/users/${username}/projects`)
        setProjects(extractList(res.data))
        console.log('[UserProfile] fetched projects:', res.data)
      }
    } catch (err) {
      console.error('[UserProfile] projects fetch failed:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [username, isOwnProfile, accessToken])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleSave = async (updates: Partial<UserProfile>) => {
    try {
      await springApi.patch('/v4/users/me', updates, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProfile(prev => prev ? { ...prev, ...updates } : prev)
    } catch (err) {
      console.error('[UserProfile] save failed:', err)
    }
  }

  if (loading) return <LoadingState />
  if (error || !profile) return <ErrorState onRetry={fetchProfile} />

  const totalDownloads = projects.reduce((s, p) => s + (p.downloadCount ?? 0), 0)
  const totalViews = projects.reduce((s, p) => s + (p.viewCount ?? 0), 0)
  const avgRating = projects.length
    ? projects.reduce((s, p) => s + (p.avgRating ?? 0), 0) / projects.length
    : 0

  const visibleProjects = isOwnProfile
    ? projects
    : projects.filter(p => p.status === 'APPROVED')

  const STATS = [
    { label: 'Projects', value: String(visibleProjects.length), icon: <BookOpen className="w-4 h-4" />, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
    { label: 'Downloads', value: fmt(totalDownloads), icon: <Download className="w-4 h-4" />, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
    { label: 'Views', value: fmt(totalViews), icon: <Eye className="w-4 h-4" />, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Avg Rating', value: avgRating > 0 ? avgRating.toFixed(1) : '—', icon: <Star className="w-4 h-4" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  ]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'projects', label: `Projects${visibleProjects.length ? ` (${visibleProjects.length})` : ''}` },
    { id: 'about', label: 'About' },
    ...(isOwnProfile ? [{ id: 'settings' as Tab, label: 'Settings' }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {editOpen && (
          <EditModal user={profile} onClose={() => setEditOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/explore" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Explore
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-foreground font-medium">{profile.username}</span>
        {isOwnProfile && (
          <>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold
              bg-violet-500/15 text-violet-400 border border-violet-500/25">
              Your Profile
            </span>
          </>
        )}
      </div>

      {/* Hero */}
      <div className="relative border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(124,58,237,0.12), transparent)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 45% 35% at 85% 65%, rgba(6,182,212,0.07), transparent)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 40% 30% at 10% 80%, rgba(16,185,129,0.05), transparent)' }} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-violet-500/60 via-cyan-500/40 to-transparent" />

        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">

            {/* Avatar */}
            <div className="relative shrink-0 self-start">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 scale-110"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-border/50" />
              ) : (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center
                  text-white text-2xl sm:text-3xl font-bold ring-2 ring-border/50"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  {getInitials(profile.name)}
                </div>
              )}
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-background bg-emerald-400" />
              {isOwnProfile && (
                <button onClick={() => setEditOpen(true)}
                  className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-xl bg-violet-600 hover:bg-violet-500
                    flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-violet-500/30">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{profile.name}</h1>
                <span className="text-sm text-muted-foreground font-medium">@{profile.username}</span>
                {isOwnProfile && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full
                    bg-violet-500/15 text-violet-400 border border-violet-500/25 uppercase tracking-wider">
                    You
                  </span>
                )}
                {!profile.emailVerified && isOwnProfile && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full
                    bg-amber-500/15 text-amber-400 border border-amber-500/25 uppercase tracking-wider">
                    Unverified
                  </span>
                )}
              </div>

              {profile.bio ? (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{profile.bio}</p>
              ) : isOwnProfile && (
                <button onClick={() => setEditOpen(true)}
                  className="text-sm text-muted-foreground/50 hover:text-muted-foreground italic transition-colors">
                  + Add a bio…
                </button>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-violet-400" />{profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />Joined {timeAgo(profile.createdAt)}
                </span>
                <span className="capitalize font-medium text-foreground/60">{profile.role.toLowerCase()}</span>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                {[
                  { icon: <Github className="w-3.5 h-3.5" />, href: profile.github ? `https://github.com/${profile.github}` : null, color: '#7c3aed' },
                  { icon: <Twitter className="w-3.5 h-3.5" />, href: profile.twitter ? `https://twitter.com/${profile.twitter}` : null, color: '#06b6d4' },
                  { icon: <Linkedin className="w-3.5 h-3.5" />, href: profile.linkedin ? `https://linkedin.com/in/${profile.linkedin}` : null, color: '#10b981' },
                  { icon: <Globe className="w-3.5 h-3.5" />, href: profile.website ?? null, color: '#f59e0b' },
                ].filter(l => l.href).map(({ icon, href, color }, i) => (
                  <a key={i} href={href!} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-xl border border-border/50 flex items-center justify-center
                      text-muted-foreground transition-all duration-200"
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = color; el.style.background = `${color}15`; el.style.borderColor = `${color}40` }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = ''; el.style.background = ''; el.style.borderColor = '' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
              {isOwnProfile ? (
                <button onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60
                    bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground
                    hover:border-violet-500/40 hover:bg-violet-500/5 active:scale-[0.98] transition-all">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : isAuthenticated ? (
                <>
                  <button onClick={() => setFollowed(!followed)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                      active:scale-[0.98] transition-all"
                    style={followed
                      ? { background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }
                      : { background: '#7c3aed', color: '#fff' }
                    }
                  >
                    {followed
                      ? <><UserCheck className="w-4 h-4" /> Following</>
                      : <><UserPlus className="w-4 h-4" /> Follow</>
                    }
                  </button>
                  <button className="w-10 h-10 rounded-xl border border-border/60 bg-muted/20
                    flex items-center justify-center text-muted-foreground
                    hover:text-foreground hover:border-violet-500/40 hover:bg-violet-500/5 transition-all">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60
                    bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                  Sign in to follow
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(({ label, value, icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50
                  bg-card overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}08, transparent 70%)` }} />
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg, color }}>
                  {icon}
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/20 border border-border/40 rounded-xl w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id
                ? 'bg-background border border-border/60 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Projects ── */}
            {tab === 'projects' && (
              <div className="space-y-5">
                {isOwnProfile && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold">{visibleProjects.length}</span>{' '}
                      project{visibleProjects.length !== 1 ? 's' : ''}
                      {projects.length !== visibleProjects.length && (
                        <span className="ml-1.5 text-xs text-muted-foreground/50">
                          · {projects.length - visibleProjects.length} pending/draft
                        </span>
                      )}
                    </p>
                    <Link href="/projects/new"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                        bg-violet-600 hover:bg-violet-500 text-white active:scale-[0.98] transition-all
                        shadow-lg shadow-violet-500/20">
                      <Plus className="w-3.5 h-3.5" /> New Project
                    </Link>
                  </div>
                )}

                {visibleProjects.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center gap-4 py-20
                      border border-dashed border-border/50 rounded-2xl"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-muted/30 border border-border/50
                      flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">No projects yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isOwnProfile ? 'Share your first project with the community.' : 'This user has no public projects.'}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <Link href="/projects/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                          bg-violet-600 hover:bg-violet-500 text-white transition-all">
                        <Plus className="w-3.5 h-3.5" /> Upload a Project
                      </Link>
                    )}
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleProjects.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={i} isOwner={isOwnProfile} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── About ── */}
            {tab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">

                  <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Profile Details</p>
                    </div>
                    <div className="divide-y divide-border/25">
                      {([
                        { label: 'Email', value: profile.email, icon: <Mail className="w-3.5 h-3.5" />, color: '#7c3aed' },
                        { label: 'Location', value: profile.location ?? null, icon: <MapPin className="w-3.5 h-3.5" />, color: '#10b981' },
                        { label: 'Member Since', value: timeAgo(profile.createdAt), icon: <Calendar className="w-3.5 h-3.5" />, color: '#f59e0b' },
                        { label: 'Website', value: profile.website ?? null, icon: <Globe className="w-3.5 h-3.5" />, color: '#06b6d4' },
                      ] as { label: string; value: string | null; icon: React.ReactNode; color: string }[])
                        .filter(r => r.value)
                        .map(({ label, value, icon, color }) => (
                          <div key={label} className="flex items-center gap-4 px-5 py-4">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `${color}15`, color }}>
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                              {label === 'Website' ? (
                                <a href={value!} target="_blank" rel="noopener noreferrer"
                                  className="text-sm font-medium truncate block hover:underline" style={{ color: '#06b6d4' }}>
                                  {value}
                                </a>
                              ) : (
                                <p className="text-sm font-medium text-foreground truncate">{value}</p>
                              )}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {(profile.github || profile.twitter || profile.linkedin || profile.website) && (
                    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Social</p>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-2">
                        {[
                          { icon: <Github className="w-4 h-4" />, label: 'GitHub', handle: profile.github, href: profile.github ? `https://github.com/${profile.github}` : null, color: '#7c3aed' },
                          { icon: <Twitter className="w-4 h-4" />, label: 'Twitter', handle: profile.twitter, href: profile.twitter ? `https://twitter.com/${profile.twitter}` : null, color: '#06b6d4' },
                          { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', handle: profile.linkedin, href: profile.linkedin ? `https://linkedin.com/in/${profile.linkedin}` : null, color: '#10b981' },
                          { icon: <Globe className="w-4 h-4" />, label: 'Website', handle: 'Visit', href: profile.website ?? null, color: '#f59e0b' },
                        ].filter(l => l.href).map(({ icon, label, handle, href, color }) => (
                          <a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-border/40
                              bg-muted/10 hover:-translate-y-0.5 transition-all duration-200 group"
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${color}30`; el.style.background = `${color}08` }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ''; el.style.background = '' }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${color}15`, color }}>
                              {icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground">{label}</p>
                              <p className="text-[11px] text-muted-foreground truncate">@{handle}</p>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              style={{ color }} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-card border border-border/50 rounded-2xl overflow-hidden h-fit">
                  <div className="px-4 py-3.5 border-b border-border/40 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Activity</p>
                  </div>
                  <div className="divide-y divide-border/25">
                    {[
                      { label: 'Projects', value: String(visibleProjects.length), color: '#7c3aed' },
                      { label: 'Total Downloads', value: fmt(totalDownloads), color: '#06b6d4' },
                      { label: 'Total Views', value: fmt(totalViews), color: '#10b981' },
                      { label: 'Avg Rating', value: avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : '—', color: '#f59e0b' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Settings ── */}
            {tab === 'settings' && isOwnProfile && <SettingsPanel user={profile} />}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}