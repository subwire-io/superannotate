"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, LineChart, Menu, PieChart, Target, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/expenses",
      label: "Expenses",
      icon: CreditCard,
    },
    {
      href: "/budgets",
      label: "Budgets",
      icon: PieChart,
    },
    {
      href: "/investments",
      label: "Investments",
      icon: LineChart,
    },
    {
      href: "/goals",
      label: "Goals",
      icon: Target,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-none">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b px-6 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Finance Manager</span>
                </Link>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <nav className="grid gap-2 p-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6" />
          <span className="hidden md:inline-block">Finance Manager</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex md:gap-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}

