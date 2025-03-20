'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  BarChart4, 
  Users, 
  Package, 
  ShoppingCart, 
  Home 
} from 'lucide-react'

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart4
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
            pathname === item.href
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.name}
          <span className="sr-only">{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}
