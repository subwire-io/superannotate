"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { SimpleInput } from "./ui/simple-input"
import type { Post } from "@/types"

interface BlogHeaderProps {
  onEditPost?: (post: Post) => void
}

export function BlogHeader({ onEditPost }: BlogHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Post[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search API call
    setTimeout(() => {
      // For demo purposes, only return results if query is "next"
      if (searchQuery.toLowerCase().includes("next")) {
        setSearchResults([
          {
            id: "1",
            title: "How to Build a Blog with Next.js",
            content: "",
            excerpt: "",
            slug: "",
            category: "Tutorial",
            published: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            title: "Server Components in Next.js",
            content: "",
            excerpt: "",
            slug: "",
            category: "Guide",
            published: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])
      } else {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 500)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const handleResultClick = (post: Post) => {
    if (onEditPost) {
      onEditPost(post)
      clearSearch()
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold transition-colors hover:text-primary">
          <span className="text-xl">BlogPlatform</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SimpleInput
              type="search"
              placeholder="Search posts..."
              className="w-64 rounded-lg bg-background pl-8 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  )
}

