"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, BarChart3, CalendarDays, BriefcaseBusiness, Home, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar({
  className,
  isSidebarOpen,
  toggleSidebar,
}: {
  className?: string
  isSidebarOpen: boolean
  toggleSidebar: () => void
}) {
  const pathname = usePathname()
  const isMobile = useMobile()

  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/employees",
      icon: Users,
      label: "Employees",
    },
    {
      href: "/attendance",
      icon: CalendarDays,
      label: "Attendance",
    },
    {
      href: "/performance",
      icon: BarChart3,
      label: "Performance",
    },
    {
      href: "/recruitment",
      icon: BriefcaseBusiness,
      label: "Recruitment",
    },
  ]

  if (isMobile && !isSidebarOpen) {
    return null
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar} aria-hidden="true" />
      )}

      <div
        className={cn(
          "pb-12 min-h-screen bg-background border-r flex flex-col",
          isMobile ? "fixed z-50 w-64 max-w-[80vw]" : "w-64",
          className,
        )}
      >
        <div className="flex h-16 items-center px-4 border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BriefcaseBusiness className="h-6 w-6" />
            <span className="text-xl">HR System</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="space-y-4 py-4 flex flex-col h-full overflow-y-auto">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                    pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

