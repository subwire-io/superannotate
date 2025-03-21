"use client"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const { toast } = useToast()

  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: "Your cart is currently empty",
    })
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold hover-brightness">
            ShopNow
          </Link>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleCartClick} className="hover-brightness">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

