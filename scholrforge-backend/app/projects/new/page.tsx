import type { Metadata } from 'next'
import UploadWizard from '@/components/projects/UploadWizard'

export const metadata: Metadata = {
  title: 'Upload Project - scholrforge',
  description: 'Share your academic project with the community',
}

export default function UploadPage() {
  return (
    <div className="w-full">
      <UploadWizard />
    </div>
  )
}
