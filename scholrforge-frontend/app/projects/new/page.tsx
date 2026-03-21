import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import UploadWizard from '@/components/projects/UploadWizard'

export const metadata: Metadata = {
  title: 'Upload Project - Scholrforge',
  description: 'Share your academic project with the community',
}

export default function UploadPage() {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/explore"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" /> Explore
        </Link>
      </div>
      <UploadWizard />
    </div>
  )
}