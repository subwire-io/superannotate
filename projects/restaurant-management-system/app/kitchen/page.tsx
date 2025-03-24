"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Clock } from "lucide-react"

import { orders } from "@/data/mock-data"
import type { OrderItem } from "@/types"

export default function KitchenPage() {
  const [activeOrders, setActiveOrders] = useState(orders)

  // Update order item status
  const updateItemStatus = (orderId: string, itemId: string, status: OrderItem["status"]) => {
    setActiveOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
            }
          : order,
      ),
    )

    toast.success(`Item status updated to ${status}`, {
      dismissible: true,
    })
  }

  // Get CSS class for item status
  const getItemStatusClass = (status: OrderItem["status"]) => {
    switch (status) {
      case "pending":
        return "border-yellow-500"
      case "preparing":
        return "border-blue-500"
      case "ready":
        return "border-green-500"
      case "delivered":
        return "border-gray-500"
      case "cancelled":
        return "border-red-500"
      default:
        return "border-gray-500"
    }
  }

  // Get time elapsed since order was created
  const getOrderTime = (createdAt: string) => {
    const orderTime = new Date(createdAt)
    const now = new Date()
    const minutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000)

    if (minutes < 60) {
      return `${minutes}m ago`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m ago`
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kitchen Display</h1>
          <p className="text-muted-foreground">View and manage active orders</p>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center w-full">
          <div className="mx-auto max-w-md">
            <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
              <CheckCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No active orders</h3>
            <p className="text-muted-foreground mt-1">
              All orders have been completed or no orders have been placed yet.
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="w-full h-[calc(100vh-150px)]">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-none bg-background/50 shadow-md">
                <CardHeader className="pb-0 pt-4 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Table {order.tableNumber}</h3>
                        <Badge variant="outline" className="ml-1">
                          #{order.id}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{order.serverName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{getOrderTime(order.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <div className="divide-y divide-border/30">
                    {order.items.map((item) => (
                      <div key={item.id} className={`py-4 px-4 border-l-4 ${getItemStatusClass(item.status)}`}>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-medium text-base">
                              {item.quantity}× {item.menuItemName}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-sm text-muted-foreground mt-1">Note: {item.specialInstructions}</p>
                            )}
                          </div>
                          <div className="min-w-[120px]">
                            <Select
                              value={item.status}
                              onValueChange={(status) =>
                                updateItemStatus(order.id, item.id, status as OrderItem["status"])
                              }
                            >
                              <SelectTrigger className="h-9 bg-background/50 border-none shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent align="end" sideOffset={5}>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

