'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2, Loader2, LayoutGrid } from 'lucide-react'

type Step = 'idle' | 'loading' | 'sent'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [step, setStep] = useState<Step>('idle')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email.trim()) {
            setError('Please enter your email address.')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.')
            return
        }

        setStep('loading')
        try {
            // Replace with your actual API call
            // await api.post('/auth/forgot-password', { email })
            await new Promise(r => setTimeout(r, 1200)) // sim
            setStep('sent')
        } catch {
            setStep('idle')
            setError('Something went wrong. Please try again.')
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: '#08080f' }}
        >
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(108,99,255,0.12), transparent)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 30% at 80% 80%, rgba(0,212,170,0.06), transparent)' }} />
            </div>

            <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                            style={{
                                background: 'rgba(108,99,255,0.15)',
                                border: '1px solid rgba(108,99,255,0.3)',
                                boxShadow: '0 0 16px rgba(108,99,255,0.15)',
                            }}
                        >
                            <LayoutGrid className="w-4 h-4" style={{ color: '#6c63ff' }} />
                        </div>
                        <span
                            className="text-base font-bold tracking-tight bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(to right, #a09cff, #00d4aa)' }}
                        >
                            scholrforge
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Top accent */}
                    <div
                        className="h-px w-full"
                        style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.7), rgba(0,212,170,0.4), transparent)' }}
                    />

                    <div className="p-8">
                        <AnimatePresence mode="wait">

                            {/* ── Sent state ── */}
                            {step === 'sent' ? (
                                <motion.div
                                    key="sent"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col items-center text-center gap-4 py-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        style={{
                                            background: 'rgba(0,212,170,0.12)',
                                            border: '1px solid rgba(0,212,170,0.25)',
                                            boxShadow: '0 0 24px rgba(0,212,170,0.1)',
                                        }}
                                    >
                                        <CheckCircle2 className="w-8 h-8" style={{ color: '#00d4aa' }} />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white mb-1">Check your inbox</h2>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                            We sent a reset link to{' '}
                                            <span className="font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{email}</span>.
                                            It expires in 15 minutes.
                                        </p>
                                    </div>
                                    <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                        Didn't get it?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setStep('idle'); setError('') }}
                                            className="underline underline-offset-2 transition-colors"
                                            style={{ color: 'rgba(108,99,255,0.8)' }}
                                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6c63ff')}
                                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(108,99,255,0.8)')}
                                        >
                                            Try again
                                        </button>
                                    </p>
                                </motion.div>

                            ) : (

                                /* ── Form state ── */
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="mb-6">
                                        <h1 className="text-xl font-semibold text-white mb-1.5">Forgot password?</h1>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                            Enter your email and we'll send you a reset link.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5"
                                                style={{ color: 'rgba(255,255,255,0.35)' }}
                                            >
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                                    style={{ color: 'rgba(255,255,255,0.2)' }}
                                                />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={e => { setEmail(e.target.value); setError('') }}
                                                    placeholder="you@university.edu"
                                                    autoComplete="email"
                                                    className="w-full h-10 pl-9 pr-4 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.05)',
                                                        border: error
                                                            ? '1px solid rgba(255,77,109,0.5)'
                                                            : '1px solid rgba(255,255,255,0.08)',
                                                    }}
                                                    onFocus={e => {
                                                        if (!error) (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(108,99,255,0.5)'
                                                            ; (e.currentTarget as HTMLInputElement).style.background = 'rgba(255,255,255,0.07)'
                                                    }}
                                                    onBlur={e => {
                                                        if (!error) (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'
                                                            ; (e.currentTarget as HTMLInputElement).style.background = 'rgba(255,255,255,0.05)'
                                                    }}
                                                />
                                            </div>
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        className="mt-1.5 text-xs"
                                                        style={{ color: 'rgba(255,77,109,0.9)' }}
                                                    >
                                                        {error}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={step === 'loading'}
                                            className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                                            style={{
                                                background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
                                                boxShadow: '0 4px 14px rgba(108,99,255,0.3)',
                                            }}
                                            onMouseEnter={e => {
                                                if (step !== 'loading')
                                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(108,99,255,0.5)'
                                            }}
                                            onMouseLeave={e =>
                                                ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(108,99,255,0.3)')
                                            }
                                        >
                                            {step === 'loading'
                                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                                                : 'Send Reset Link'
                                            }
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Back to login */}
                <div className="flex justify-center mt-5">
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 text-xs transition-colors"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)')}
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}