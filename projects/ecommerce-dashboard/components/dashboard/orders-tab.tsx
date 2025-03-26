"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { Loader2, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { initialOrders } from "@/lib/data"
import { downloadCSV } from "@/lib/utils"

export function OrdersTab() {
  const [orders, setOrders] = useState(initialOrders)
  const [orderSearchTerm, setOrderSearchTerm] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [orderSort, setOrderSort] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showAddOrderDialog, setShowAddOrderDialog] = useState(false)

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Apply search filter
      if (
        orderSearchTerm &&
        !order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) &&
        !order.customer.toLowerCase().includes(orderSearchTerm.toLowerCase())
      ) {
        return false
      }

      // Apply status filter
      if (orderStatusFilter !== "all" && order.status.toLowerCase() !== orderStatusFilter.toLowerCase()) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (orderSort === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (orderSort === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (orderSort === "highest") {
        return Number.parseFloat(b.total.replace("$", "")) - Number.parseFloat(a.total.replace("$", ""))
      } else if (orderSort === "lowest") {
        return Number.parseFloat(a.total.replace("$", "")) - Number.parseFloat(b.total.replace("$", ""))
      }
      return 0
    })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  // Handle export functionality
  const handleExport = () => {
    setExportLoading(true)

    // Simulate export process
    setTimeout(() => {
      setExportLoading(false)
      const fileName = `orders_export_${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(orders, fileName)
    }, 1000)
  }

  // Handle adding a new order
  const handleAddOrder = () => {
    setShowAddOrderDialog(true)
    toast.info("Order creation dialog would open here", {
      description: "This functionality is not fully implemented in this demo",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-6">
        <div>
          <CardTitle className="text-xl mb-2">Orders</CardTitle>
          <CardDescription className="text-muted-foreground">Manage and track customer orders.</CardDescription>
        </div>
        <Button onClick={handleAddOrder} className="self-start sm:self-center">
          Add Order
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
              />
            </div>
            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={orderSort} onValueChange={setOrderSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Total</SelectItem>
              <SelectItem value="lowest">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filteredOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing"
                            ? "secondary"
                            : order.status === "Shipped"
                              ? "outline"
                              : order.status === "Cancelled"
                                ? "destructive"
                                : "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-2 text-lg font-semibold">No orders found</h3>
              <p className="text-sm text-muted-foreground">There are no orders matching your criteria.</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exportLoading}>
          {exportLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>Export CSV</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

