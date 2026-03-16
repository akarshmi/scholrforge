'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Download, Upload, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import KPICard from '@/components/admin/KPICard'
import ProjectReviewTable from '@/components/admin/ProjectReviewTable'

// Mock data
const KPI_DATA = [
  { label: 'Daily Active Users', value: 1250, change: '+12%', icon: Users },
  { label: 'Total Downloads', value: 45000, change: '+8%', icon: Download },
  { label: 'Projects Published', value: 2500, change: '+5%', icon: Upload },
  { label: 'Pending Reviews', value: 23, change: '-3%', icon: AlertCircle },
]

const ANALYTICS_DATA = [
  { date: 'Mon', uploads: 120, downloads: 240, users: 221 },
  { date: 'Tue', uploads: 132, downloads: 221, users: 229 },
  { date: 'Wed', uploads: 101, downloads: 229, users: 200 },
  { date: 'Thu', uploads: 98, downloads: 200, users: 221 },
  { date: 'Fri', uploads: 111, downloads: 250, users: 250 },
  { date: 'Sat', uploads: 140, downloads: 290, users: 322 },
  { date: 'Sun', uploads: 160, downloads: 320, users: 250 },
]

const TECH_DISTRIBUTION = [
  { name: 'React', value: 400 },
  { name: 'Python', value: 300 },
  { name: 'Node.js', value: 200 },
  { name: 'Other', value: 350 },
]

const COLORS = ['#6c63ff', '#00d4aa', '#ff4d6d', '#ffd700']

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor scholrforge platform metrics and manage content
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {KPI_DATA.map((kpi) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Weekly Activity */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ANALYTICS_DATA}>
              <defs>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="date" stroke="#6b6b8a" />
              <YAxis stroke="#6b6b8a" />
              <Tooltip />
              <Area type="monotone" dataKey="uploads" stackId="1" stroke="#6c63ff" fillOpacity={1} fill="url(#colorUploads)" />
              <Area type="monotone" dataKey="downloads" stackId="1" stroke="#00d4aa" fillOpacity={1} fill="url(#colorDownloads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tech Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Tech Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={TECH_DISTRIBUTION}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {TECH_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Reviews & Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Pending Reviews (23)</TabsTrigger>
            <TabsTrigger value="users">Top Contributors</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <ProjectReviewTable />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {[
                  { name: 'john_dev', projects: 12, rating: 4.8 },
                  { name: 'jane_dev', projects: 8, rating: 4.9 },
                  { name: 'mike_dev', projects: 6, rating: 4.7 },
                ].map((user) => (
                  <div key={user.name} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.projects} projects</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(user.rating) ? 'text-yellow-400' : 'text-muted-foreground'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {[
                  { type: 'Inappropriate Content', project: 'Project ABC', status: 'pending' },
                  { type: 'Copyright Violation', project: 'Project XYZ', status: 'under review' },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{report.type}</p>
                      <p className="text-xs text-muted-foreground">{report.project}</p>
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      {report.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
