'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Users, Award } from 'lucide-react'
import ProjectCard from '@/components/projects/ProjectCard'

// Mock user data
const MOCK_USER = {
  username: 'john_dev',
  email: 'john@example.com',
  bio: 'Computer Science student passionate about AI and full-stack development.',
  avatar: 'JD',
  followers: 234,
  following: 89,
  reputation: 1250,
  joinedDate: 'January 2024',
  badges: ['Top Contributor', 'Code Quality', 'Community Helper'],
}

// Mock projects
const USER_PROJECTS = [
  {
    id: '1',
    title: 'AI Chatbot Platform',
    description: 'Interactive ChatGPT Clone using OpenAI API and Next.js',
    difficulty: 'intermediate' as const,
    rating: 4.8,
    downloads: 1250,
    tech: ['React', 'Node.js', 'OpenAI'],
    author: 'john_dev',
  },
  {
    id: '2',
    title: 'Task Manager App',
    description: 'Full-stack task management application',
    difficulty: 'beginner' as const,
    rating: 4.5,
    downloads: 890,
    tech: ['React', 'Firebase'],
    author: 'john_dev',
  },
]

interface UserProfileContentProps {
  username: string
}

export default function UserProfileContent({ username }: UserProfileContentProps) {
  const isOwnProfile = false // Replace with actual auth check

  return (
    <div className="w-full">
      {/* Header Section */}
      <motion.div
        className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {MOCK_USER.avatar}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{MOCK_USER.username}</h1>
                <span className="text-muted-foreground">@{MOCK_USER.username}</span>
              </div>
              <p className="text-muted-foreground mb-4">{MOCK_USER.bio}</p>
              <p className="text-sm text-muted-foreground">
                Joined {MOCK_USER.joinedDate}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isOwnProfile ? (
                <Button>Edit Profile</Button>
              ) : (
                <>
                  <Button>Follow</Button>
                  <Button variant="outline" size="icon">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reputation</p>
              <p className="text-2xl font-bold">{MOCK_USER.reputation}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Followers</p>
              <p className="text-2xl font-bold">{MOCK_USER.followers}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Following</p>
              <p className="text-2xl font-bold">{MOCK_USER.following}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Projects</p>
              <p className="text-2xl font-bold">{USER_PROJECTS.length}</p>
            </div>
          </div>

          {/* Badges */}
          {MOCK_USER.badges.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-3">Achievements</p>
              <div className="flex flex-wrap gap-2">
                {MOCK_USER.badges.map((badge) => (
                  <Badge key={badge} className="gap-2">
                    <Award className="w-3 h-3" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects ({USER_PROJECTS.length})</TabsTrigger>
            <TabsTrigger value="followers">Followers ({MOCK_USER.followers})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {USER_PROJECTS.map((project) => (
                <ProjectCard key={project.id} {...project} variant="grid" />
              ))}
            </motion.div>
          </TabsContent>

          {/* Followers Tab */}
          <TabsContent value="followers" className="mt-8">
            <motion.div
              className="glass rounded-xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Followers list coming soon</p>
            </motion.div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-8">
            <motion.div
              className="glass rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-muted-foreground mb-6">{MOCK_USER.bio}</p>
              <Separator className="my-6" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{MOCK_USER.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="font-medium">{MOCK_USER.joinedDate}</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
