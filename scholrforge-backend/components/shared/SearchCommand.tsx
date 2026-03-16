'use client'

import React, { useState, useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, BookmarkIcon } from 'lucide-react'

interface SearchResult {
  type: 'project' | 'user' | 'tag'
  id: string
  title: string
  subtitle?: string
  url: string
}

const MOCK_RESULTS: SearchResult[] = [
  {
    type: 'project',
    id: '1',
    title: 'AI Chatbot',
    subtitle: 'Interactive ChatGPT Clone',
    url: '/projects/1',
  },
  {
    type: 'project',
    id: '2',
    title: 'E-commerce Platform',
    subtitle: 'MERN Stack',
    url: '/projects/2',
  },
  {
    type: 'user',
    id: '3',
    title: 'john_dev',
    subtitle: 'Computer Science Student',
    url: '/u/john_dev',
  },
  {
    type: 'tag',
    id: '4',
    title: 'React',
    subtitle: 'Popular frontend framework',
    url: '/explore?tag=react',
  },
]

export default function SearchCommand() {
  const isSearchOpen = useUIStore((state) => state.isSearchOpen)
  const setSearchOpen = useUIStore((state) => state.setSearchOpen)
  const searchQuery = useUIStore((state) => state.searchQuery)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(!isSearchOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isSearchOpen, setSearchOpen])

  useEffect(() => {
    if (searchQuery) {
      // Mock search - in real app, call API
      const filtered = MOCK_RESULTS.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [searchQuery])

  const handleSelect = (url: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    router.push(url)
  }

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <CommandInput
        placeholder="Search projects, users, tags..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {searchQuery === '' ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Start typing to search</p>
          </div>
        ) : results.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            {/* Projects */}
            {results.some((r) => r.type === 'project') && (
              <CommandGroup heading="Projects">
                {results
                  .filter((r) => r.type === 'project')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result.url)}
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {/* Users */}
            {results.some((r) => r.type === 'user') && (
              <CommandGroup heading="Users">
                {results
                  .filter((r) => r.type === 'user')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result.url)}
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {/* Tags */}
            {results.some((r) => r.type === 'tag') && (
              <CommandGroup heading="Tags">
                {results
                  .filter((r) => r.type === 'tag')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result.url)}
                      className="cursor-pointer"
                    >
                      <BookmarkIcon className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
