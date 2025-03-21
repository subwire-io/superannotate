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
    <Card className="w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="pt-8 px-8 pb-6 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-sm transition-transform duration-300 hover:scale-105 mb-4">
            <AvatarImage src={avatarUrl} alt={`${name}'s profile picture`} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>

          <h3 className="font-semibold text-xl mb-1">{name}</h3>
          <p className="text-muted-foreground mb-5">{jobTitle}</p>

          <Button
            variant={isFollowing ? "outline" : "default"}
            size="default"
            onClick={toggleFollow}
            aria-pressed={isFollowing}
            className="transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full max-w-[180px]"
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        <div className="px-8 pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-auto text-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground"
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            aria-controls={`bio-${name.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {isExpanded ? (
              <span className="flex items-center">
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center">
                Show more <ChevronDown className="ml-1 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div
            id={`bio-${name.replace(/\s+/g, "-").toLowerCase()}`}
            className="px-8 pb-8 pt-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300 border-t mx-6"
          >
            <h4 className="font-medium mb-2 text-base">About</h4>
            <p className="text-muted-foreground leading-relaxed">{bio || "No bio available."}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

