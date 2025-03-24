"use client"

import { useState } from "react"
import { Bell, Search, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const { setTheme } = useTheme()
  const isMobile = useMobile()
  const [notifications] = useState([
    { id: 1, message: "New employee onboarding", time: "10 min ago" },
    { id: 2, message: "Performance review due", time: "1 hour ago" },
    { id: 3, message: "Meeting scheduled", time: "2 hours ago" },
  ])

  return (
    <header className="border-b bg-background p-2 md:p-4">
      <div className="flex items-center justify-between">
        {/* Add left spacer on mobile to balance the header */}
        {isMobile && <div className="w-9"></div>}

        {/* Center the search bar */}
        <div className={`relative ${isMobile ? "w-[60%] mx-auto" : "w-full max-w-md"}`}>
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-9 text-sm md:text-base" />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell size={18} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                  {notifications.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm">
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-4 cursor-pointer">
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

