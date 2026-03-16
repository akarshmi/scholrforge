'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleTechStackToggle = (tech: string) => {
    const newStack = filters.techStack.includes(tech)
      ? filters.techStack.filter((t) => t !== tech)
      : [...filters.techStack, tech]
    onFiltersChange({ ...filters, techStack: newStack })
  }

  const allTechs = [
    ...TECH_STACKS.LANGUAGES,
    ...TECH_STACKS.FRAMEWORKS,
    ...TECH_STACKS.DATABASES,
  ]

  return (
    <motion.div
      className="glass p-6 rounded-xl h-fit sticky top-24 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sort By */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Sort By</h3>
        <Select value={filters.sortBy} onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="stars">Most Stars</SelectItem>
            <SelectItem value="downloads">Most Downloads</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Difficulty</h3>
        <Select value={filters.difficulty || ''} onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value || undefined })}>
          <SelectTrigger>
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {DIFFICULTY_LEVELS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Semester */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Semester</h3>
        <Select value={filters.semester || ''} onValueChange={(value) => onFiltersChange({ ...filters, semester: value || undefined })}>
          <SelectTrigger>
            <SelectValue placeholder="All semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Semesters</SelectItem>
            {SEMESTERS.map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tech Stack */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Technologies</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allTechs.map((tech) => (
            <div key={tech.name} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.techStack.includes(tech.name)}
                onCheckedChange={() => handleTechStackToggle(tech.name)}
              />
              <label className="text-sm cursor-pointer font-medium">{tech.name}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.techStack.length > 0 || filters.difficulty || filters.semester) && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onFiltersChange({
            ...filters,
            techStack: [],
            difficulty: undefined,
            semester: undefined,
          })}
        >
          Clear Filters
        </Button>
      )}
    </motion.div>
  )
}
