'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/useUIStore'
import {
  Search, TrendingUp, Code2, User, Tag,
  ArrowRight, X, Clock, Loader2,
} from 'lucide-react'
import { springApi } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string
  projectTitle: string
  description: string
  slug: string
  projectType: string
}

interface SearchResult {
  type: 'project' | 'user' | 'tag'
  id: string
  title: string
  subtitle?: string
  url: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TRENDING = ['AI / LLM', 'React', 'Full Stack', 'ML Pipeline', 'Web3']
const RECENT_KEY = 'sf_recent_searches'

const typeConfig = {
  project: { icon: <Code2 className="w-4 h-4" />, color: '#6c63ff', label: 'Project' },
  user: { icon: <User className="w-4 h-4" />, color: '#00d4aa', label: 'User' },
  tag: { icon: <Tag className="w-4 h-4" />, color: '#ffd700', label: 'Tag' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRecent(): SearchResult[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}

function saveRecent(item: SearchResult) {
  const existing = getRecent().filter(r => r.id !== item.id)
  localStorage.setItem(RECENT_KEY, JSON.stringify([item, ...existing].slice(0, 5)))
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchCommand() {
  const isOpen = useUIStore(s => s.isSearchOpen)
  const setOpen = useUIStore(s => s.setSearchOpen)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [recent, setRecent] = useState<SearchResult[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setActiveIdx(-1)
      setRecent(getRecent())
    }
  }, [isOpen])

  const handleAnimationComplete = useCallback(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await springApi.get<Project[]>(
          `/v4/projects?search=${encodeURIComponent(query.trim())}&size=8`
        )
        const mapped: SearchResult[] = res.data.map(p => ({
          type: 'project',
          id: p.id,
          title: p.projectTitle,
          subtitle: p.projectType,
          url: `/projects/${p.slug}`,
        }))
        setResults(mapped)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setActiveIdx(-1)
      }
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  // ── Global shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!isOpen)
      }
      if (e.key === 'Escape' && isOpen) setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, setOpen])

  const navigate = useCallback((item: SearchResult) => {
    saveRecent(item)
    setOpen(false)
    setQuery('')
    router.push(item.url)
  }, [setOpen, router])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      navigate(results[activeIdx])
    }
  }

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }, [])

  const grouped = (['project', 'user', 'tag'] as const)
    .map(type => ({ type, items: results.filter(r => r.type === type) }))
    .filter(g => g.items.length > 0)

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-start justify-center px-4 pt-[14vh]"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-xl rounded-2xl overflow-hidden"
            style={{
              background: '#0d0d14',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1)',
              zIndex: 10000,
            }}
            initial={{ scale: 0.96, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onAnimationComplete={handleAnimationComplete}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent */}
            <div
              className="h-px w-full shrink-0"
              style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.9), rgba(0,212,170,0.6), transparent)' }}
            />

            {/* Input row */}
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {loading
                ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: '#6c63ff' }} />
                : <Search className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
              }
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                style={{ caretColor: '#6c63ff' }}
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  type="button"
                  onMouseDown={handleClear}
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  className="shrink-0 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd
                className="hidden sm:flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Body */}
            <div className="max-h-[400px] overflow-y-auto overscroll-contain">

              {/* Empty query — show recent + trending */}
              {!query ? (
                <div className="p-4 space-y-5">
                  {recent.length > 0 && (
                    <div className="space-y-1">
                      <p
                        className="flex items-center gap-1.5 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        <Clock className="w-3 h-3" /> Recent
                      </p>
                      {recent.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={e => { e.preventDefault(); navigate(item) }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left group transition-colors"
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                          <span className="flex-1 transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {item.title}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: '#6c63ff' }} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p
                      className="flex items-center gap-1.5 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      <TrendingUp className="w-3 h-3" /> Trending
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {TRENDING.map(t => (
                        <button
                          key={t}
                          type="button"
                          onMouseDown={e => { e.preventDefault(); setQuery(t); inputRef.current?.focus() }}
                          className="text-xs px-2.5 py-1.5 rounded-full transition-all"
                          style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)'
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.background = 'rgba(108,99,255,0.08)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                            e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              ) : loading ? (
                <div className="flex items-center justify-center py-14">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>

              ) : results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-14 text-center px-4">
                  <Search className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.1)' }} />
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    No results for "<span style={{ color: 'rgba(255,255,255,0.6)' }}>{query}</span>"
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Try different keywords</p>
                </div>

              ) : (
                <div className="p-2 space-y-3">
                  {grouped.map(({ type, items }) => {
                    const cfg = typeConfig[type]
                    return (
                      <div key={type}>
                        <p
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: cfg.color }}
                        >
                          {cfg.icon} {cfg.label}s
                        </p>
                        {items.map(item => {
                          const idx = results.indexOf(item)
                          const active = idx === activeIdx
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseDown={e => { e.preventDefault(); navigate(item) }}
                              onMouseEnter={() => setActiveIdx(idx)}
                              onMouseLeave={() => setActiveIdx(-1)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                              style={{ background: active ? 'rgba(108,99,255,0.12)' : 'transparent' }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${cfg.color}18`, color: cfg.color }}
                              >
                                {cfg.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: '#fff' }}>
                                  {item.title}
                                </p>
                                {item.subtitle && (
                                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                              <ArrowRight
                                className="w-3.5 h-3.5 shrink-0 transition-opacity"
                                style={{ color: cfg.color, opacity: active ? 1 : 0 }}
                              />
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-4 px-4 py-2.5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[['↑↓', 'Navigate'], ['↵', 'Select'], ['ESC', 'Close']].map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                    style={{
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    {key}
                  </kbd>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}