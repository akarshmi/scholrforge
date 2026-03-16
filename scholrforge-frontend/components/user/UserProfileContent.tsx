'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  MessageCircle, Users, Award, Edit3, Check, X,
  Github, Twitter, Globe, Linkedin, Calendar,
  Star, Download, Eye, ArrowLeft, ChevronRight,
  MapPin, BookOpen, TrendingUp, UserPlus, UserCheck,
} from 'lucide-react'
import ProjectCard from '@/components/projects/ProjectCard'

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_USER = {
  username: 'john_dev',
  displayName: 'John Smith',
  email: 'john@example.com',
  bio: 'Computer Science student passionate about AI and full-stack development. Building things that matter, one commit at a time.',
  avatar: 'JS',
  location: 'San Francisco, CA',
  website: 'https://johnsmith.dev',
  github: 'john_dev',
  twitter: 'john_dev',
  linkedin: 'johnsmith',
  followers: 234,
  following: 89,
  reputation: 1250,
  joinedDate: 'January 2024',
  totalDownloads: 4890,
  totalViews: 18200,
  avgRating: 4.7,
  badges: [
    { label: 'Top Contributor', color: 'rgba(108,99,255,0.15)', text: '#6c63ff', border: 'rgba(108,99,255,0.3)' },
    { label: 'Code Quality', color: 'rgba(0,212,170,0.15)', text: '#00d4aa', border: 'rgba(0,212,170,0.3)' },
    { label: 'Community Helper', color: 'rgba(255,215,0,0.15)', text: '#ffd700', border: 'rgba(255,215,0,0.3)' },
  ],
}

const USER_PROJECTS = [
  { id: '1', title: 'AI Chatbot Platform', description: 'Interactive ChatGPT Clone using OpenAI API and Next.js', difficulty: 'intermediate' as const, rating: 4.8, downloads: 1250, tech: ['React', 'Node.js', 'OpenAI'], author: 'john_dev' },
  { id: '2', title: 'Task Manager App', description: 'Full-stack task management application with teams', difficulty: 'beginner' as const, rating: 4.5, downloads: 890, tech: ['React', 'Firebase'], author: 'john_dev' },
  { id: '3', title: 'ML Pipeline', description: 'End-to-end machine learning pipeline with automation', difficulty: 'advanced' as const, rating: 4.9, downloads: 2100, tech: ['Python', 'TensorFlow'], author: 'john_dev' },
]

const MOCK_REVIEWS = [
  { id: '1', reviewer: 'alice_dev', project: 'AI Chatbot Platform', rating: 5, text: 'Exceptional work! The code quality and documentation are top-notch.', date: 'Mar 2025' },
  { id: '2', reviewer: 'bob_ml', project: 'ML Pipeline', rating: 5, text: 'Best ML project I have seen from a student. Very production-ready.', date: 'Feb 2025' },
  { id: '3', reviewer: 'sara_ui', project: 'Task Manager App', rating: 4, text: 'Clean UI and solid implementation. Minor improvements could be made.', date: 'Jan 2025' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
})

type Tab = 'projects' | 'reviews' | 'about'

