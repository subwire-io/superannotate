'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { DataTable } from '@/components/ui/data-table'
import { inventoryColumns } from '@/components/inventory/inventory-table-columns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'

interface InventoryTableProps {
  products: Product[]
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  
  // Get unique categories
  const categories = ['All', ...new Set(products.map(product => product.category))]
  
  // Filter products based on category and stock filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false
    }
    
    // Stock filter
    if (stockFilter === 'out-of-stock' && product.stock > 0) {
      return false
    }
    if (stockFilter === 'low-stock' && (product.stock === 0 || product.stock >= 10)) {
      return false
    }
    if (stockFilter === 'in-stock' && product.stock < 10) {
      return false
    }
    
    return true
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </div>
        <Button className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  category !== 'All' && (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock Status:</span>
            <Select
              value={stockFilter}
              onValueChange={(value) => setStockFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable 
          columns={inventoryColumns} 
          data={filteredProducts} 
          filterPlaceholder="Search products..."
          filterColumn="name"
        />
      </CardContent>
    </Card>
  )
}
