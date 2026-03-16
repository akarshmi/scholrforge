'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { LayoutGrid, Menu, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#trending', label: 'Trending' },
  { href: '/explore', label: 'Explore' },
]

export default function Navbar() {
  const { isAuthenticated } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm shadow-black/10' : 'bg-transparent'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
            <LayoutGrid className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            scholrforge
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/30 transition-all duration-150">
              {label}
            </a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link href="/feed"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] transition-all">
              Dashboard <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link href="/login"
                className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/register"
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
                {label}
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </a>
            ))}
            <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link href="/feed" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}
                    className="flex items-center justify-center h-10 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}
                    className="flex items-center justify-center h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}