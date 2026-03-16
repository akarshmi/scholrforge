'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-3 max-w-2xl">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <Input
          type="search"
          placeholder="Search projects by title, description, or tech stack..."
          value={query}
          onChange={handleChange}
          className="h-9 bg-muted/50 border-muted"
        />
      </div>
    </div>
  )
}
