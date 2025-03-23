"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Minus, Plus, X } from "lucide-react"

import { formatCurrency, generateOrderNumber } from "@/lib/utils"
import { menuCategories, menuItems, tables } from "@/data/mock-data"
import type { MenuItem } from "@/types"
import Image from "next/image"

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableId = searchParams.get("table")

  const [selectedTable, setSelectedTable] = useState<string>(tableId || "")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [orderItems, setOrderItems] = useState<
    {
      menuItem: MenuItem
      quantity: number
      specialInstructions?: string
    }[]
  >([])

  // Get table details if a table was preselected
  useEffect(() => {
    if (tableId) {
      setSelectedTable(tableId)
    }
  }, [tableId])

  // Filter menu items based on category and search text
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory
    const matchesSearch =
      searchText === "" ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())

    return matchesCategory && matchesSearch && item.available
  })

  const addToOrder = (menuItem: MenuItem) => {
    const existingItemIndex = orderItems.findIndex((item) => item.menuItem.id === menuItem.id)

    if (existingItemIndex !== -1) {
      // If item already exists in order, increment its quantity
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += 1
      setOrderItems(updatedItems)
    } else {
      // Add new item to order
      setOrderItems([...orderItems, { menuItem, quantity: 1 }])
    }
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      const updatedItems = [...orderItems]
      updatedItems.splice(index, 1)
      setOrderItems(updatedItems)
    } else {
      // Update quantity
      const updatedItems = [...orderItems]
      updatedItems[index].quantity = newQuantity
      setOrderItems(updatedItems)
    }
  }

  const removeItem = (index: number) => {
    const updatedItems = [...orderItems]
    updatedItems.splice(index, 1)
    setOrderItems(updatedItems)
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    if (!selectedTable || orderItems.length === 0) {
      return
    }

    // In a real app, submit the order to the server
    console.log("Submitting order", {
      tableId: selectedTable,
      items: orderItems.map((item) => ({
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
        specialInstructions: item.specialInstructions,
      })),
      total: calculateTotal(),
    })

    // Navigate to orders page
    router.push("/orders")
  }

  return (
    <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-0">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Order</h1>
          <p className="text-muted-foreground">Create a new order for your customers</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Select items to add to the order</CardDescription>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {menuCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search menu items..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => addToOrder(item)}
                  >
                    <div className="flex h-24">
                      <div className="w-24 h-24 relative">
                        <Image
                          src={item.image || "/placeholder.svg?height=96&width=96"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {item.description.substring(0, 60)}
                          {item.description.length > 60 && "..."}
                        </div>
                        <div className="mt-1 font-bold">{formatCurrency(item.price)}</div>
                      </div>
                      {orderItems.some((orderItem) => orderItem.menuItem.id === item.id) && (
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs absolute top-2 right-2">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Order #{generateOrderNumber()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="table-select">Table</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable} required>
                  <SelectTrigger id="table-select">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        Table {table.number} - Seats {table.capacity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg">
                <div className="p-3 font-medium border-b">Order Items ({orderItems.length})</div>
                {orderItems.length === 0 ? (
                  <div className="p-3 text-center text-muted-foreground">No items added yet</div>
                ) : (
                  <div className="divide-y">
                    {orderItems.map((item, index) => (
                      <div key={`${item.menuItem.id}-${index}`} className="p-3">
                        <div className="flex justify-between">
                          <div className="font-medium">{item.menuItem.name}</div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeItem(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(item.menuItem.price)} × {item.quantity} ={" "}
                          {formatCurrency(item.menuItem.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 border-t pt-6">
              <div className="flex justify-between font-bold text-lg">
                <div>Total</div>
                <div>{formatCurrency(calculateTotal())}</div>
              </div>
              <Button size="lg" disabled={!selectedTable || orderItems.length === 0} onClick={handleSubmitOrder}>
                Submit Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

