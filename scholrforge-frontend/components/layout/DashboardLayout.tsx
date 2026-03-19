// ── DashboardLayout.tsx ───────────────────────────────────────────────────────
'use client'

import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import SearchCommand from '@/components/shared/SearchCommand'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col min-h-full">
            {children}
          </div>
        </main>
      </div>
      <SearchCommand />
    </div>
  )
}