'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import FilterPanel from '@/components/explore/FilterPanel'
import ProjectGrid from '@/components/explore/ProjectGrid'
import SearchBar from '@/components/explore/SearchBar'

export default function ExploreContent() {
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    techStack: [] as string[],
    difficulty: undefined as string | undefined,
    semester: undefined as string | undefined,
    sortBy: 'trending' as 'trending' | 'recent' | 'stars' | 'downloads',
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="sticky top-16 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <SearchBar onSearch={(query) => setFilters({ ...filters, search: query })} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        {showFilters && (
          <motion.div
            className="hidden lg:flex flex-col w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ProjectGrid filters={filters} />
        </motion.div>
      </div>
    </div>
  )
}
