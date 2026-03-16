'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import FilterPanel from '@/components/explore/FilterPanel'
import ProjectGrid from '@/components/explore/ProjectGrid'
import SearchBar from '@/components/explore/SearchBar'

export default function ExploreContent() {
  const [showFilters, setShowFilters] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    techStack: [] as string[],
    difficulty: undefined as string | undefined,
    semester: undefined as string | undefined,
    sortBy: 'trending' as 'trending' | 'recent' | 'stars' | 'downloads',
  })

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Search Bar */}
      <div >
       <div className="flex items-center gap-2 px-3 sm:px-4">
          <div className="flex-1">
            <SearchBar onSearch={(query) => setFilters({ ...filters, search: query })} />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium shrink-0"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Desktop filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium"
          >
            <SlidersHorizontal size={15} />
            {showFilters ? 'Hide' : 'Filters'}
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-card border-r border-border flex flex-col lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-foreground">Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterPanel filters={filters} onFiltersChange={setFilters} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 gap-0 lg:gap-6 p-3 sm:p-4 lg:p-6 overflow-hidden">
        {/* Sidebar - Desktop only */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -16, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 256 }}
              exit={{ opacity: 0, x: -16, width: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ProjectGrid filters={filters} />
        </motion.div>
      </div>
    </div>
  )
}