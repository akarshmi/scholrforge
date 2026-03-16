'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Download, Bookmark, BookmarkCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  downloads: number
  tech: string[]
  author: string
  semester?: string
  coverImage?: string
  isBookmarked?: boolean
  variant?: 'grid' | 'list' | 'featured'
  onBookmarkChange?: (isBookmarked: boolean) => void
}

const difficultyColor = {
  beginner: 'bg-secondary/20 text-secondary border-secondary/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-destructive/20 text-destructive border-destructive/30',
}

export default function ProjectCard({
  id,
  title,
  description,
  difficulty,
  rating,
  downloads,
  tech,
  author,
  semester,
  coverImage,
  isBookmarked = false,
  variant = 'grid',
  onBookmarkChange,
}: ProjectCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !bookmarked
    setBookmarked(newState)
    onBookmarkChange?.(newState)
  }

  if (variant === 'featured') {
    return (
      <Link href={`/projects/${id}`}>
        <motion.div
          className="glass rounded-xl overflow-hidden group hover:border-primary/50 transition-all"
          whileHover={{ translateY: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Cover Image */}
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-48 object-cover group-hover:brightness-110 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary/30 mb-2">
                  {title.charAt(0)}
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
              </div>
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                aria-label="Bookmark project"
              >
                {bookmarked ? (
                  <BookmarkCheck className="w-5 h-5 fill-primary text-primary" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1">
              {tech.slice(0, 2).map((t) => (
                <Badge key={t} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
              {tech.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tech.length - 2}
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{rating}</span>
                </div>
              </div>
              <Badge variant="secondary" className={difficultyColor[difficulty]}>
                {difficulty}
              </Badge>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <Link href={`/projects/${id}`}>
        <motion.div
          className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-primary/50 transition-all"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Cover Thumbnail */}
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
              <div className="text-2xl font-bold text-primary/30">{title.charAt(0)}</div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
              <Badge variant="secondary" className={difficultyColor[difficulty]}>
                {difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {rating}
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {(downloads / 1000).toFixed(1)}k
              </div>
              <span>{author}</span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label="Bookmark project"
          >
            {bookmarked ? (
              <BookmarkCheck className="w-5 h-5 fill-primary text-primary" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </motion.div>
      </Link>
    )
  }

  // Default grid variant
  return (
    <Link href={`/projects/${id}`}>
      <motion.div
        className="glass rounded-xl overflow-hidden group hover:border-primary/50 transition-all"
        whileHover={{ translateY: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
            </div>
            <button
              onClick={handleBookmark}
              className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
              aria-label="Bookmark project"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-primary text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1">
            {tech.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
            {tech.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tech.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{(downloads / 1000).toFixed(1)}k</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn('text-xs', difficultyColor[difficulty])}
            >
              {difficulty}
            </Badge>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
