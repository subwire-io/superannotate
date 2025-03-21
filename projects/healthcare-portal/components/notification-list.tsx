"use client"

import { Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationList() {
  const { toast } = useToast()

  const notifications = [
    {
      id: 1,
      title: "Prescription Refill Approved",
      time: "2 hours ago",
      link: "/prescriptions",
    },
    {
      id: 2,
      title: "New message from Dr. Johnson",
      time: "Yesterday",
      link: "/messages",
    },
    {
      id: 3,
      title: "Lab results uploaded",
      time: "2 days ago",
      link: "/medical-records",
    },
  ]

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    toast({
      title: "Notification",
      description: `Navigating to ${notification.title}...`,
    })
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start gap-2 pb-2 last:pb-0 last:border-0 border-b cursor-pointer hover:bg-accent/50 p-1 rounded-md transition-colors"
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="rounded-full bg-primary/10 p-1">
            <Clock className="h-3 w-3 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{notification.title}</p>
            <p className="text-xs text-muted-foreground">{notification.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

