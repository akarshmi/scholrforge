'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Star, Download, Github, ExternalLink, Bookmark, Share2,
  Eye, Users, Scale, Calendar, ArrowLeft, ChevronRight,
  Code2, Layers, Tag, Trophy, Zap, Play, CheckCircle2,
  Terminal, Globe, Package
} from 'lucide-react'
import ProjectCard from './ProjectCard'

const MOCK_PROJECT = {
  id: '1',
  title: 'AI Chatbot Platform',
  description: 'Interactive ChatGPT Clone using OpenAI API and Next.js with real-time streaming, auth, and chat history.',
  content: `A modern, full-featured chatbot application that leverages the OpenAI API to provide conversational AI capabilities. Built as a production-ready final year project template with authentication, rate limiting, and a polished UI.

## Features

- Real-time chat with GPT-4 streaming responses
- Chat history persistence with PostgreSQL
- User authentication with NextAuth.js
- Rate limiting and usage tracking per user
- Dark mode support with system preference detection
- Fully mobile responsive layout

## Getting Started

1. Clone the repository
2. Install dependencies: npm install
3. Set up environment variables (.env.local)
4. Run development server: npm run dev
5. Open http://localhost:3000

## API Integration

The project uses the OpenAI API for chat completions with streaming support. Configure your API key in environment variables before running.`,
  difficulty: 'intermediate',
  rating: 4.8,
  downloads: 1250,
  tech: ['React', 'Next.js', 'Node.js', 'OpenAI', 'PostgreSQL', 'TypeScript'],
  author: { username: 'john_dev', displayName: 'John Smith', initials: 'JS', bio: 'CS Student · 8 projects' },
  semester: 'Fall 2024',
  tags: ['AI', 'LLM', 'Chatbot', 'Full-Stack'],
  repositoryUrl: 'https://github.com/example/chatbot',
  demoUrl: 'https://demo.example.com',
  contributors: 3,
  views: 5200,
  license: 'MIT',
}

const MOCK_RELATED = [
  { id: '2', title: 'LLM Fine-tuning Pipeline', description: 'Fine-tune large language models for custom tasks', difficulty: 'advanced' as const, rating: 4.7, downloads: 890, tech: ['Python', 'Hugging Face'], author: 'ml_dev' },
  { id: '3', title: 'RAG System', description: 'Retrieval-augmented generation with vector embeddings', difficulty: 'advanced' as const, rating: 4.9, downloads: 1500, tech: ['Python', 'LangChain'], author: 'ai_researcher' },
  { id: '4', title: 'Chat UI Components', description: 'Reusable React components for chat interfaces', difficulty: 'beginner' as const, rating: 4.5, downloads: 2100, tech: ['React', 'TypeScript'], author: 'ui_dev' },
]

