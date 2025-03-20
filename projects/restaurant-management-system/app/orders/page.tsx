"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardEdit, MoreHorizontal, Plus, Printer, Receipt, Search } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { orders } from "@/data/mock-data"
import type { Order, OrderItem } from "@/types"

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")

  // Filter orders based on status and search text
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const matchesSearch =
      searchText === "" || order.id.includes(searchText) || order.tableNumber.toString().includes(searchText)

    return matchesStatus && matchesSearch
  })

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    // In a real app, update the order status in the database
    console.log(`Changing order ${orderId} status to ${newStatus}`)
  }

  const renderItemStatus = (status: OrderItem["status"]) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
      preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
      ready: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
      delivered: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/orders/new">
              <Plus className="h-4 w-4 mr-2" /> New Order
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <TabsList>
            <TabsTrigger value="active" onClick={() => setStatusFilter("active")}>
              Active Orders
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setStatusFilter("completed")}>
              Completed Orders
            </TabsTrigger>
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
              All Orders
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No active orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>Table {order.tableNumber}</TableCell>
                        <TableCell>{order.serverName}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/orders/${order.id}`} className="flex w-full items-center">
                                  <ClipboardEdit className="mr-2 h-4 w-4" />
                                  Edit Order
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Receipt className="mr-2 h-4 w-4" />
                                Mark as Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No completed orders found
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>Table {order.tableNumber}</TableCell>
                        <TableCell>{order.serverName}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Select an order to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Sample Order</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Order #{orders[0].id}</DialogTitle>
                  <DialogDescription>
                    Table {orders[0].tableNumber} - {new Date(orders[0].createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <h3 className="font-medium">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders[0].items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.menuItemName}</div>
                                {item.specialInstructions && (
                                  <div className="text-xs text-muted-foreground">Note: {item.specialInstructions}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                            <TableCell>{renderItemStatus(item.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <div className="font-medium">Total</div>
                    <div className="font-bold">{formatCurrency(orders[0].total)}</div>
                  </div>
                  {orders[0].specialInstructions && (
                    <div className="border-t pt-4">
                      <h3 className="font-medium">Special Instructions</h3>
                      <p className="text-sm mt-1">{orders[0].specialInstructions}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <p>No orders available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

