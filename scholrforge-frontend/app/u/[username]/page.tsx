import type { Metadata } from 'next'
import UserProfileContent from '@/components/user/UserProfileContent'

interface UserPageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params

  return {
    title: `${username} - scholrforge`,
    description: `View ${username}'s projects, reviews, and profile on scholrforge.`,
    openGraph: {
      title: `${username} on scholrforge`,
      description: `Check out ${username}'s academic projects and contributions.`,
      type: 'profile',
    },
  }
}

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  return <UserProfileContent username={username} />
}