import type { Metadata } from 'next'
import ProjectDetailContent from '@/components/projects/ProjectDetailContent'

export const metadata: Metadata = {
  title: 'Project - scholrforge',
  description: 'View detailed project information and reviews',
}

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetailContent projectId={params.id} />
}
