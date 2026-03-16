'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle, XCircle } from 'lucide-react'

// Mock data
const PENDING_PROJECTS = [
  {
    id: '1',
    title: 'AI Vision System',
    author: 'alex_dev',
    submittedDate: '2025-03-14',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Blockchain DApp',
    author: 'crypto_dev',
    submittedDate: '2025-03-13',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Mobile Game',
    author: 'game_dev',
    submittedDate: '2025-03-12',
    status: 'pending',
  },
]

export default function ProjectReviewTable() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const handleSelectAll = () => {
    if (selectedIds.length === PENDING_PROJECTS.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(PENDING_PROJECTS.map((p) => p.id))
    }
  }

  const handleSelectProject = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedIds.length === PENDING_PROJECTS.length}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left text-sm font-semibold">Project</th>
              <th className="p-4 text-left text-sm font-semibold">Author</th>
              <th className="p-4 text-left text-sm font-semibold">Submitted</th>
              <th className="p-4 text-left text-sm font-semibold">Status</th>
              <th className="p-4 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PENDING_PROJECTS.map((project, i) => (
              <motion.tr
                key={project.id}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedIds.includes(project.id)}
                    onCheckedChange={() => handleSelectProject(project.id)}
                  />
                </td>
                <td className="p-4 font-medium">{project.title}</td>
                <td className="p-4 text-muted-foreground">{project.author}</td>
                <td className="p-4 text-sm text-muted-foreground">{project.submittedDate}</td>
                <td className="p-4">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                    {project.status}
                  </Badge>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    onClick={() => console.log('Approved:', project.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => console.log('Rejected:', project.id)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="border-t border-border p-4 flex items-center justify-between bg-muted/20">
          <p className="text-sm font-medium">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-red-500">
              Reject Selected
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Approve Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
