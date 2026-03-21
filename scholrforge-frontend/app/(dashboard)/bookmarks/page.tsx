'use client'

/**
 * app/bookmarks/page.tsx
 *
 * Self-contained bookmarks page.
 * Reads auth from Zustand (auth-storage → state).
 * Fetches bookmarked projects from /api/bookmarks.
 *
 * Features:
 *   - Search within bookmarks
 *   - Filter by project type
 *   - Remove bookmark
 *   - Empty state
 *   - Loading skeleton
 */

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bookmark, ArrowLeft, Search, X,
  Download, Star, ExternalLink,
  Layers, Code2, BookOpen, Gauge, Link2,
  Filter, Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string
  slug: string
  projectTitle: string
  description: string
  projectType: 'WEB' | 'MOBILE' | 'AI' | 'MACHINE_LEARNING' | 'DESKTOP' | 'EMBEDDED' | 'IOT'
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  techStack: { id: string; name: string }[]
  tags: { id: string; name: string }[]
  avgRating: number
  downloadCount: number
  author?: { username: string; name: string; avatarUrl?: string }
  createdAt: string
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function getAuth(): { user: { username: string } | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null }
  try {
    const raw = localStorage.getItem('auth-storage')
    const state = raw ? JSON.parse(raw)?.state : null
    return { user: state?.user ?? null, token: state?.accessToken ?? null }
  } catch { return { user: null, token: null } }
}

