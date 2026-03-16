'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Star, 
  Download, 
  Github, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  Heart
} from 'lucide-react'
import ProjectCard from './ProjectCard'

// Mock project data - replace with API call
const MOCK_PROJECT = {
  id: '1',
  title: 'AI Chatbot Platform',
  description: 'Interactive ChatGPT Clone using OpenAI API and Next.js',
  content: `# AI Chatbot Platform

A modern, full-featured chatbot application that leverages the OpenAI API to provide conversational AI capabilities.

## Features

- Real-time chat with GPT-4 integration
- Chat history persistence
- User authentication
- Rate limiting and usage tracking
- Dark mode support
- Mobile responsive design

## Technology Stack

- Frontend: React 19 + Next.js 16
- Backend: Node.js with Express
- Database: PostgreSQL
- API: OpenAI GPT-4
- Hosting: Vercel + Railway

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set up environment variables
4. Run development server: \`npm run dev\`
5. Open http://localhost:3000

## API Integration

The project uses the OpenAI API for chat completions. Make sure to set your API key in environment variables.`,
  difficulty: 'intermediate',
  rating: 4.8,
  downloads: 1250,
  tech: ['React', 'Node.js', 'OpenAI', 'PostgreSQL', 'TypeScript'],
  author: 'john_dev',
  semester: 'Fall 2024',
  tags: ['AI', 'LLM', 'Chatbot', 'Full-Stack'],
  repositoryUrl: 'https://github.com/example/chatbot',
  contributors: 3,
  views: 5200,
  license: 'MIT',
}

// Mock related projects
const MOCK_RELATED_PROJECTS = [
  {
    id: '2',
    title: 'LLM Fine-tuning Pipeline',
    description: 'Fine-tune large language models for custom tasks',
    difficulty: 'advanced' as const,
    rating: 4.7,
    downloads: 890,
    tech: ['Python', 'Hugging Face', 'Transformers'],
    author: 'ml_dev',
  },
  {
    id: '3',
    title: 'RAG System',
    description: 'Retrieval-augmented generation with vector embeddings',
    difficulty: 'advanced' as const,
    rating: 4.9,
    downloads: 1500,
    tech: ['Python', 'Vector DB', 'LangChain'],
    author: 'ai_researcher',
  },
  {
    id: '4',
    title: 'Chat UI Components',
    description: 'Reusable React components for chat interfaces',
    difficulty: 'beginner' as const,
    rating: 4.5,
    downloads: 2100,
    tech: ['React', 'Tailwind', 'TypeScript'],
    author: 'ui_dev',
  },
]

interface ProjectDetailContentProps {
  projectId: string
}

export default function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.div
        className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="space-y-4">
            {/* Title & Difficulty */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                  {MOCK_PROJECT.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {MOCK_PROJECT.description}
                </p>
              </div>
              <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                {MOCK_PROJECT.difficulty}
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{MOCK_PROJECT.rating}</span>
                <span className="text-muted-foreground">({MOCK_PROJECT.views.toLocaleString()} views)</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span className="font-semibold">{MOCK_PROJECT.downloads.toLocaleString()}</span>
                <span className="text-muted-foreground">downloads</span>
              </div>
              <div className="text-muted-foreground">
                By <span className="font-semibold text-foreground">{MOCK_PROJECT.author}</span>
              </div>
              <div className="text-muted-foreground">
                {MOCK_PROJECT.semester}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Download Project
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 fill-primary" />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Bookmark
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              {MOCK_PROJECT.repositoryUrl && (
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <a href={MOCK_PROJECT.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {MOCK_PROJECT.content}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tech" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_PROJECT.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-base px-3 py-2">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_PROJECT.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6 mt-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Reviews Coming Soon</h3>
                  <p className="text-muted-foreground">
                    User reviews will be displayed here. Build your reputation by receiving positive feedback from the community.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">License</p>
                    <p className="font-semibold">{MOCK_PROJECT.license}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">Contributors</p>
                    <p className="font-semibold">{MOCK_PROJECT.contributors}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">Views</p>
                    <p className="font-semibold">{MOCK_PROJECT.views.toLocaleString()}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">Semester</p>
                    <p className="font-semibold">{MOCK_PROJECT.semester}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Right Column - Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Author Card */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">Created By</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {MOCK_PROJECT.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{MOCK_PROJECT.author}</p>
                  <p className="text-xs text-muted-foreground">Computer Science Student</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-6 space-y-3">
              <h3 className="font-semibold mb-4">Statistics</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-semibold">{MOCK_PROJECT.rating}/5.0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-semibold">{MOCK_PROJECT.downloads.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Views</span>
                <span className="font-semibold">{MOCK_PROJECT.views.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Projects Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Related Projects</h2>
              <p className="text-muted-foreground">
                Check out these similar projects in the same category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_RELATED_PROJECTS.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
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
