import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, FileText, Calendar, MessageSquare } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "new_employee",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      department: "Engineering",
    },
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "review_completed",
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      department: "Marketing",
    },
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "meeting_scheduled",
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ER",
      department: "Product",
    },
    time: "Yesterday",
  },
  {
    id: 4,
    type: "feedback_submitted",
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DK",
      department: "Sales",
    },
    time: "Yesterday",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "new_employee":
      return <UserPlus className="h-4 w-4" />
    case "review_completed":
      return <FileText className="h-4 w-4" />
    case "meeting_scheduled":
      return <Calendar className="h-4 w-4" />
    case "feedback_submitted":
      return <MessageSquare className="h-4 w-4" />
    default:
      return null
  }
}

const getActivityText = (type: string, name: string) => {
  switch (type) {
    case "new_employee":
      return `${name} joined the company`
    case "review_completed":
      return `${name} completed a performance review`
    case "meeting_scheduled":
      return `${name} scheduled a team meeting`
    case "feedback_submitted":
      return `${name} submitted feedback`
    default:
      return ""
  }
}

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{getActivityText(activity.type, activity.user.name)}</p>
            <p className="text-sm text-muted-foreground">{activity.user.department}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            {getActivityIcon(activity.type)}
          </div>
        </div>
      ))}
    </div>
  )
}

