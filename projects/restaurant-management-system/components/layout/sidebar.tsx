"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarDays,
  ChefHat,
  ClipboardList,
  Home,
  LayoutGrid,
  MenuSquare,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
}

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Tables",
      href: "/tables",
      icon: LayoutGrid,
    },
    {
      name: "Reservations",
      href: "/reservations",
      icon: CalendarDays,
    },
    {
      name: "Menu",
      href: "/menu",
      icon: MenuSquare,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: ClipboardList,
    },
    {
      name: "Kitchen",
      href: "/kitchen",
      icon: ChefHat,
    },
    {
      name: "Staff",
      href: "/staff",
      icon: Users,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="w-10 h-10">
            <MenuSquare className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
          <div className="p-4 font-bold text-lg border-b">Restaurant Manager</div>
          <ScrollArea className="h-[calc(100vh-60px)]">
            <nav className="grid gap-1 p-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <aside
        className={cn(
          "h-screen md:flex flex-col border-r bg-background",
          isCollapsed ? "w-[80px]" : "w-[240px]",
          className,
          "hidden",
        )}
      >
        <div
          className={cn(
            "p-4 font-bold border-b flex items-center h-14",
            isCollapsed ? "justify-center text-sm" : "text-lg",
          )}
        >
          {isCollapsed ? "RM" : "Restaurant Manager"}
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground",
                  isCollapsed && "flex-col gap-1 py-3",
                )}
              >
                <item.icon className={cn("h-5 w-5", isCollapsed && "h-5 w-5")} />
                {!isCollapsed && item.name}
                {isCollapsed && <span className="text-xs">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}

