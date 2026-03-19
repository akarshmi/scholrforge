'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Star, Download, Github, ExternalLink, Bookmark, Share2,
  Eye, Calendar, ArrowLeft, ChevronRight,
  Code2, Layers, Tag, Trophy, Zap, CheckCircle2,
  Terminal, Globe, Package, Loader2, AlertCircle,
  Play,
} from 'lucide-react'
import { springApi } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TechStack {
  id: string
  name: string
  iconUrl?: string | null
  category?: string | null
}

interface ProjectTag {
  id: string
  name: string
}

interface Project {
  id: string
  userId: string
  author?: {
    id: string
    username: string
    name: string
    avatarUrl?: string | null
  }
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
  techStack: TechStack[]
  tags: ProjectTag[]
  media: unknown[]
  createdAt: string
  updatedAt: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const difficultyConfig = {
  BEGINNER: { label: 'Beginner', class: 'bg-secondary/10 text-secondary border-secondary/30', dot: 'bg-secondary' },
  INTERMEDIATE: { label: 'Intermediate', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  ADVANCED: { label: 'Advanced', class: 'bg-destructive/10 text-destructive border-destructive/30', dot: 'bg-destructive' },
}

type Tab = 'overview' | 'tech' | 'reviews' | 'details'

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 30) return `${d} days ago`
  return new Date(iso).toLocaleDateString()
}

