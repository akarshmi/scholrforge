'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Star, Download, Cpu, TrendingUp } from 'lucide-react'

interface TrendingProject {
  id: string
  title: string
  description: string
  tech: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  downloads: number
}

const PROJECTS: TrendingProject[] = [
  { id: '1', title: 'AI Chatbot Platform', description: 'Interactive ChatGPT Clone using OpenAI API and Next.js', tech: ['React', 'Node.js', 'TypeScript'], difficulty: 'intermediate', rating: 4.8, downloads: 1250 },
  { id: '2', title: 'E-commerce Dashboard', description: 'Full-stack e-commerce management system with real-time analytics', tech: ['React', 'Express', 'PostgreSQL'], difficulty: 'advanced', rating: 4.9, downloads: 2100 },
  { id: '3', title: 'Real-time Collaboration App', description: 'Live document editing with WebSocket and operational transformation', tech: ['React', 'Node.js', 'Socket.io'], difficulty: 'advanced', rating: 4.7, downloads: 890 },
]

const difficultyConfig = {
  beginner: { label: 'Beginner', bg: 'rgba(0,212,170,0.1)', text: '#00d4aa', border: 'rgba(0,212,170,0.25)', dot: '#00d4aa' },
  intermediate: { label: 'Intermediate', bg: 'rgba(234,179,8,0.1)', text: '#facc15', border: 'rgba(234,179,8,0.25)', dot: '#facc15' },
  advanced: { label: 'Advanced', bg: 'rgba(255,77,109,0.1)', text: '#ff4d6d', border: 'rgba(255,77,109,0.25)', dot: '#ff4d6d' },
}

// Per-card top accent colors matching brand palette
const accentColors = [
  { from: 'rgba(108,99,255,0.7)', to: 'transparent' },  // primary
  { from: 'rgba(0,212,170,0.7)', to: 'transparent' },  // secondary
  { from: 'rgba(255,77,109,0.7)', to: 'transparent' },  // destructive
]

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }

function ProjectCard({ project, i }: { project: TrendingProject; i: number }) {
  const diff = difficultyConfig[project.difficulty]
  const accent = accentColors[i % accentColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.08 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/projects/${project.id}`} className="block h-full">
        <div className="relative glass rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300">

          {/* Top accent line */}
          <div
            className="h-px w-full shrink-0"
            style={{ background: `linear-gradient(to right, ${accent.from}, ${accent.to})` }}
          />

          {/* Subtle top glow */}
          <div
            className="absolute inset-x-0 top-0 h-20 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${accent.from.replace('0.7', '0.05')}, transparent)` }}
          />

          <div className="relative flex flex-col gap-3 p-5 flex-1">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors flex-1">
                {project.title}
              </h3>
              <span
                className="shrink-0 flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border"
                style={{ background: diff.bg, color: diff.text, borderColor: diff.border }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: diff.dot }} />
                {diff.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {project.description}
            </p>

            {/* Tech */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/40 border border-border/40 text-muted-foreground font-medium">
                  <Cpu className="w-2.5 h-2.5 opacity-50" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-5 py-2.5 border-t border-border/40 bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground/80">{project.rating}</span>
              </span>
              <span className="w-px h-3 bg-border/60" />
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {fmt(project.downloads)}
              </span>
            </div>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function TrendingSection() {
  return (
    <section id="trending" className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#00d4aa' }}>
              <TrendingUp className="w-3.5 h-3.5" /> Trending now
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Hot this week</h2>
            <p className="text-sm text-muted-foreground">Most downloaded and starred projects right now</p>
          </div>
          <Link href="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 transition-all shrink-0">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} i={i} />)}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden text-center">
          <Link href="/explore"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
            View all projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}