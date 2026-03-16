'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Download, ArrowUpRight, SearchX, Cpu } from 'lucide-react'

const MOCK_PROJECTS = [
  { id: '1', title: 'AI Chatbot Platform', description: 'Interactive ChatGPT Clone using OpenAI API and Next.js', difficulty: 'intermediate', rating: 4.8, downloads: 1250, tech: ['React', 'Node.js', 'OpenAI'], author: 'john_dev', semester: 'Fall 2024' },
  { id: '2', title: 'E-commerce Dashboard', description: 'Full-stack e-commerce management system with analytics', difficulty: 'advanced', rating: 4.9, downloads: 2100, tech: ['React', 'Express', 'PostgreSQL'], author: 'jane_dev', semester: 'Spring 2025' },
  { id: '3', title: 'Real-time Collaboration App', description: 'Live document editing with WebSocket and OT', difficulty: 'advanced', rating: 4.7, downloads: 890, tech: ['React', 'Node.js', 'Socket.io'], author: 'mike_dev', semester: 'Fall 2024' },
  { id: '4', title: 'Machine Learning Pipeline', description: 'End-to-end ML pipeline with data processing', difficulty: 'advanced', rating: 4.6, downloads: 1500, tech: ['Python', 'TensorFlow', 'Pandas'], author: 'alex_dev', semester: 'Spring 2025' },
  { id: '5', title: 'Mobile App - Task Manager', description: 'Cross-platform task management app', difficulty: 'beginner', rating: 4.4, downloads: 890, tech: ['React Native', 'Firebase'], author: 'sarah_dev', semester: 'Summer 2025' },
  { id: '6', title: 'Blockchain Voting System', description: 'Decentralized voting system built on Ethereum', difficulty: 'advanced', rating: 4.9, downloads: 2300, tech: ['Solidity', 'React', 'Web3'], author: 'crypto_dev', semester: 'Fall 2024' },
]

const difficultyConfig = {
  beginner: { class: 'bg-secondary/10 text-secondary border-secondary/25', dot: 'bg-secondary' },
  intermediate: { class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25', dot: 'bg-yellow-400' },
  advanced: { class: 'bg-destructive/10 text-destructive border-destructive/25', dot: 'bg-destructive' },
}

// Deterministic gradient per id
const cardAccents = [
  'from-primary/5 via-transparent',
  'from-secondary/5 via-transparent',
  'from-yellow-500/5 via-transparent',
  'from-destructive/5 via-transparent',
  'from-primary/5 via-transparent',
  'from-secondary/5 via-transparent',
]

interface ProjectGridProps {
  filters: {
    search: string
    techStack: string[]
    difficulty?: string
    semester?: string
    sortBy: 'trending' | 'recent' | 'stars' | 'downloads'
  }
}

export default function ProjectGrid({ filters }: ProjectGridProps) {
  let projects = MOCK_PROJECTS.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.tech.some(t => t.toLowerCase().includes(q))) return false
    }
    if (filters.techStack.length > 0 && !p.tech.some(t => filters.techStack.includes(t))) return false
    if (filters.difficulty && p.difficulty !== filters.difficulty) return false
    if (filters.semester && p.semester !== filters.semester) return false
    return true
  })

  projects.sort((a, b) => {
    if (filters.sortBy === 'stars') return b.rating - a.rating
    if (filters.sortBy === 'downloads') return b.downloads - a.downloads
    return (b.downloads + b.rating * 100) - (a.downloads + a.rating * 100)
  })

  if (projects.length === 0) {
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
        <p className="text-muted-foreground text-sm mt-1 max-w-xs">Try adjusting your filters or search with different keywords</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{projects.length}</span>
          {' '}project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {projects.map((project, i) => {
          const diff = difficultyConfig[project.difficulty as keyof typeof difficultyConfig]
          const accent = cardAccents[i % cardAccents.length]

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
              className="group"
            >
              <Link href={`/projects/${project.id}`} className="block h-full">
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
                        {project.title}
                      </h3>
                      <span className={`
                        shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border
                        ${diff.class}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                        {project.difficulty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/40 border border-border/40 text-muted-foreground font-medium"
                        >
                          <Cpu className="w-2.5 h-2.5 opacity-60" />
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted/40 border border-border/40 text-muted-foreground">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative px-4 py-2.5 border-t border-border/40 bg-muted/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground/80">{project.rating}</span>
                      </span>
                      <span className="w-px h-3 bg-border/60" />
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {project.downloads >= 1000 ? `${(project.downloads / 1000).toFixed(1)}k` : project.downloads}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground/60 truncate max-w-[5rem]">
                        {project.author}
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