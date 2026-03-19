'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Search, TrendingUp, Sparkles } from 'lucide-react'
import FilterPanel from '@/components/explore/FilterPanel'
import ProjectGrid from '@/components/explore/ProjectGrid'
import SearchBar from '@/components/explore/SearchBar'

type SortOption = 'trending' | 'recent' | 'stars' | 'downloads'

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'trending', label: 'Trending', icon: <TrendingUp className="w-3 h-3" /> },
  { value: 'recent', label: 'Recent', icon: <Sparkles className="w-3 h-3" /> },
  { value: 'stars', label: 'Top Rated', icon: <span className="text-[10px]">★</span> },
  { value: 'downloads', label: 'Popular', icon: <span className="text-[10px]">↓</span> },
]

export default function ExploreContent() {
  const [showFilters, setShowFilters] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    techStack: [] as string[],
    difficulty: undefined as string | undefined,
    semester: undefined as string | undefined,
    sortBy: 'trending' as SortOption,
  })

  const activeFilterCount =
    filters.techStack.length +
    (filters.difficulty ? 1 : 0) +
    (filters.semester ? 1 : 0)

  return (
    <div className="flex flex-col min-h-full bg-background">

      {/* ── Top bar ── */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">

        {/* Search row */}
        <div className="flex 1 items-center gap-2 px-3 sm:px-5 py-2.5">
            {/* <SearchBar onSearch={(q) => setFilters(f => ({ ...f, search: q }))} /> */}


          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="relative lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium shrink-0"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline text-xs">Filters</span>
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: '#6c63ff' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium relative"
          >
            <SlidersHorizontal size={14} />
            <span className="text-xs">{showFilters ? 'Hide' : 'Filters'}</span>
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: '#6c63ff' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

        {/* Sort pill row */}
        <div className="flex items-center gap-1.5 px-3 sm:px-5 pb-2.5 overflow-x-auto scrollbar-none">
          {SORT_OPTIONS.map(({ value, label, icon }) => {
            const active = filters.sortBy === value
            return (
              <button
                key={value}
                onClick={() => setFilters(f => ({ ...f, sortBy: value }))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all duration-200 active:scale-95"
                style={active
                  ? { background: 'rgba(108,99,255,0.15)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.35)' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {icon}
                {label}
              </button>
            )
          })}
        </div>


          {/* Active filter chips */}
          {filters.difficulty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0"
              style={{ background: 'rgba(255,77,109,0.12)', color: '#ff4d6d', border: '1px solid rgba(255,77,109,0.3)' }}>
              {filters.difficulty}
              <button onClick={() => setFilters(f => ({ ...f, difficulty: undefined }))}
                className="hover:opacity-70 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.semester && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0"
              style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)' }}>
              {filters.semester}
              <button onClick={() => setFilters(f => ({ ...f, semester: undefined }))}
                className="hover:opacity-70 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.techStack.map(t => (
            <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0"
              style={{ background: 'rgba(108,99,255,0.12)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.3)' }}>
              {t}
              <button
                onClick={() => setFilters(f => ({ ...f, techStack: f.techStack.filter(x => x !== t) }))}
                className="hover:opacity-70 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(f => ({ ...f, techStack: [], difficulty: undefined, semester: undefined }))}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0 px-1"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] flex flex-col lg:hidden"
              style={{ background: '#0f0f15', borderRight: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" style={{ color: '#6c63ff' }} />
                  <span className="text-sm font-semibold text-foreground">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: '#6c63ff' }}>
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilters(f => ({ ...f, techStack: [], difficulty: undefined, semester: undefined }))}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <FilterPanel filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* Apply button */}
              <div className="p-4 border-t border-border/40">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full h-10 rounded-xl text-sm font-semibold text-white active:scale-[0.98] transition-all"
                  style={{ background: '#6c63ff' }}>
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex flex-1 gap-0 lg:gap-5 p-3 sm:p-4 lg:p-6 overflow-hidden">

        {/* Desktop sidebar */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              className="hidden lg:flex flex-col flex-shrink-0"
              initial={{ opacity: 0, x: -12, width: 0, marginRight: 0 }}
              animate={{ opacity: 1, x: 0, width: 240, marginRight: 0 }}
              exit={{ opacity: 0, x: -12, width: 0, marginRight: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
        >
          <ProjectGrid filters={filters} />
        </motion.div>
      </div>
    </div>
  )
}