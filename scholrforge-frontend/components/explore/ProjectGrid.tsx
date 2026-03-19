'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Download, ArrowUpRight, SearchX, Cpu, Loader2 } from 'lucide-react'
import { springApi } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  BEGINNER: { class: 'bg-secondary/10 text-secondary border-secondary/25', dot: 'bg-secondary', label: 'beginner' },
  INTERMEDIATE: { class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25', dot: 'bg-yellow-400', label: 'intermediate' },
  ADVANCED: { class: 'bg-destructive/10 text-destructive border-destructive/25', dot: 'bg-destructive', label: 'advanced' },
}

const cardAccents = [
  'from-primary/5 via-transparent',
  'from-secondary/5 via-transparent',
  'from-yellow-500/5 via-transparent',
  'from-destructive/5 via-transparent',
  'from-primary/5 via-transparent',
  'from-secondary/5 via-transparent',
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectGridProps {
  filters: {
    search: string
    techStack: string[]
    difficulty?: string
    semester?: string
    sortBy: 'trending' | 'recent' | 'stars' | 'downloads'
  }
}

const SORT_MAP: Record<string, string> = {
  trending: 'viewCount,desc',
  recent: 'createdAt,desc',
  stars: 'avgRating,desc',
  downloads: 'downloadCount,desc',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectGrid({ filters }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    const params: Record<string, string> = {
      page: '0',
      size: '20',
      sort: SORT_MAP[filters.sortBy] ?? 'createdAt,desc',
    }
    if (filters.search) params.search = filters.search
    if (filters.difficulty) params.difficulty = filters.difficulty.toUpperCase()

    const qs = new URLSearchParams(params).toString()

    springApi.get<Project[]>(`/v4/projects?${qs}`)
      .then(res => {
        if (!cancelled) {
          setProjects(res.data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [filters.search, filters.difficulty, filters.sortBy])

  // Client-side techStack filter (API may not support it)
  const displayed = filters.techStack.length > 0
    ? projects.filter(p =>
      filters.techStack.some(t =>
        p.projectType.toLowerCase().includes(t.toLowerCase())
      )
    )
    : projects

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-muted/40 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-xl border border-border/40 bg-card animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-32 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-foreground font-medium">Failed to load projects</p>
        <p className="text-muted-foreground text-sm mt-1">Check your connection and try again</p>
      </motion.div>
    )
  }

  // ── Empty ──
  if (displayed.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-32 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center">
            <SearchX className="w-6 h-6 text-muted-foreground/60" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl" />
        </div>
        <p className="text-foreground font-medium">No projects found</p>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs">
          Try adjusting your filters or search with different keywords
        </p>
      </motion.div>
    )
  }

  // ── Grid ──
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{displayed.length}</span>
          {' '}project{displayed.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {displayed.map((project, i) => {
          const diff = difficultyConfig[project.difficultyLevel] ?? difficultyConfig.BEGINNER
          const accent = cardAccents[i % cardAccents.length]

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
              className="group"
            >
              <Link href={`/projects/${project.slug}`} className="block h-full">
                <div className={`
                  relative h-full flex flex-col
                  rounded-xl overflow-hidden
                  border border-border/60
                  bg-card
                  hover:border-primary/40
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/8
                  hover:-translate-y-0.5
                `}>
                  {/* Top gradient accent */}
                  <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent} pointer-events-none`} />

                  {/* Content */}
                  <div className="relative flex flex-col gap-3 p-4 flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors flex-1 pr-1">
                        {project.projectTitle}
                      </h3>
                      <span className={`
                        shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border
                        ${diff.class}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                        {diff.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    {/* Type badge + status */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/40 border border-border/40 text-muted-foreground font-medium">
                        <Cpu className="w-2.5 h-2.5 opacity-60" />
                        {project.projectType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/40 border border-border/40 text-muted-foreground font-medium">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative px-4 py-2.5 border-t border-border/40 bg-muted/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground/80">
                          {project.avgRating > 0 ? project.avgRating.toFixed(1) : '—'}
                        </span>
                      </span>
                      <span className="w-px h-3 bg-border/60" />
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {project.downloadCount >= 1000
                          ? `${(project.downloadCount / 1000).toFixed(1)}k`
                          : project.downloadCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground/60 truncate max-w-[5rem]">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}