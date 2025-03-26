"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import type { Post } from "@/types"

interface BlogHeaderProps {
  onEditPost?: (post: Post) => void
  posts: Post[]
}

export function BlogHeader({ onEditPost, posts }: BlogHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Once mounted on client, we can show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

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
          {/* Theme Toggle */}
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {themeIcon}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

