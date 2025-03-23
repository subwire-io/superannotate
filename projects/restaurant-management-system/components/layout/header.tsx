"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/layout/sidebar"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {isSidebarOpen && <Sidebar isMobile={true} />}

      <header className="flex h-14 items-center gap-2 border-b bg-background px-2 sm:px-4 lg:px-6 z-10">
        <div className="md:hidden">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
        <div className="flex items-center gap-1 overflow-hidden">
          <Link href="/dashboard" className="font-semibold text-base md:text-lg truncate">
            Restaurant Manager
          </Link>
        </div>
        <div className="hidden md:flex ml-auto md:w-1/3 lg:w-1/4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full pl-8 bg-background" />
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 ml-auto md:ml-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          {isSearchOpen && (
            <div className="absolute inset-x-0 top-14 z-10 p-2 bg-background md:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full pl-8 bg-background" />
              </div>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New reservation for tonight</DropdownMenuItem>
              <DropdownMenuItem>Order #1234 needs attention</DropdownMenuItem>
              <DropdownMenuItem>Table 5 has requested service</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <Link href="/notifications" className="w-full text-center">
                  View all
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <User className="h-4 w-4" />
                <span className="sr-only">User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin User</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/login" className="w-full">
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}