// ─── Loading / Error ──────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
        <div>
          <p className="font-medium text-foreground">Project not found</p>
          <p className="text-sm text-muted-foreground mt-1">This project may have been removed or the link is incorrect.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onRetry} className="px-4 py-2 rounded-lg text-sm border border-border/60 hover:border-primary/40 transition-colors">
            Try again
          </button>
          <Link href="/explore" className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailContent({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')

  const fetchProject = () => {
    setLoading(true)
    setError(false)
    springApi.get<Project>(`/v4/projects/slug/${slug}`)
      .then(res => { setProject(res.data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { fetchProject() }, [slug])

  if (loading) return <LoadingState />
  if (error || !project) return <ErrorState onRetry={fetchProject} />

  const diff = difficultyConfig[project.difficultyLevel] ?? difficultyConfig.BEGINNER

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'details', label: 'Details' },
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/explore" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Explore
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-foreground truncate max-w-[200px]">{project.projectTitle}</span>
      </div>

      {/* Hero */}
      <div className="relative border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-secondary/6 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 items-center justify-center shrink-0">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border font-medium ${diff.class}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                    {diff.label}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/50 border border-border/50 text-muted-foreground">
                    {project.projectType}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/50 border border-border/50 text-muted-foreground">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {project.projectTitle}
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-lg border transition-all duration-200 ${bookmarked
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'border-border/60 bg-card text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary' : ''}`} />
              </button>
              <button className="p-2 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
            {[
              { icon: <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />, label: project.avgRating > 0 ? `${project.avgRating.toFixed(1)} rating` : 'No ratings yet' },
              { icon: <Download className="w-3.5 h-3.5 text-muted-foreground" />, label: `${fmt(project.downloadCount)} downloads` },
              { icon: <Eye className="w-3.5 h-3.5 text-muted-foreground" />, label: `${fmt(project.viewCount)} views` },
              { icon: <Calendar className="w-3.5 h-3.5 text-muted-foreground" />, label: timeAgo(project.createdAt) },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {icon} {label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2">
            {project.downloadUrl && (
              <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all">
                <Download className="w-4 h-4" /> Download
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/70 bg-card text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
            {project.demoVideoUrl && (
              <a href={project.demoVideoUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/70 bg-card text-sm font-medium hover:border-secondary/40 hover:bg-secondary/5 transition-all">
                <Play className="w-4 h-4" /> Demo Video
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Left: tabs */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex gap-1 p-1 bg-muted/20 border border-border/40 rounded-xl w-fit">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id
                      ? 'bg-background border border-border text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>

              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="glass rounded-xl divide-y divide-border/40">
                  <div className="px-5 py-4 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                    <h3 className="text-sm font-semibold text-foreground">Description</h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>
                  {project.tags.length > 0 && (
                    <>
                      <div className="px-5 py-4 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                        <h3 className="text-sm font-semibold text-foreground">Tags</h3>
                      </div>
                      <div className="px-5 py-4 flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-primary/8 border border-primary/20 text-primary/80 font-medium">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TECH */}
              {tab === 'tech' && (
                <div className="space-y-4">
                  <div className="glass rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> Technologies
                    </h3>
                    {project.techStack.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {project.techStack.map(tech => (
                          <div key={tech.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all">
                            <Terminal className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-foreground/90 block truncate">{tech.name}</span>
                              {tech.category && (
                                <span className="text-[10px] text-muted-foreground">{tech.category}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tech stack added yet.</p>
                    )}
                  </div>

                  {project.tags.length > 0 && (
                    <div className="glass rounded-xl p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" /> Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-primary/8 border border-primary/20 text-primary/80 font-medium">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS */}
              {tab === 'reviews' && (
                <div className="glass rounded-xl p-8 flex flex-col items-center text-center gap-3 min-h-48">
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-5 h-5 ${s <= Math.round(project.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {project.avgRating > 0 ? project.avgRating.toFixed(1) : '—'}
                    <span className="text-base font-normal text-muted-foreground">/5</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Community reviews coming soon</p>
                </div>
              )}

              {/* DETAILS */}
              {tab === 'details' && (
                <div className="glass rounded-xl divide-y divide-border/40">
                  {[
                    { icon: <Package className="w-4 h-4" />, label: 'Project Type', value: project.projectType },
                    { icon: <Zap className="w-4 h-4" />, label: 'Difficulty', value: diff.label },
                    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Status', value: project.status.replace('_', ' ') },
                    { icon: <Eye className="w-4 h-4" />, label: 'Views', value: project.viewCount.toLocaleString() },
                    { icon: <Download className="w-4 h-4" />, label: 'Downloads', value: project.downloadCount.toLocaleString() },
                    { icon: <Calendar className="w-4 h-4" />, label: 'Created', value: new Date(project.createdAt).toLocaleDateString() },
                    { icon: <Calendar className="w-4 h-4" />, label: 'Updated', value: new Date(project.updatedAt).toLocaleDateString() },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-muted-foreground/60">{icon}</span>
                        {label}
                      </div>
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right: sidebar */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            {/* Author placeholder — wire up when GET /v4/users/:userId is ready */}
            <div className="glass rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Created by</h3>
              <div className="flex items-center gap-3">
                {project.author?.avatarUrl ? (
                  <img
                    src={project.author.avatarUrl}
                    alt={project.author.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {project.author?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {project.author?.name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{project.author?.username ?? '—'}
                  </p>
                </div>
              </div>
              {project.author?.username && (
                <Link
                  href={`/u/${project.author.username}`}
                  className="w-full py-2 rounded-lg border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center"
                >
                  View Profile
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Rating', value: project.avgRating > 0 ? project.avgRating.toFixed(1) : '—' },
                  { label: 'Downloads', value: fmt(project.downloadCount) },
                  { label: 'Views', value: fmt(project.viewCount) },
                  { label: 'Updated', value: timeAgo(project.updatedAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-muted/30 border border-border/30 p-3 text-center">
                    <p className="text-base font-bold text-foreground">{value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="glass rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Links</h3>
              {[
                { icon: <Github className="w-4 h-4" />, label: 'Source Code', href: project.githubUrl },
                { icon: <Globe className="w-4 h-4" />, label: 'Demo Video', href: project.demoVideoUrl },
                { icon: <Download className="w-4 h-4" />, label: 'Download', href: project.downloadUrl },
              ].filter(l => l.href).map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all">
                  {icon} {label}
                  <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                </a>
              ))}
            </div>

            {/* Tech stack mini */}
            {project.techStack.length > 0 && (
              <div className="glass rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map(tech => (
                    <span key={tech.id} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-muted/40 border border-border/40 text-muted-foreground font-medium">
                      <Terminal className="w-2.5 h-2.5 opacity-60" />
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}