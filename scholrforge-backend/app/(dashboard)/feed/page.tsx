import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Feed - scholrforge',
  description: 'Your personalized feed of academic projects',
}

export default function FeedPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Your Feed</h1>
          <p className="text-muted-foreground text-lg">
            Discover projects tailored to your interests
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/projects/new">
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Share Your Project
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline">
              Explore More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-muted-foreground">
          Your personalized feed will appear here soon.
        </p>
      </div>
    </div>
  )
}
