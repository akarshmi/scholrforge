// app/feed/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'

export default async function FeedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession()

    if (!session) {
        redirect('/login?from=/feed')
    }

    return <>{children}</>
}