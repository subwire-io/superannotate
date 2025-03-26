"use client"

import { useState, useEffect } from "react"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

interface HeaderProps {
  toggleSidebar: () => void
  title?: string
}

// Initial notifications
const initialNotifications = [
  {
    id: "1",
    title: "New Employee Added",
    description: "John Doe has been added to the system",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Performance Review Due",
    description: "3 performance reviews are due this week",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Attendance Alert",
    description: "Sarah Johnson has been absent for 3 days",
    time: "2 hours ago",
    read: false,
  },
]

export function Header({ toggleSidebar, title = "HR Dashboard" }: HeaderProps) {
  const isMobile = useMobile()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    } else {
      setNotifications(initialNotifications)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  // Filter to show only unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read)
  const unreadCount = unreadNotifications.length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    toast.success("Notification viewed")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background w-full">
      <div className="flex h-16 items-center px-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}

        {/* Title - centered on mobile, left-aligned on desktop */}
        {isMobile ? (
          <div className="flex-1 text-center font-semibold text-lg">{title}</div>
        ) : (
          <div className="flex-1 font-semibold text-lg">{title}</div>
        )}

        {/* Right-aligned actions */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="flex items-center text-xs">
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer p-0"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="p-3 w-full">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">{notification.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Static Avatar (not a button) */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

