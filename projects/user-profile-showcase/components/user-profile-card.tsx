"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserProfileCardProps {
  name: string
  jobTitle: string
  avatarUrl?: string
  initials?: string
}

export default function UserProfileCard({ name, jobTitle, avatarUrl, initials = "UN" }: UserProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={avatarUrl} alt={`${name}'s profile picture`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg leading-none">{name}</h3>
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                aria-pressed={isFollowing}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{jobTitle}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="text-xs">
                Product
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Design
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

