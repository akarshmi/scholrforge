'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles, ArrowRight, TrendingUp, Clock, Star,
  Code2, Eye, Download, Heart, Globe, Cpu,
  Filter, ChevronRight, Zap, BookOpen, FlaskConical,
  ExternalLink, Github, AlertCircle, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { springApi } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string
  projectTitle: string
  description: string
  slug: string
  projectType: 'WEB' | 'MOBILE' | 'DESKTOP' | 'AI_ML' | 'SYSTEMS' | 'RESEARCH' | 'OTHER'
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DRAFT'
  githubUrl?: string
  demoVideoUrl?: string
  downloadUrl?: string
  viewCount: number
  downloadCount: number
  avgRating: number
  createdAt: string
  updatedAt: string
}

interface FetchParams {
  page: number
  size: number
  sort?: string
  type?: string
  search?: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'recent', label: 'Recent', icon: Clock, sort: 'createdAt,desc' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, sort: 'viewCount,desc' },
  { id: 'top', label: 'Top Rated', icon: Star, sort: 'avgRating,desc' },
] as const

type TabId = typeof TABS[number]['id']

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  WEB: { label: 'Web', icon: Globe, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  AI_ML: { label: 'AI / ML', icon: Cpu, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  SYSTEMS: { label: 'Systems', icon: Code2, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  RESEARCH: { label: 'Research', icon: FlaskConical, color: '#f9a8d4', bg: 'rgba(249,168,212,0.1)' },
  MOBILE: { label: 'Mobile', icon: Zap, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  DESKTOP: { label: 'Desktop', icon: BookOpen, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  OTHER: { label: 'Other', icon: Sparkles, color: '#e879f9', bg: 'rgba(232,121,249,0.1)' },
}

const DIFFICULTY_COLOR = {
  BEGINNER: { color: '#34d399', label: 'Beginner' },
  INTERMEDIATE: { color: '#fbbf24', label: 'Intermediate' },
  ADVANCED: { color: '#f87171', label: 'Advanced' },
}

const PAGE_SIZE = 6

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ icon: Icon, value }: { icon: React.ElementType; value: number }) {
  return (
    <span className="flex items-center gap-1 text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
      <Icon className="w-3 h-3" />
      {fmt(value)}
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.OTHER
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}28` }}
    >
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  )
}

function DifficultyBadge({ level }: { level: string }) {
  const cfg = DIFFICULTY_COLOR[level as keyof typeof DIFFICULTY_COLOR] ?? { color: '#9ca3af', label: level }
  return (
    <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
    >
      <div
        className="relative rounded-2xl p-5 transition-all duration-200 group"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.background = 'rgba(255,255,255,0.05)'
          el.style.borderColor = 'rgba(255,255,255,0.12)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.background = 'rgba(255,255,255,0.03)'
          el.style.borderColor = 'rgba(255,255,255,0.07)'
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <TypeBadge type={project.projectType} />
            <DifficultyBadge level={project.difficultyLevel} />
          </div>
          <span className="text-[11px] shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {timeAgo(project.createdAt)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/projects/${project.slug}`}>
          <h3
            className="text-sm font-semibold mb-1.5 leading-snug hover:text-white transition-colors"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {project.projectTitle}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {project.description}
        </p>

        {/* Links */}
        <div className="flex items-center gap-2 mb-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Github className="w-3 h-3" /> GitHub
            </a>
          )}
          {project.demoVideoUrl && (
            <a
              href={project.demoVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <ExternalLink className="w-3 h-3" /> Demo
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatPill icon={Eye} value={project.viewCount} />
            <StatPill icon={Download} value={project.downloadCount} />
            {project.avgRating > 0 && (
              <StatPill icon={Star} value={project.avgRating} />
            )}
          </div>
          <button
            type="button"
            onClick={() => setLiked(l => !l)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
            style={{
              background: liked ? 'rgba(244,63,94,0.12)' : 'transparent',
              color: liked ? '#f43f5e' : 'rgba(255,255,255,0.25)',
            }}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${liked ? 'scale-110 fill-current' : ''}`} />
            <span className="text-[10px]">{liked ? 'Liked' : 'Like'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 space-y-3 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="h-5 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
      </div>
      <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-3 w-5/6 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-6 w-14 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <AlertCircle className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.2)' }} />
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Failed to load projects</p>
      <button
        onClick={onRetry}
        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
        style={{ background: 'rgba(108,99,255,0.2)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)' }}
      >
        Try again
      </button>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<TabId>('recent')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const currentTab = TABS.find(t => t.id === activeTab)!

  const fetchProjects = useCallback(async (params: FetchParams, replace: boolean) => {
    try {
      const query: Record<string, string> = {
        page: String(params.page),
        size: String(params.size),
      }
      if (params.sort) query.sort = params.sort
      if (params.type) query.type = params.type
      if (params.search) query.search = params.search

      const qs = new URLSearchParams(query).toString()
      const res = await springApi.get<Project[]>(`/v4/projects?${qs}`)
      const data = res.data

      setProjects(prev => replace ? data : [...prev, ...data])
      setHasMore(data.length === params.size)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Initial + tab/filter change
  useEffect(() => {
    setLoading(true)
    setPage(0)
    setProjects([])
    fetchProjects({
      page: 0,
      size: PAGE_SIZE,
      sort: currentTab.sort,
      type: activeType ?? undefined,
      search: search || undefined,
    }, true)
  }, [activeTab, activeType, search, fetchProjects, currentTab.sort])

  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab) return
    setActiveTab(tab)
  }

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    setLoadingMore(true)
    fetchProjects({
      page: next,
      size: PAGE_SIZE,
      sort: currentTab.sort,
      type: activeType ?? undefined,
      search: search || undefined,
    }, false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Projects</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Discover what students are building
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/explore">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button size="sm" className="h-8 text-xs gap-1.5" style={{ background: '#6c63ff' }}>
                <Sparkles className="w-3.5 h-3.5" /> Share Project
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search projects..."
            className="flex-1 h-9 px-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'rgba(108,99,255,0.2)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)' }}
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput('') }}
              className="h-9 px-3 rounded-xl text-xs transition-all"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = id === activeTab
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.4)' }}
              >
                {active && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(108,99,255,0.25)', border: '1px solid rgba(108,99,255,0.3)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 items-start">

          {/* Feed */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <ErrorState onRetry={() => {
                setError(false)
                setLoading(true)
                fetchProjects({ page: 0, size: PAGE_SIZE, sort: currentTab.sort }, true)
              }} />
            ) : projects.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No projects found</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </AnimatePresence>
            )}

            {/* Load more */}
            {!loading && !error && hasMore && projects.length > 0 && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  {loadingMore && <Loader2 className="w-3 h-3 animate-spin" />}
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4 lg:sticky lg:top-20"
          >
            {/* Filter by type */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Filter by Type
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveType(null)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left"
                  style={{
                    background: activeType === null ? 'rgba(108,99,255,0.2)' : 'transparent',
                    color: activeType === null ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                    border: activeType === null ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                  }}
                >
                  <Sparkles className="w-3 h-3" /> All Types
                </button>
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveType(activeType === key ? null : key)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left"
                    style={{
                      background: activeType === key ? cfg.bg : 'transparent',
                      color: activeType === key ? cfg.color : 'rgba(255,255,255,0.4)',
                      border: activeType === key ? `1px solid ${cfg.color}30` : '1px solid transparent',
                    }}
                  >
                    <cfg.icon className="w-3 h-3" /> {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-xs font-semibold block mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Quick Links
              </span>
              {[
                { label: 'Explore all projects', href: '/explore' },
                { label: 'Submit your project', href: '/projects/new' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between py-2 text-xs transition-colors group"
                  style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="group-hover:text-white transition-colors">{label}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: '#6c63ff' }} />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}