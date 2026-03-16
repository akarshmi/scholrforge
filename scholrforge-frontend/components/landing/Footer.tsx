// ── Footer.tsx ────────────────────────────────────────────────────────────────
'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutGrid, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const LINKS = {
  Product: [
    { label: 'Explore', href: '/explore' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '#' },
    { label: 'Security', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '#' },
    { label: 'Support', href: '#' },
  ],
}

const SOCIALS = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@scholrforge.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-background overflow-hidden">
      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/4 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                <LayoutGrid className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                scholrforge
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[160px]">
              Discover and showcase academic excellence worldwide.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-1 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent hover:border-border/50 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{category}</p>
              <ul className="space-y-2">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} scholrforge. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '#']].map(([l, h]) => (
              <Link key={l} href={h}
                className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}