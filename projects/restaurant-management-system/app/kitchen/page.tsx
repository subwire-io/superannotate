"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

import { orders } from "@/data/mock-data"
import type { OrderItem } from "@/types"

export default function KitchenPage() {
  const [displayMode, setDisplayMode] = useState<string>("kitchen-display")
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
          <Select value={displayMode} onValueChange={setDisplayMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Display Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kitchen-display">Kitchen Display</SelectItem>
              <SelectItem value="queue">Queue Display</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Refresh</Button>
          <Button>Clear Completed</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {displayMode === "kitchen-display" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
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
                            onValueChange={(status) =>
                              updateItemStatus(order.id, item.id, status as OrderItem["status"])
                            }
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
                  <CardFooter className="bg-muted/40 justify-between">
                    <div className="text-sm text-muted-foreground">{order.items.length} items</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => {
                        // Mark all items as ready
                        setActiveOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o.id === order.id
                              ? {
                                  ...o,
                                  items: o.items.map((item) =>
                                    item.status === "pending" || item.status === "preparing"
                                      ? { ...item, status: "ready" }
                                      : item,
                                  ),
                                }
                              : o,
                          ),
                        )
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark All Ready
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Queue</CardTitle>
                  <CardDescription>All active orders in chronological order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/40 p-3 border-b flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              Table {order.tableNumber}
                              <span className="ml-2 text-sm text-muted-foreground">#{order.id}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">{getOrderTime(order.createdAt)}</div>
                          </div>
                          <Badge variant="outline">
                            {
                              order.items.filter((item) => item.status === "pending" || item.status === "preparing")
                                .length
                            }{" "}
                            pending
                          </Badge>
                        </div>
                        <div className="p-3 space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className={`p-2 border rounded-md ${item.status === "ready" ? "opacity-50" : ""}`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">
                                    {item.quantity}× {item.menuItemName}
                                  </span>
                                  {item.specialInstructions && (
                                    <div className="text-xs text-muted-foreground">
                                      Note: {item.specialInstructions}
                                    </div>
                                  )}
                                </div>
                                <Badge
                                  variant={
                                    item.status === "ready"
                                      ? "default"
                                      : item.status === "preparing"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders
              .filter((order) => order.items.some((item) => item.status === "pending"))
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>Table {order.tableNumber}</CardTitle>
                    <CardDescription>
                      Order #{order.id} • {getOrderTime(order.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {order.items
                      .filter((item) => item.status === "pending")
                      .map((item) => (
                        <div key={item.id} className="py-3">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {item.quantity}× {item.menuItemName}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemStatus(order.id, item.id, "preparing")}
                            >
                              Start Preparing
                            </Button>
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
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders
              .filter((order) => order.items.some((item) => item.status === "preparing"))
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>Table {order.tableNumber}</CardTitle>
                    <CardDescription>
                      Order #{order.id} • {getOrderTime(order.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {order.items
                      .filter((item) => item.status === "preparing")
                      .map((item) => (
                        <div key={item.id} className="py-3">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {item.quantity}× {item.menuItemName}
                            </div>
                            <Button size="sm" onClick={() => updateItemStatus(order.id, item.id, "ready")}>
                              Mark Ready
                            </Button>
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
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders
              .filter((order) => order.items.some((item) => item.status === "ready"))
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>Table {order.tableNumber}</CardTitle>
                    <CardDescription>
                      Order #{order.id} • {getOrderTime(order.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {order.items
                      .filter((item) => item.status === "ready")
                      .map((item) => (
                        <div key={item.id} className="py-3">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {item.quantity}× {item.menuItemName}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemStatus(order.id, item.id, "delivered")}
                            >
                              Mark Delivered
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

