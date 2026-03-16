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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Search Command Palette */}
      <SearchCommand />
    </div>
  )
}
