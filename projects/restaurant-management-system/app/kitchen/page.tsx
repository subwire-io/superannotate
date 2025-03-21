"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Clock } from "lucide-react"

import { orders } from "@/data/mock-data"
import type { OrderItem } from "@/types"
import { refreshData } from "@/lib/utils"

export default function KitchenPage() {
  const [activeOrders, setActiveOrders] = useState(orders)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

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

    toast({
      title: "Item status updated",
      description: `Item status changed to ${status}`,
    })
  }

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
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

  // Get order elapsed time
  const getOrderTime = (createdAt: string) => {
    const orderTime = new Date(createdAt)
    const now = new Date()
    const minutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000)

    return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kitchen Display</h1>
          <p className="text-muted-foreground">View and manage active orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="transition-all hover:shadow-md"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <CheckCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No active orders</h3>
          <p className="text-muted-foreground mt-1">
            All orders have been completed or no orders have been placed yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2 bg-muted/40">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Table {order.tableNumber}
                      <Badge variant="outline">#{order.id}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {order.serverName} • {getOrderTime(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className={`py-3 pl-2 border-l-4 ${getItemStatusClass(item.status)}`}>
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {item.quantity}× {item.menuItemName}
                      </div>
                      <Select
                        value={item.status}
                        onValueChange={(status) => updateItemStatus(order.id, item.id, status as OrderItem["status"])}
                      >
                        <SelectTrigger className="h-7 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {item.specialInstructions && (
                      <div className="text-sm text-muted-foreground mt-1">Note: {item.specialInstructions}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

