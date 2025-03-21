"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp } from "lucide-react"

interface UserProfileCardProps {
  name: string
  jobTitle: string
  avatarUrl?: string
  initials?: string
  bio?: string
}

export default function UserProfileCard({ name, jobTitle, avatarUrl, initials = "UN", bio }: UserProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFollowing(!isFollowing)
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className="w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-border transition-transform duration-300 hover:scale-110 flex-shrink-0">
            <AvatarImage src={avatarUrl} alt={`${name}'s profile picture`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-semibold text-base sm:text-lg leading-tight truncate">{name}</h3>
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={toggleFollow}
                aria-pressed={isFollowing}
                className="transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-auto self-start"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{jobTitle}</p>

            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 py-1 h-auto text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground"
                onClick={toggleExpand}
                aria-expanded={isExpanded}
                aria-controls={`bio-${name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {isExpanded ? (
                  <span className="flex items-center">
                    Show less <ChevronUp className="ml-1 h-3 w-3" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Show more <ChevronDown className="ml-1 h-3 w-3" />
                  </span>
                )}
              </Button>
            </div>

            {isExpanded && (
              <div
                id={`bio-${name.replace(/\s+/g, "-").toLowerCase()}`}
                className="mt-3 pt-3 border-t text-sm animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <h4 className="font-medium mb-1">About</h4>
                <p className="text-muted-foreground text-xs sm:text-sm break-words">{bio || "No bio available."}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

