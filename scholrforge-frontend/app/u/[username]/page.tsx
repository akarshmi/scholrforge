import type { Metadata } from 'next'
import UserProfileContent from '@/components/user/UserProfileContent'

export const metadata: Metadata = {
  title: 'Profile - scholrforge',
  description: 'View user profile and projects',
}

interface UserPageProps {
  params: {
    username: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  return <UserProfileContent username={params.username} />
}
