'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data - replace with real API call
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'AI Chatbot Platform',
    description: 'Interactive ChatGPT Clone using OpenAI API and Next.js',
    difficulty: 'intermediate',
    rating: 4.8,
    downloads: 1250,
    tech: ['React', 'Node.js', 'OpenAI'],
    author: 'john_dev',
    semester: 'Fall 2024',
  },
  {
    id: '2',
    title: 'E-commerce Dashboard',
    description: 'Full-stack e-commerce management system with analytics',
    difficulty: 'advanced',
    rating: 4.9,
    downloads: 2100,
    tech: ['React', 'Express', 'PostgreSQL'],
    author: 'jane_dev',
    semester: 'Spring 2025',
  },
  {
    id: '3',
    title: 'Real-time Collaboration App',
    description: 'Live document editing with WebSocket and OT',
    difficulty: 'advanced',
    rating: 4.7,
    downloads: 890,
    tech: ['React', 'Node.js', 'Socket.io'],
    author: 'mike_dev',
    semester: 'Fall 2024',
  },
  {
    id: '4',
    title: 'Machine Learning Pipeline',
    description: 'End-to-end ML pipeline with data processing',
    difficulty: 'advanced',
    rating: 4.6,
    downloads: 1500,
    tech: ['Python', 'TensorFlow', 'Pandas'],
    author: 'alex_dev',
    semester: 'Spring 2025',
  },
  {
    id: '5',
    title: 'Mobile App - Task Manager',
    description: 'Cross-platform task management app',
    difficulty: 'beginner',
    rating: 4.4,
    downloads: 890,
    tech: ['React Native', 'Firebase'],
    author: 'sarah_dev',
    semester: 'Summer 2025',
  },
  {
    id: '6',
    title: 'Blockchain Voting System',
    description: 'Decentralized voting system built on Ethereum',
    difficulty: 'advanced',
    rating: 4.9,
    downloads: 2300,
    tech: ['Solidity', 'React', 'Web3'],
    author: 'crypto_dev',
    semester: 'Fall 2024',
  },
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

const difficultyColor = {
  beginner: 'bg-secondary/20 text-secondary',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-destructive/20 text-destructive',
}

export default function ProjectGrid({ filters }: ProjectGridProps) {
  // Filter projects
  let filteredProjects = MOCK_PROJECTS.filter((project) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !project.title.toLowerCase().includes(searchLower) &&
        !project.description.toLowerCase().includes(searchLower) &&
        !project.tech.some((t) => t.toLowerCase().includes(searchLower))
      ) {
        return false
      }
    }

    // Tech stack filter
    if (filters.techStack.length > 0) {
      if (!project.tech.some((t) => filters.techStack.includes(t))) {
        return false
      }
    }

    // Difficulty filter
    if (filters.difficulty && project.difficulty !== filters.difficulty) {
      return false
    }

    // Semester filter
    if (filters.semester && project.semester !== filters.semester) {
      return false
    }

    return true
  })

  // Sort projects
  filteredProjects.sort((a, b) => {
    switch (filters.sortBy) {
      case 'stars':
        return b.rating - a.rating
      case 'downloads':
        return b.downloads - a.downloads
      case 'recent':
        return Math.random() - 0.5 // Mock: should sort by date
      case 'trending':
      default:
        return b.downloads + b.rating - (a.downloads + a.rating)
    }
  })

  return (
    <div className="space-y-4">
      {filteredProjects.length === 0 ? (
        <motion.div
          className="glass rounded-xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-muted-foreground text-lg">No projects found matching your filters.</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your search criteria.</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              className="glass rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/projects/${project.id}`}>
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <Badge className={difficultyColor[project.difficulty as keyof typeof difficultyColor]} variant="secondary">
                      {project.difficulty}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tech.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{project.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{(project.downloads / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">by {project.author}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
