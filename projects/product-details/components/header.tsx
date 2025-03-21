"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            ShopNow
          </Link>
          <nav className="ml-10 hidden space-x-4 md:flex">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Deals
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Search products..." className="w-full md:w-[200px]" />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={handleAccountClick}>
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={handleCartClick}>
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <SheetClose asChild>
                  <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                    Products
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                    Categories
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                    Deals
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

