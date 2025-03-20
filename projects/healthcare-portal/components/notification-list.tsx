import { Clock } from "lucide-react"

export default function NotificationList() {
  const notifications = [
    {
      id: 1,
      title: "Prescription Refill Approved",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "New message from Dr. Johnson",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Lab results uploaded",
      time: "2 days ago",
    },
  ]

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-2 pb-2 last:pb-0 last:border-0 border-b">
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

