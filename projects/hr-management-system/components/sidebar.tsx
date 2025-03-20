"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, Calendar, BarChart2, Briefcase, Home, Settings, Menu, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Performance", href: "/performance", icon: BarChart2 },
  { name: "Recruitment", href: "/recruitment", icon: Briefcase },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      <aside
        className={cn(
          "bg-card text-card-foreground w-64 border-r transition-all duration-300 ease-in-out",
          isMobile ? (isOpen ? "fixed inset-y-0 left-0 z-40" : "fixed -left-64") : "relative",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">HR Management</h1>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href} onClick={isMobile ? () => setIsOpen(false) : undefined}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 mb-1",
                      isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50",
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <span className="text-sm font-medium">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">HR Manager</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

