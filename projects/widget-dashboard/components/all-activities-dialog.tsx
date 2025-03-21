"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Calendar, AlertCircle } from "lucide-react"
import { useState } from "react"
import { EmptyState } from "./empty-state"

type Activity = {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  target: string
  timestamp: string
  status?: "pending" | "completed" | "failed"
}

// Status badge component
function StatusBadge({ status }: { status?: Activity["status"] }) {
  if (!status) return null

  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
          Failed
        </Badge>
      )
    default:
      return null
  }
}

export function AllActivitiesDialog({
  open,
  onOpenChange,
  activities,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  activities: Activity[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 300)
  }

  const filteredActivities = activities.filter(
    (activity) =>
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>All Activities</DialogTitle>
          <DialogDescription>Recent activities from your team.</DialogDescription>
        </DialogHeader>
        <div className="relative mb-4">
          <Search
            className={`absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 ${isSearching ? "animate-pulse text-primary" : "text-muted-foreground"}`}
          />
          <Input
            placeholder="Search activities..."
            className="pl-8 transition-all focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {filteredActivities.length > 0 ? (
            <div className="space-y-4" role="log" aria-live="polite" aria-label="All activities">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      {activity.user.avatar ? (
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      ) : null}
                      <AvatarFallback>{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
                        {activity.target}
                        <StatusBadge status={activity.status} />
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <EmptyState icon={AlertCircle} title="No activities found" description="Try adjusting your search terms" />
          ) : (
            <EmptyState
              icon={Calendar}
              title="No activities yet"
              description="Activities will appear here as you and your team work"
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

