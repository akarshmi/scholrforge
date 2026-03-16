'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { TECH_STACKS, DIFFICULTY_LEVELS, SEMESTERS } from '@/lib/constants'

interface FilterPanelProps {
  filters: {
    search: string
    techStack: string[]
    difficulty?: string
    semester?: string
    sortBy: 'trending' | 'recent' | 'stars' | 'downloads'
  }
  onFiltersChange: (filters: any) => void
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
    {children}
  </p>
)

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleTechToggle = (tech: string) => {
    const updated = filters.techStack.includes(tech)
      ? filters.techStack.filter((t) => t !== tech)
      : [...filters.techStack, tech]
    onFiltersChange({ ...filters, techStack: updated })
  }

  const allTechs = [
    ...TECH_STACKS.LANGUAGES,
    ...TECH_STACKS.FRAMEWORKS,
    ...TECH_STACKS.DATABASES,
  ]

  const hasActiveFilters = filters.techStack.length > 0 || filters.difficulty || filters.semester

  return (
    <motion.aside
      className="glass rounded-xl p-4 sticky top-[4.5rem] max-h-[calc(100vh-6rem)] overflow-y-auto space-y-5 scrollbar-thin"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={() => onFiltersChange({ ...filters, techStack: [], difficulty: undefined, semester: undefined })}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <SectionLabel>Sort By</SectionLabel>
        <Select value={filters.sortBy} onValueChange={(v) => onFiltersChange({ ...filters, sortBy: v })}>
          <SelectTrigger className="h-9 text-sm bg-muted/30 border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">🔥 Trending</SelectItem>
            <SelectItem value="recent">🕒 Recent</SelectItem>
            <SelectItem value="stars">⭐ Most Stars</SelectItem>
            <SelectItem value="downloads">⬇️ Most Downloads</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div>
        <SectionLabel>Difficulty</SectionLabel>
        <Select
          value={filters.difficulty ?? 'all'}
          onValueChange={(v) => onFiltersChange({ ...filters, difficulty: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="h-9 text-sm bg-muted/30 border-border/60">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {DIFFICULTY_LEVELS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Semester */}
      <div>
        <SectionLabel>Semester</SectionLabel>
        <Select
          value={filters.semester ?? 'all'}
          onValueChange={(v) => onFiltersChange({ ...filters, semester: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="h-9 text-sm bg-muted/30 border-border/60">
            <SelectValue placeholder="All semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {SEMESTERS.map((sem) => (
              <SelectItem key={sem} value={sem}>{sem}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tech Stack */}
      <div>
        <SectionLabel>Technologies</SectionLabel>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {allTechs.map((tech) => (
            <label
              key={tech.name}
              className="flex items-center gap-2.5 py-1 px-2 rounded-md hover:bg-muted/40 cursor-pointer group transition-colors"
            >
              <Checkbox
                checked={filters.techStack.includes(tech.name)}
                onCheckedChange={() => handleTechToggle(tech.name)}
                className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {tech.name}
              </span>
              {filters.techStack.includes(tech.name) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </label>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}