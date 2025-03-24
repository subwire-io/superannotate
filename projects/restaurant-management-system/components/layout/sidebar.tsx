"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, ClipboardList, Home, LayoutGrid, MenuSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
  isMobile?: boolean
}

export function Sidebar({ className, isCollapsed = false, isMobile = false }: SidebarProps) {
  const pathname = usePathname()

  //  isCollapsed = false, isMobile = false }: SidebarProps)
  // const pathname = usePathname()

  // Reduced navigation items to essential pages only
  const navItems = [
    {
      name: "Dashboard",
      href: "/", // Updated to point to root path instead of /dashboard
      icon: Home,
    },
    {
      name: "Tables",
      href: "/tables",
      icon: LayoutGrid,
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
  ]

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r bg-background",
        isCollapsed ? "w-[80px]" : "w-[240px]",
        isMobile ? "fixed inset-y-0 left-0 z-50" : "",
        className,
        isMobile ? "block" : "hidden md:block",
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
                (pathname === item.href || (item.href === "/" && pathname === "/dashboard")) &&
                  "bg-accent text-accent-foreground",
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
  )
}

