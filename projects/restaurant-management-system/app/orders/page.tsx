"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { formatCurrency } from "@/lib/utils"
import { orders } from "@/data/mock-data"
import type { Order, OrderItem } from "@/types"

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [searchText, setSearchText] = useState<string>("")
  const [orderData, setOrderData] = useState<Order[]>(orders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Check localStorage for any new orders on component mount
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem("restaurantOrders")
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders)
        setOrderData(parsedOrders)
      }
    } catch (error) {
      console.error("Failed to parse stored orders:", error)
    }
  }, [])

  // Filter orders based on status and search text
  const filteredOrders = orderData.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const matchesSearch =
      searchText === "" || order.id.includes(searchText) || order.tableNumber.toString().includes(searchText)

    return matchesStatus && matchesSearch
  })

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrderData((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast.success(`Order status updated to ${newStatus}`, {
      dismissible: true,
    })
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleDialogClose = () => {
    setIsDetailsOpen(false)
    // Only clear the selected order after the dialog is fully closed
    setTimeout(() => {
      setSelectedOrder(null)
    }, 300)
  }

  // Get CSS class for item status
  const getItemStatusClass = (status: OrderItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30"
      case "preparing":
        return "bg-blue-100 border-blue-500 dark:bg-blue-900/30"
      case "ready":
        return "bg-green-100 border-green-500 dark:bg-green-900/30"
      case "delivered":
      case "cancelled":
        return "bg-gray-100 border-gray-500 dark:bg-gray-900/30"
      default:
        return "bg-gray-100 border-gray-500"
    }
  }

  // Handle completing an order
  const handleCompleteOrder = (orderId: string) => {
    setOrderData((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "completed", updatedAt: new Date().toISOString() } : order,
      ),
    )
    toast.success("Order marked as completed", {
      dismissible: true,
    })

    // Close the dialog if it's the selected order
    if (selectedOrder?.id === orderId) {
      setIsDetailsOpen(false)
    }
  }

  // Format order ID to be shorter and more readable
  const formatOrderId = (id: string) => {
    // If it's a numeric ID or already short, just return it with a hash
    if (id.length <= 5 || !isNaN(Number(id))) {
      return `#${id}`
    }
    // For longer IDs, truncate and format
    return `#${id.substring(0, 4)}`
  }

  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="py-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Orders</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/orders/new">
              <Plus className="h-4 w-4 mr-2" /> New Order
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4" onValueChange={setStatusFilter}>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full">
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
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-6 w-full">
                  <div className="mx-auto max-w-md">
                    <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No active orders found</h3>
                    <p className="text-muted-foreground mt-1">No active orders match your current filters</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Server</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="transition-colors hover:bg-muted/30">
                          <TableCell className="font-medium">{formatOrderId(order.id)}</TableCell>
                          <TableCell>Table {order.tableNumber}</TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px]">{order.serverName}</div>
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="text-center p-2">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openOrderDetails(order)}
                                className="w-full sm:w-auto h-8 px-3"
                              >
                                Details
                              </Button>
                              {order.status === "active" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteOrder(order.id)}
                                  className="w-full sm:w-auto h-8 px-3 mt-1 sm:mt-0"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-6 w-full">
                  <div className="mx-auto max-w-md">
                    <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No completed orders found</h3>
                    <p className="text-muted-foreground mt-1">No completed orders match your current filters</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Server</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="transition-colors hover:bg-muted/30">
                          <TableCell className="font-medium">{formatOrderId(order.id)}</TableCell>
                          <TableCell>Table {order.tableNumber}</TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px]">{order.serverName}</div>
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="text-center p-2">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openOrderDetails(order)}
                                className="w-full sm:w-auto h-8 px-3"
                              >
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-6 w-full">
                  <div className="mx-auto max-w-md">
                    <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No orders found</h3>
                    <p className="text-muted-foreground mt-1">No orders match your current filters</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Server</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="transition-colors hover:bg-muted/30">
                          <TableCell className="font-medium">{formatOrderId(order.id)}</TableCell>
                          <TableCell>Table {order.tableNumber}</TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px]">{order.serverName}</div>
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="text-center p-2">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openOrderDetails(order)}
                                className="w-full sm:w-auto h-8 px-3"
                              >
                                Details
                              </Button>
                              {order.status === "active" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteOrder(order.id)}
                                  className="w-full sm:w-auto h-8 px-3 mt-1 sm:mt-0"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog - Separate from the conditional rendering */}
      <Dialog open={isDetailsOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order {formatOrderId(selectedOrder.id)} Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Table</p>
                    <p>Table {selectedOrder.tableNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Server</p>
                    <p className="break-words">{selectedOrder.serverName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="capitalize">{selectedOrder.status}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                  <div className="border rounded-md divide-y">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className={`p-3 pl-2 border-l-4 ${getItemStatusClass(item.status)}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">
                              {item.quantity}× {item.menuItemName}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="text-left sm:text-right whitespace-nowrap">
                            <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                            <p className="text-xs text-muted-foreground capitalize">{item.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <p>Total</p>
                  <p>{formatCurrency(selectedOrder.total)}</p>
                </div>

                {selectedOrder.status === "active" && (
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => handleCompleteOrder(selectedOrder.id)}>Complete Order</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

