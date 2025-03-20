'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Product } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'

export const inventoryColumns: ColumnDef<Product>[] = [
  {
    id: 'product',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">{product.category}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      let badgeVariant = 'default'
      let badgeText = 'In Stock'

      if (stock === 0) {
        badgeVariant = 'destructive'
        badgeText = 'Out of Stock'
      } else if (stock < 10) {
        badgeVariant = 'outline'
        badgeText = 'Low Stock'
      }

      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{stock}</div>
          <Badge variant={badgeVariant as any}>{badgeText}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return <div className="font-medium">{formatCurrency(price)}</div>
    },
  },
  {
    accessorKey: 'sales',
    header: 'Sales',
    cell: ({ row }) => {
      const sales = row.getValue('sales') as number
      return <div className="font-medium">{formatNumber(sales)}</div>
    },
  },
  {
    id: 'stock-actions',
    header: 'Adjust Stock',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease stock</span>
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase stock</span>
          </Button>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit product</DropdownMenuItem>
            <DropdownMenuItem>View history</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Restock product</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Discontinue product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
