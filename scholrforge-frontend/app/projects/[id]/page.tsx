import type { Metadata } from 'next'
import ProjectDetailContent from '@/components/projects/ProjectDetailContent'

export const metadata: Metadata = {
  title: 'Project - scholrforge',
  description: 'View detailed project information and reviews',
}

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  return <ProjectDetailContent slug={id} />
}