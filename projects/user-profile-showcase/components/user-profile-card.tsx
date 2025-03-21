"use client"

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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card
      className={`w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${isExpanded ? "shadow-md" : ""}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleExpand()
          e.preventDefault()
        }
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-border transition-transform duration-300 hover:scale-110">
            <AvatarImage src={avatarUrl} alt={`${name}'s profile picture`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg leading-none">{name}</h3>
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={toggleFollow}
                aria-pressed={isFollowing}
                className="transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{jobTitle}</p>

            <div className="pt-2 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                <p className="text-muted-foreground">{bio || "No bio available."}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