const difficultyConfig = {
  beginner: { label: 'Beginner', class: 'bg-secondary/10 text-secondary border-secondary/30', dot: 'bg-secondary' },
  intermediate: { label: 'Intermediate', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  advanced: { label: 'Advanced', class: 'bg-destructive/10 text-destructive border-destructive/30', dot: 'bg-destructive' },
}

type Tab = 'overview' | 'tech' | 'reviews' | 'details'

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function ProjectDetailContent({ projectId }: { projectId: string }) {
  const p = MOCK_PROJECT
  const [bookmarked, setBookmarked] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const diff = difficultyConfig[p.difficulty as keyof typeof difficultyConfig]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'details', label: 'Details' },
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* ── Breadcrumb ── */}
      <div >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Explore
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-foreground truncate max-w-[200px]">{p.title}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative border-b border-border/40 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-secondary/6 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 items-center justify-center shrink-0">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border font-medium ${diff.class}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                    {diff.label}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/50 border border-border/50 text-muted-foreground">
                    {p.semester}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {p.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>

            {/* Icon actions */}
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

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
            {[
              { icon: <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />, label: `${p.rating} rating` },
              { icon: <Download className="w-3.5 h-3.5 text-muted-foreground" />, label: `${fmt(p.downloads)} downloads` },
              { icon: <Eye className="w-3.5 h-3.5 text-muted-foreground" />, label: `${fmt(p.views)} views` },
              { icon: <Users className="w-3.5 h-3.5 text-muted-foreground" />, label: `${p.contributors} contributors` },
              { icon: <Scale className="w-3.5 h-3.5 text-muted-foreground" />, label: p.license },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {icon} {label}
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all">
              <Download className="w-4 h-4" /> Download
            </button>
            {p.repositoryUrl && (
              <a href={p.repositoryUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/70 bg-card text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/70 bg-card text-sm font-medium hover:border-secondary/40 hover:bg-secondary/5 transition-all">
                <Globe className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* ── Left: tabs ── */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-muted/20 border border-border/40 rounded-xl w-fit">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id
                      ? 'bg-background border border-border text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="glass rounded-xl divide-y divide-border/40">
                  {p.content.split('\n\n').map((block, i) => {
                    if (block.startsWith('## ')) {
                      return (
                        <div key={i} className="px-5 py-3 flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                          <h3 className="text-sm font-semibold text-foreground">{block.replace('## ', '')}</h3>
                        </div>
                      )
                    }
                    if (block.trim().startsWith('1.') || block.trim().startsWith('-')) {
                      const lines = block.split('\n').filter(Boolean)
                      return (
                        <div key={i} className="px-5 py-3 space-y-1.5">
                          {lines.map((line, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
                              <span>{line.replace(/^[\d\.\-\*]\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return (
                      <div key={i} className="px-5 py-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">{block}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TECH */}
              {tab === 'tech' && (
                <div className="space-y-4">
                  <div className="glass rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> Technologies
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {p.tech.map((t) => (
                        <div key={t} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all">
                          <Terminal className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                          <span className="text-sm font-medium text-foreground/90">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/8 border border-primary/20 text-primary/80 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              {tab === 'reviews' && (
                <div className="glass rounded-xl p-8 flex flex-col items-center text-center gap-3 min-h-48">
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-5 h-5 ${s <= Math.round(p.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-3xl font-bold text-foreground">{p.rating}<span className="text-base font-normal text-muted-foreground">/5</span></p>
                  <p className="text-sm text-muted-foreground">Community reviews coming soon</p>
                </div>
              )}

              {/* DETAILS */}
              {tab === 'details' && (
                <div className="glass rounded-xl divide-y divide-border/40">
                  {[
                    { icon: <Scale className="w-4 h-4" />, label: 'License', value: p.license },
                    { icon: <Users className="w-4 h-4" />, label: 'Contributors', value: String(p.contributors) },
                    { icon: <Eye className="w-4 h-4" />, label: 'Views', value: p.views.toLocaleString() },
                    { icon: <Download className="w-4 h-4" />, label: 'Downloads', value: p.downloads.toLocaleString() },
                    { icon: <Calendar className="w-4 h-4" />, label: 'Semester', value: p.semester },
                    { icon: <Package className="w-4 h-4" />, label: 'Project Type', value: 'Web Application' },
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

          {/* ── Right: sidebar ── */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            {/* Author */}
            <div className="glass rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Created by</h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {p.author.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{p.author.displayName}</p>
                  <p className="text-xs text-muted-foreground">{p.author.bio}</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                View Profile
              </button>
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Rating', value: String(p.rating) },
                  { label: 'Reviews', value: '124' },
                  { label: 'Downloads', value: fmt(p.downloads) },
                  { label: 'Views', value: fmt(p.views) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-muted/30 border border-border/30 p-3 text-center">
                    <p className="text-base font-bold text-foreground">{value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="glass rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Links</h3>
              {[
                { icon: <Github className="w-4 h-4" />, label: 'Source Code', href: p.repositoryUrl },
                { icon: <Globe className="w-4 h-4" />, label: 'Live Demo', href: p.demoUrl },
              ].filter(l => l.href).map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all">
                  {icon} {label}
                  <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Related ── */}
      <div className="border-t border-border/40 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Related Projects</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Similar projects you might find useful</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_RELATED.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ProjectCard {...project} variant="grid" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}