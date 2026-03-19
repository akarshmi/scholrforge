'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutGrid, ChevronRight, Eye, Lock, Database, Share2, UserCheck, Bell, Trash2, Mail } from 'lucide-react'

const SECTIONS = [
    {
        id: 'collect',
        icon: Database,
        color: '#6c63ff',
        title: 'Information We Collect',
        content: `We collect information you provide directly, such as your name, email address, and profile details when you register. We also collect content you upload — projects, descriptions, and associated files. Automatically collected data includes your IP address, browser type, pages visited, and interaction events through cookies and similar technologies.`,
    },
    {
        id: 'use',
        icon: Eye,
        color: '#00d4aa',
        title: 'How We Use Your Information',
        content: `We use your information to provide and improve the ScholrForge platform, personalise your experience, send transactional emails (password resets, notifications), analyse usage patterns to improve our product, and enforce our Terms of Service. We do not sell your personal data to third parties.`,
    },
    {
        id: 'sharing',
        icon: Share2,
        color: '#8b84ff',
        title: 'Information Sharing',
        content: `Your public profile and uploaded projects are visible to all users. We may share data with trusted service providers who assist in operating the platform, subject to confidentiality obligations. We may disclose information if required by law or to protect the rights, safety, or property of ScholrForge or others.`,
    },
    {
        id: 'security',
        icon: Lock,
        color: '#00d4aa',
        title: 'Data Security',
        content: `We implement industry-standard security measures including encryption in transit (TLS), hashed passwords, and access controls. While we strive to protect your data, no method of transmission over the internet is 100% secure. You should use a strong, unique password and notify us immediately of any suspected unauthorised access.`,
    },
    {
        id: 'rights',
        icon: UserCheck,
        color: '#6c63ff',
        title: 'Your Rights',
        content: `You have the right to access, correct, or delete your personal data at any time through your account settings. You may also request a portable copy of your data or object to certain processing activities. Depending on your jurisdiction, you may have additional rights under applicable privacy laws such as GDPR or CCPA.`,
    },
    {
        id: 'cookies',
        icon: Bell,
        color: '#f59e0b',
        title: 'Cookies & Tracking',
        content: `We use essential cookies for authentication and session management, and analytics cookies to understand how users interact with the platform. You can control cookie preferences through your browser settings. Disabling essential cookies may affect core platform functionality.`,
    },
    {
        id: 'retention',
        icon: Trash2,
        color: '#ef4444',
        title: 'Data Retention',
        content: `We retain your data for as long as your account is active or as needed to provide services. If you delete your account, your personal data is removed within 30 days, except where retention is required for legal compliance or dispute resolution. Anonymised, aggregated data may be retained indefinitely.`,
    },
    {
        id: 'contact',
        icon: Mail,
        color: '#00d4aa',
        title: 'Contact & Updates',
        content: `For privacy-related questions or to exercise your rights, contact us at privacy@scholrforge.com. We will respond within 30 days. We may update this policy periodically and will notify you of material changes via email or a prominent notice on the platform. Continued use after changes constitutes acceptance.`,
    },
]

export default function PrivacyPage() {
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
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 30% at 50% -5%, rgba(0,212,170,0.07), transparent)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 25% at 85% 70%, rgba(108,99,255,0.06), transparent)' }} />
            </div>

            {/* Top accent — teal-led for privacy, distinct from terms */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(to right, rgba(0,212,170,0.7), rgba(108,99,255,0.4), transparent)' }} />

            {/* Header */}
            <header
                className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
                style={{ background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
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
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Privacy Policy</span>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex gap-8">

                {/* Sidebar TOC */}
                <nav className="hidden lg:flex flex-col gap-1 w-52 shrink-0 sticky top-24 self-start">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Contents
                    </p>
                    {SECTIONS.map(s => {
                        const Icon = s.icon
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => scrollTo(s.id)}
                                className="flex items-center gap-2 text-left text-xs py-1.5 px-3 rounded-lg transition-all duration-150"
                                style={active === s.id ? {
                                    color: '#00d4aa',
                                    background: 'rgba(0,212,170,0.1)',
                                    borderLeft: '2px solid rgba(0,212,170,0.5)',
                                } : {
                                    color: 'rgba(255,255,255,0.3)',
                                    borderLeft: '2px solid transparent',
                                }}
                                onMouseEnter={e => { if (active !== s.id) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                                onMouseLeave={e => { if (active !== s.id) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
                            >
                                <Icon className="w-3 h-3 shrink-0" style={{ color: active === s.id ? '#00d4aa' : 'inherit' }} />
                                {s.title}
                            </button>
                        )
                    })}
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)' }}
                                >
                                    <Lock className="w-5 h-5" style={{ color: '#00d4aa' }} />
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">Privacy Policy</h1>
                            </div>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                Last updated <span style={{ color: 'rgba(255,255,255,0.55)' }}>January 1, 2025</span>
                            </p>
                            <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                Your privacy matters to us. This policy explains what data we collect, how we use it, and the controls you have over it.
                            </p>
                        </div>

                        {/* Quick summary chips */}
                        <div className="flex flex-wrap gap-2 mb-10">
                            {[
                                { label: 'No data selling', color: '#00d4aa' },
                                { label: 'You own your content', color: '#6c63ff' },
                                { label: 'Delete anytime', color: '#00d4aa' },
                                { label: 'Encrypted in transit', color: '#8b84ff' },
                            ].map(({ label, color }) => (
                                <span
                                    key={label}
                                    className="text-[11px] font-medium px-3 py-1 rounded-full border"
                                    style={{ color, background: `${color}12`, borderColor: `${color}30` }}
                                >
                                    ✓ {label}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-10">
                            {SECTIONS.map((s, i) => {
                                const Icon = s.icon
                                return (
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
                                            <div
                                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
                                            >
                                                <Icon className="w-4 h-4" style={{ color: s.color }} />
                                            </div>
                                            <h2 className="text-base font-semibold text-white">{s.title}</h2>
                                        </div>
                                        <p className="text-sm leading-7 pl-11" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                            {s.content}
                                        </p>
                                        {i < SECTIONS.length - 1 && (
                                            <div className="mt-10 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                                        )}
                                    </motion.section>
                                )
                            })}
                        </div>

                        {/* Footer */}
                        <div
                            className="mt-12 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            style={{ background: 'rgba(0,212,170,0.04)', border: '1px solid rgba(0,212,170,0.1)' }}
                        >
                            <div>
                                <p className="text-sm font-medium text-white mb-0.5">Questions about your privacy?</p>
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                    Email us at{' '}
                                    <a
                                        href="mailto:privacy@scholrforge.com"
                                        className="underline underline-offset-2"
                                        style={{ color: '#00d4aa' }}
                                    >
                                        privacy@scholrforge.com
                                    </a>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/terms"
                                    className="text-xs font-medium transition-colors"
                                    style={{ color: 'rgba(108,99,255,0.8)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#a09cff')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(108,99,255,0.8)')}
                                >
                                    Terms of Service →
                                </Link>
                                <Link
                                    href="/settings"
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                                    style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.25)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,212,170,0.25)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,212,170,0.15)')}
                                >
                                    Privacy Settings
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}