import type { Metadata } from 'next'
import ExploreContent from '@/components/explore/ExploreContent'

export const metadata: Metadata = {
  title: 'Explore - scholrforge',
  description: 'Discover amazing academic projects from students worldwide',
}

export default function ExplorePage() {
  return <ExploreContent />
}
