'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, LayoutGrid, ChevronRight } from 'lucide-react'

const SECTIONS = [
    {
        id: 'acceptance',
        title: 'Acceptance of Terms',
        content: `By accessing or using ScholrForge, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of any changes.`,
    },
    {
        id: 'account',
        title: 'Account Responsibilities',
        content: `You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating your account. You agree not to share your account with others or use another user's account without permission. You are responsible for all activity that occurs under your account.`,
    },
    {
        id: 'content',
        title: 'User Content',
        content: `You retain ownership of any projects or content you upload to ScholrForge. By uploading content, you grant ScholrForge a non-exclusive, royalty-free license to display, distribute, and promote your content within the platform. You are solely responsible for ensuring your content does not infringe on any third-party rights and complies with applicable laws.`,
    },
    {
        id: 'conduct',
        title: 'Prohibited Conduct',
        content: `You agree not to upload malicious code, engage in harassment or abuse of other users, attempt to gain unauthorized access to the platform or other accounts, use the platform for any illegal purpose, scrape or harvest data without written permission, or impersonate any person or entity. Violations may result in immediate account termination.`,
    },
    {
        id: 'ip',
        title: 'Intellectual Property',
        content: `ScholrForge's name, logo, design, and codebase are the exclusive property of ScholrForge and its licensors. You may not reproduce, distribute, or create derivative works from any ScholrForge-owned material without explicit written consent. Open-source components used within the platform are subject to their respective licenses.`,
    },
    {
        id: 'termination',
        title: 'Termination',
        content: `We reserve the right to suspend or terminate your account at our discretion, including for violations of these terms. Upon termination, your right to use the platform ceases immediately. You may delete your account at any time from your account settings. Provisions that by their nature should survive termination will remain in effect.`,
    },
    {
        id: 'liability',
        title: 'Limitation of Liability',
        content: `ScholrForge is provided "as is" without warranties of any kind. To the fullest extent permitted by law, ScholrForge shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability for any claim shall not exceed the amount you paid us in the past twelve months.`,
    },
    {
        id: 'governing',
        title: 'Governing Law',
        content: `These terms are governed by applicable laws without regard to conflict-of-law principles. Any disputes arising from these terms or your use of ScholrForge shall be resolved through binding arbitration, except where prohibited by law.`,
    },
]

export default function TermsPage() {
    const [active, setActive] = useState(SECTIONS[0].id)
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id)
                }
            },
            { rootMargin: '-30% 0px -60% 0px' }
        )
        Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
        return () => observer.disconnect()
    }, [])

    const scrollTo = (id: string) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="min-h-screen" style={{ background: '#08080f' }}>
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 30% at 50% -5%, rgba(108,99,255,0.1), transparent)' }} />
            </div>

            {/* Top accent */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.7), rgba(0,212,170,0.4), transparent)' }} />

            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                        style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)' }}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" style={{ color: '#6c63ff' }} />
                    </div>
                    <span className="text-sm font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #a09cff, #00d4aa)' }}>
                        scholrforge
                    </span>
                </Link>

                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <Link href="/" className="transition-colors hover:text-white/60">Home</Link>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Terms of Service</span>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex gap-8">

                {/* Sidebar TOC */}
                <nav className="hidden lg:flex flex-col gap-1 w-52 shrink-0 sticky top-24 self-start">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Contents
                    </p>
                    {SECTIONS.map(s => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => scrollTo(s.id)}
                            className="text-left text-xs py-1.5 px-3 rounded-lg transition-all duration-150"
                            style={active === s.id ? {
                                color: '#a09cff',
                                background: 'rgba(108,99,255,0.12)',
                                borderLeft: '2px solid rgba(108,99,255,0.6)',
                            } : {
                                color: 'rgba(255,255,255,0.3)',
                                borderLeft: '2px solid transparent',
                            }}
                            onMouseEnter={e => { if (active !== s.id) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                            onMouseLeave={e => { if (active !== s.id) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
                        >
                            {s.title}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Terms of Service</h1>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                Last updated <span style={{ color: 'rgba(255,255,255,0.55)' }}>January 1, 2025</span>
                            </p>
                            <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                Please read these terms carefully before using ScholrForge. They govern your access to and use of our platform.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {SECTIONS.map((s, i) => (
                                <motion.section
                                    key={s.id}
                                    id={s.id}
                                    ref={el => { sectionRefs.current[s.id] = el }}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.04 }}
                                    className="scroll-mt-24"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span
                                            className="flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold shrink-0"
                                            style={{ background: 'rgba(108,99,255,0.15)', color: '#8b84ff', border: '1px solid rgba(108,99,255,0.2)' }}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h2 className="text-base font-semibold text-white">{s.title}</h2>
                                    </div>
                                    <p className="text-sm leading-7 pl-9" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                        {s.content}
                                    </p>
                                    {i < SECTIONS.length - 1 && (
                                        <div className="mt-10 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                                    )}
                                </motion.section>
                            ))}
                        </div>

                        {/* Footer links */}
                        <div
                            className="mt-12 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <div>
                                <p className="text-sm font-medium text-white mb-0.5">Have questions about these terms?</p>
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>We're happy to clarify anything.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/privacy"
                                    className="text-xs font-medium transition-colors"
                                    style={{ color: 'rgba(108,99,255,0.8)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#a09cff')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(108,99,255,0.8)')}
                                >
                                    Privacy Policy →
                                </Link>
                                <a
                                    href="mailto:support@scholrforge.com"
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                                    style={{ background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.3)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.2)')}
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}