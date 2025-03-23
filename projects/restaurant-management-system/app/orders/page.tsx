"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { orders } from "@/data/mock-data"

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

  return (
    <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h1>
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

      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <TabsList className="w-full sm:w-auto">
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
              <ScrollArea className="w-full overflow-auto">
                <div className="min-w-[800px]">
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
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/orders/${order.id}`}>View Details</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="w-full overflow-auto">
                <div className="min-w-[800px]">
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
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="w-full overflow-auto">
                <div className="min-w-[800px]">
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
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

