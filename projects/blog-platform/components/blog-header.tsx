"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "./empty-state"

export function BlogHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search API call
    setTimeout(() => {
      // For demo purposes, only return results if query is "next"
      if (searchQuery.toLowerCase().includes("next")) {
        setSearchResults([
          { id: "1", title: "How to Build a Blog with Next.js", category: "Tutorial" },
          { id: "3", title: "Server Components in Next.js", category: "Guide" },
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

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold transition-colors hover:text-primary">
          <span className="text-xl">BlogPlatform</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
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
                        <Link href={`/editor/${result.id}`} className="block rounded-md p-2 text-sm hover:bg-muted">
                          <span className="font-medium">{result.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{result.category}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-6">
                <EmptyState
                  title="No notifications"
                  description="You're all caught up! No new notifications."
                  icon={<Bell className="h-8 w-8 text-muted-foreground" />}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

