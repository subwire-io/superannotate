"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, ClipboardList, Home, LayoutGrid, MenuSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 p-2 text-xs font-medium",
              pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

