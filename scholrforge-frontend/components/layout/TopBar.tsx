'use client'

import React, { useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { Search, Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const setSearchOpen = useUIStore((state) => state.setSearchOpen)
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
    // Setup keyboard shortcut for search (⌘K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSearchOpen])

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 items-center gap-2 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects (⌘K)..."
            className="h-8 bg-muted/50 border-muted text-sm"
            onClick={() => setSearchOpen(true)}
            readOnly
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
