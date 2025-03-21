"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Mock navigation items
const navigationItems = [
  { name: "Home", href: "#" },
  { name: "Products", href: "#" },
  { name: "Categories", href: "#" },
  { name: "Deals", href: "#" },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const { toast } = useToast()

  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: "Your cart is currently empty",
    })
  }

  const handleAccountClick = () => {
    toast({
      title: "Account",
      description: "Please sign in to view your account",
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(true)
      // In a real app, you would fetch results here
      toast({
        title: "Search",
        description: `No results found for "${searchQuery}"`,
      })
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold hover-brightness">
            ShopNow
          </Link>
          <nav className="ml-10 hidden space-x-6 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium nav-link transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" variant="ghost" size="icon" className="ml-1">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchOpen(false)
                  setShowSearchResults(false)
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover-brightness">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={handleAccountClick} className="hover-brightness">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={handleCartClick} className="hover-brightness">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover-brightness">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

