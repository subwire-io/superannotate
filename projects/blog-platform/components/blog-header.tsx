"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, X, Moon, Sun } from "lucide-react"
import { SimpleInput } from "./ui/simple-input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import type { Post } from "@/types"

interface BlogHeaderProps {
  onEditPost?: (post: Post) => void
  onSearch?: (query: string) => void
  posts: Post[]
}

export function BlogHeader({ onEditPost, onSearch, posts }: BlogHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const searchRef = useRef<HTMLDivElement>(null)

  // Once mounted on client, we can show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true)

      // Simulate search delay
      const timer = setTimeout(() => {
        const results = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, posts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    if (onSearch) {
      onSearch("")
    }
  }

  const handleResultClick = (post: Post) => {
    if (onEditPost) {
      onEditPost(post)
      clearSearch()
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Prevent hydration mismatch by not rendering theme toggle until mounted
  const themeIcon = mounted ? theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" /> : null

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold transition-colors hover:text-primary">
          <span className="text-xl">BlogPlatform</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Desktop Search */}
          <div ref={searchRef} className="relative hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <SimpleInput
                type="search"
                placeholder="Search posts..."
                className="w-64 rounded-lg bg-background pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (onSearch) {
                    onSearch(e.target.value)
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </form>

            {searchQuery && (
              <div className="absolute top-full mt-2 w-full rounded-md border bg-background p-2 shadow-md">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="ml-2 text-sm">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((result) => (
                      <li key={result.id}>
                        <button
                          onClick={() => handleResultClick(result)}
                          className="block w-full text-left rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <span className="font-medium">{result.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{result.category}</span>
                          {result.published ? (
                            <span className="ml-2 text-xs text-green-500">Published</span>
                          ) : (
                            <span className="ml-2 text-xs text-yellow-500">Draft</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {themeIcon}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="border-t p-2 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SimpleInput
              type="search"
              placeholder="Search posts..."
              className="w-full rounded-lg bg-background pl-8 pr-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (onSearch) {
                  onSearch(e.target.value)
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </form>

          {searchQuery && (
            <div className="mt-2 rounded-md border bg-background p-2 shadow-md">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => (
                    <li key={result.id}>
                      <button
                        onClick={() => handleResultClick(result)}
                        className="block w-full text-left rounded-md p-2 text-sm hover:bg-muted"
                      >
                        <span className="font-medium">{result.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{result.category}</span>
                        {result.published ? (
                          <span className="ml-2 text-xs text-green-500">Published</span>
                        ) : (
                          <span className="ml-2 text-xs text-yellow-500">Draft</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-2 text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}