function authHeaders(): HeadersInit {
  const { token } = getAuth()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<Project['projectType'], { label: string; icon: React.ReactNode; color: string }> = {
  WEB:             { label: 'Web',             icon: <Layers className="w-3.5 h-3.5" />,   color: '#6c63ff' },
  MOBILE:          { label: 'Mobile',          icon: <Gauge className="w-3.5 h-3.5" />,    color: '#00d4aa' },
  AI:              { label: 'AI',              icon: <Code2 className="w-3.5 h-3.5" />,    color: '#f59e0b' },
  MACHINE_LEARNING:{ label: 'ML',              icon: <BookOpen className="w-3.5 h-3.5" />, color: '#f43f5e' },
  DESKTOP:         { label: 'Desktop',         icon: <Link2 className="w-3.5 h-3.5" />,    color: '#38bdf8' },
  EMBEDDED:        { label: 'Embedded',        icon: <Gauge className="w-3.5 h-3.5" />,    color: '#84cc16' },
  IOT:             { label: 'IoT',             icon: <Layers className="w-3.5 h-3.5" />,   color: '#e879f9' },
}

const DIFFICULTY_COLORS = {
  BEGINNER:     { bg: 'rgba(0,212,170,0.1)',   text: '#00d4aa',  border: 'rgba(0,212,170,0.2)' },
  INTERMEDIATE: { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b',  border: 'rgba(245,158,11,0.2)' },
  ADVANCED:     { bg: 'rgba(244,63,94,0.1)',   text: '#f43f5e',  border: 'rgba(244,63,94,0.2)' },
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-5 space-y-3 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/8 rounded-lg w-2/3" />
          <div className="h-3 bg-white/5 rounded-lg w-full" />
          <div className="h-3 bg-white/5 rounded-lg w-4/5" />
        </div>
        <div className="w-8 h-8 bg-white/6 rounded-xl shrink-0" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-white/6 rounded-full" />
        <div className="h-5 w-20 bg-white/6 rounded-full" />
      </div>
      <div className="flex gap-3 pt-1 border-t border-white/5">
        <div className="h-3 w-16 bg-white/5 rounded" />
        <div className="h-3 w-16 bg-white/5 rounded" />
      </div>
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function BookmarkCard({ project, onRemove }: { project: Project; onRemove: (id: string) => void }) {
  const [removing, setRemoving] = useState(false)
  const meta       = TYPE_META[project.projectType]
  const difficulty = DIFFICULTY_COLORS[project.difficultyLevel]

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setRemoving(true)
    try {
      const res = await fetch(`/api/bookmarks/${project.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      })
      if (!res.ok) throw new Error()
      toast.success('Bookmark removed')
      onRemove(project.id)
    } catch {
      toast.error('Failed to remove bookmark')
      setRemoving(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-5 hover:border-white/12 hover:bg-white/[0.04] transition-all duration-200 space-y-4">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                {/* Type badge */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}
                >
                  {meta.icon}{meta.label}
                </span>
                {/* Difficulty badge */}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize"
                  style={{ background: difficulty.bg, color: difficulty.text, borderColor: difficulty.border }}
                >
                  {project.difficultyLevel.toLowerCase()}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-[#a89eff] transition-colors line-clamp-1">
                {project.projectTitle}
              </h3>
              <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/8 bg-white/4 text-white/30 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/8 transition-all shrink-0 disabled:opacity-40"
              aria-label="Remove bookmark"
            >
              {removing
                ? <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />
              }
            </button>
          </div>

          {/* Tech stack */}
          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map(t => (
                <span key={t.id}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-white/40 border border-white/6">
                  {t.name}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] text-white/25">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <div className="flex items-center gap-3 text-[11px] text-white/30">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {project.avgRating?.toFixed(1) ?? '0.0'}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {project.downloadCount ?? 0}
              </span>
              {project.author && (
                <span className="text-white/20">by {project.author.username}</span>
              )}
            </div>
            <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border"
        style={{ background: 'rgba(108,99,255,0.08)', borderColor: 'rgba(108,99,255,0.2)' }}
      >
        <Bookmark className="w-7 h-7" style={{ color: '#6c63ff' }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-2">
        {filtered ? 'No matches found' : 'No bookmarks yet'}
      </h3>
      <p className="text-sm text-white/35 max-w-xs leading-relaxed">
        {filtered
          ? 'Try a different search or filter'
          : 'Save projects you want to revisit — look for the bookmark icon on any project page'
        }
      </p>
      {!filtered && (
        <Link
          href="/explore"
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#6c63ff] text-white hover:bg-[#7b73ff] transition-all"
        >
          Explore projects
        </Link>
      )}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookmarksPage() {
  const router = useRouter()
  const [projects,  setProjects]  = useState<Project[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [typeFilter,setTypeFilter]= useState<Project['projectType'] | 'ALL'>('ALL')
  const [username,  setUsername]  = useState('')

  useEffect(() => {
    const { user, token } = getAuth()
    if (!user) { router.push('/login'); return }
    setUsername(user.username)
    fetchBookmarks(token)
  }, [router])

  const fetchBookmarks = async (token: string | null) => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      // Handle both { data: [...] } and [...] response shapes
      setProjects(Array.isArray(data) ? data : (data?.data ?? []))
    } catch {
      toast.error('Failed to load bookmarks')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  // Filter
  const filtered = projects.filter(p => {
    const matchesSearch = !search ||
      p.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack?.some(t => t.name.toLowerCase().includes(search.toLowerCase()))
    const matchesType = typeFilter === 'ALL' || p.projectType === typeFilter
    return matchesSearch && matchesType
  })

  const types = ['ALL', ...Array.from(new Set(projects.map(p => p.projectType)))] as const

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/3 w-80 h-80 blur-[100px] opacity-15"
          style={{ background: 'radial-gradient(circle, #6c63ff, transparent)' }} />
      </div>

      {/* Breadcrumb navbar */}
      <div className="border-b border-white/5 bg-[#0a0a0e]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/explore" className="hover:text-white/70 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Explore
          </Link>
          <span className="w-3 h-3 opacity-40 flex items-center justify-center">›</span>
          <Link href={`/u/${username}`} className="hover:text-white/70 transition-colors">
            {username}
          </Link>
          <span className="w-3 h-3 opacity-40 flex items-center justify-center">›</span>
          <span className="text-white/70 font-medium">Bookmarks</span>
          {!loading && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/6 text-white/40 border border-white/8">
              {projects.length}
            </span>
          )}
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/25">
            Saved
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Library</p>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Bookmarks
              <Bookmark className="w-6 h-6 text-[#6c63ff]" strokeWidth={2.5} />
            </h1>
          </div>
        </motion.div>

        {/* Search + filter bar */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bookmarks…"
              className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder:text-white/25 focus:outline-none focus:border-[#6c63ff]/40 focus:bg-white/8 transition-all"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type filter */}
          {!loading && types.length > 1 && (
            <div className="flex gap-1.5 flex-wrap">
              {types.map(t => {
                const isAll    = t === 'ALL'
                const isActive = typeFilter === t
                const meta     = !isAll ? TYPE_META[t as Project['projectType']] : null
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t as any)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all"
                    style={isActive
                      ? { borderColor: meta?.color ?? '#6c63ff', background: `${meta?.color ?? '#6c63ff'}18`, color: meta?.color ?? '#a89eff' }
                      : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }
                    }
                  >
                    {!isAll && meta?.icon}
                    {isAll ? 'All' : meta?.label}
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filtered={search !== '' || typeFilter !== 'ALL'} />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div key={project.id} style={{ animationDelay: `${i * 30}ms` }}>
                  <BookmarkCard project={project} onRemove={handleRemove} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}