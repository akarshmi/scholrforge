'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TrendingProject {
  id: string
  title: string
  description: string
  tech: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  downloads: number
}

const trendingProjects: TrendingProject[] = [
  {
    id: '1',
    title: 'AI Chatbot Platform',
    description: 'Interactive ChatGPT Clone using OpenAI API and Next.js',
    tech: ['React', 'Node.js', 'TypeScript'],
    difficulty: 'intermediate',
    rating: 4.8,
    downloads: 1250,
  },
  {
    id: '2',
    title: 'E-commerce Dashboard',
    description: 'Full-stack e-commerce management system with real-time analytics',
    tech: ['React', 'Express', 'PostgreSQL'],
    difficulty: 'advanced',
    rating: 4.9,
    downloads: 2100,
  },
  {
    id: '3',
    title: 'Real-time Collaboration App',
    description: 'Live document editing with WebSocket and operational transformation',
    tech: ['React', 'Node.js', 'Socket.io'],
    difficulty: 'advanced',
    rating: 4.7,
    downloads: 890,
  },
]

function ProjectCard({ project }: { project: TrendingProject }) {
  const difficultyColor = {
    beginner: 'bg-secondary/20 text-secondary',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-destructive/20 text-destructive',
  }

  return (
    <motion.div
      className="glass p-6 rounded-xl flex flex-col gap-4 group hover:border-primary/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>
          <Badge className={difficultyColor[project.difficulty]} variant="secondary">
            {project.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{project.rating}</span>
        </div>
        <span>{project.downloads.toLocaleString()} downloads</span>
      </div>
    </motion.div>
  )
}

export default function TrendingSection() {
  return (
    <section id="trending" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Trending Projects</h2>
            <p className="text-lg text-muted-foreground">
              Check out the most popular academic projects
            </p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