// ── Edit modal ────────────────────────────────────────────────────────────────
function EditModal({
  user, onClose, onSave,
}: {
  user: typeof MOCK_USER
  onClose: () => void
  onSave: (u: typeof MOCK_USER) => void
}) {
  const [form, setForm] = useState({ ...user })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const inputCls = "w-full h-9 px-3 rounded-lg border border-border/60 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
  const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block"

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg glass rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Display Name</label>
            <input value={form.displayName} onChange={set('displayName')} className={inputCls} placeholder="Your name" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Bio</label>
            <textarea value={form.bio} onChange={set('bio')} rows={3}
              className={`${inputCls} h-auto py-2 resize-none`} placeholder="Tell people about yourself" />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input value={form.location} onChange={set('location')} className={inputCls} placeholder="City, Country" />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input value={form.website} onChange={set('website')} className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>GitHub</label>
            <input value={form.github} onChange={set('github')} className={inputCls} placeholder="username" />
          </div>
          <div>
            <label className={labelCls}>Twitter</label>
            <input value={form.twitter} onChange={set('twitter')} className={inputCls} placeholder="username" />
          </div>
          <div>
            <label className={labelCls}>LinkedIn</label>
            <input value={form.linkedin} onChange={set('linkedin')} className={inputCls} placeholder="username" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose() }}
            className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function UserProfileContent({ username }: { username: string }) {
  const [user, setUser] = useState(MOCK_USER)
  const [tab, setTab] = useState<Tab>('projects')
  const [followed, setFollowed] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // TODO: replace with real auth check
  const isOwnProfile = username === 'john_dev'

  const STATS = [
    { label: 'Reputation', value: fmt(user.reputation), icon: <TrendingUp className="w-3.5 h-3.5" />, color: '#6c63ff' },
    { label: 'Downloads', value: fmt(user.totalDownloads), icon: <Download className="w-3.5 h-3.5" />, color: '#00d4aa' },
    { label: 'Views', value: fmt(user.totalViews), icon: <Eye className="w-3.5 h-3.5" />, color: '#00e0ff' },
    { label: 'Avg Rating', value: String(user.avgRating), icon: <Star className="w-3.5 h-3.5" />, color: '#ffd700' },
    { label: 'Followers', value: fmt(user.followers), icon: <Users className="w-3.5 h-3.5" />, color: '#6c63ff' },
    { label: 'Projects', value: String(USER_PROJECTS.length), icon: <BookOpen className="w-3.5 h-3.5" />, color: '#00d4aa' },
  ]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'projects', label: `Projects (${USER_PROJECTS.length})` },
    { id: 'reviews', label: `Reviews (${MOCK_REVIEWS.length})` },
    { id: 'about', label: 'About' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {editOpen && (
          <EditModal user={user} onClose={() => setEditOpen(false)} onSave={setUser} />
        )}
      </AnimatePresence>

      {/* ── Breadcrumb ── */}
      <div >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Explore
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-foreground">{user.username}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative border-b border-border/40 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,99,255,0.1), transparent)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(0,212,170,0.06), transparent)' }} />
        </div>

        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
          {...fadeUp(0)}
        >
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">

            {/* Avatar */}
            <div className="relative shrink-0 self-start">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold"
                style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)' }}
              >
                {user.avatar}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background"
                style={{ background: '#00d4aa' }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{user.displayName}</h1>
                <span className="text-sm text-muted-foreground">@{user.username}</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{user.bio}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {user.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{user.location}</span>
                )}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {user.joinedDate}</span>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { icon: <Github className="w-3.5 h-3.5" />, href: `https://github.com/${user.github}`, show: !!user.github },
                  { icon: <Twitter className="w-3.5 h-3.5" />, href: `https://twitter.com/${user.twitter}`, show: !!user.twitter },
                  { icon: <Linkedin className="w-3.5 h-3.5" />, href: `https://linkedin.com/in/${user.linkedin}`, show: !!user.linkedin },
                  { icon: <Globe className="w-3.5 h-3.5" />, href: user.website, show: !!user.website },
                ].filter(l => l.show).map(({ icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              {isOwnProfile ? (
                <button onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setFollowed(!followed)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
                    style={followed
                      ? { background: 'rgba(108,99,255,0.1)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.3)' }
                      : { background: '#6c63ff', color: '#fff' }
                    }
                  >
                    {followed
                      ? <><UserCheck className="w-4 h-4" /> Following</>
                      : <><UserPlus className="w-4 h-4" /> Follow</>
                    }
                  </button>
                  <button className="w-9 h-9 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-7 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {STATS.map(({ label, value, icon, color }) => (
              <div key={label}
                className="glass rounded-xl p-3 flex flex-col gap-1.5 text-center hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="flex items-center justify-center gap-1" style={{ color }}>
                  {icon}
                </div>
                <p className="text-base font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {user.badges.map(({ label, color, text, border }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border"
                  style={{ background: color, color: text, borderColor: border }}
                >
                  <Award className="w-3 h-3" />
                  {label}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Tabs ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 space-y-6">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-muted/20 border border-border/40 rounded-xl w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id
                  ? 'bg-background border border-border text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >

            {/* Projects */}
            {tab === 'projects' && (
              <div className="space-y-4">
                {isOwnProfile && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">{USER_PROJECTS.length}</span> projects
                    </p>
                    <Link href="/projects/new"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-[0.98] transition-all">
                      + New Project
                    </Link>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {USER_PROJECTS.map((p, i) => (
                    <motion.div key={p.id} {...fadeUp(i * 0.05)}>
                      <ProjectCard {...p} variant="grid" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {tab === 'reviews' && (
              <div className="space-y-3">
                {MOCK_REVIEWS.map(({ id, reviewer, project, rating, text, date }, i) => (
                  <motion.div key={id} className="glass rounded-xl p-5 space-y-3 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
                    {...fadeUp(i * 0.07)}>
                    {/* Accent line */}
                    <div className="absolute inset-x-0 top-0 h-px"
                      style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.6), transparent)' }} />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)' }}>
                          {reviewer.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{reviewer}</p>
                          <p className="text-[11px] text-muted-foreground">on <span className="text-primary">{project}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* About */}
            {tab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Bio */}
                <div className="lg:col-span-2 glass rounded-xl divide-y divide-border/40">
                  {[
                    { label: 'Bio', value: user.bio },
                    { label: 'Email', value: user.email },
                    { label: 'Location', value: user.location },
                    { label: 'Website', value: user.website },
                    { label: 'Member Since', value: user.joinedDate },
                  ].map(({ label, value }) => value && (
                    <div key={label} className="flex items-start justify-between gap-4 px-5 py-3.5">
                      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Badges */}
                  <div className="glass rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-primary" /> Achievements
                    </p>
                    <div className="space-y-2">
                      {user.badges.map(({ label, color, text, border }) => (
                        <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                          style={{ background: color, borderColor: border }}>
                          <Award className="w-3.5 h-3.5 shrink-0" style={{ color: text }} />
                          <span className="text-xs font-medium" style={{ color: text }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social */}
                  <div className="glass rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-foreground">Social Links</p>
                    <div className="space-y-2">
                      {[
                        { icon: <Github className="w-3.5 h-3.5" />, label: 'GitHub', href: `https://github.com/${user.github}`, show: !!user.github },
                        { icon: <Twitter className="w-3.5 h-3.5" />, label: 'Twitter', href: `https://twitter.com/${user.twitter}`, show: !!user.twitter },
                        { icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn', href: `https://linkedin.com/in/${user.linkedin}`, show: !!user.linkedin },
                        { icon: <Globe className="w-3.5 h-3.5" />, label: 'Website', href: user.website, show: !!user.website },
                      ].filter(l => l.show).map(({ icon, label, href }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all">
                          {icon} {label}
                          <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}