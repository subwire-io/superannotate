"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ShoppingCart } from "lucide-react"
import {
  LineChart,
  PieChart,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Pagination } from "@/components/ui/pagination"
import { useIsMobile } from "@/hooks/use-mobile"
import { handleChartElementClick } from "@/lib/utils"
import { revenueData, categoryData, COLORS, initialOrders } from "@/lib/data"

export function OverviewTab() {
  const isMobile = useIsMobile()
  const [orders, setOrders] = useState(initialOrders)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(orders.length / itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl mb-2">Revenue Overview</CardTitle>
            {isMobile && (
              <CardDescription className="text-xs text-muted-foreground">Tap on points for details</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) => (isMobile ? value.substring(0, 1) : value)}
                    />
                    <YAxis
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 30 : 40}
                      tickFormatter={(value) => (isMobile ? `${value / 1000}k` : value)}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ strokeDasharray: "3 3" }}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      activeDot={{
                        r: 8,
                        onClick: (data) => handleChartElementClick(data.payload, "revenue", isMobile),
                      }}
                      isAnimationActive={!isMobile}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl mb-2">Sales by Category</CardTitle>
            {isMobile && (
              <CardDescription className="text-xs text-muted-foreground">Tap on segments for details</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-hidden">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 70 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => {
                        // On mobile, only show percentage
                        if (isMobile) {
                          return `${(percent * 100).toFixed(0)}%`
                        }
                        // On desktop, show name and percentage
                        return `${name} ${(percent * 100).toFixed(0)}%`
                      }}
                      onClick={(data) => handleChartElementClick(data, "category", isMobile)}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} units`, "Sales"]}
                      itemStyle={{ color: "var(--foreground)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl mb-2">Recent Orders</CardTitle>
          <CardDescription className="text-muted-foreground">
            You have {orders.length} orders this period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
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
        <CardFooter>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardFooter>
      </Card>
    </div>
  )
}

