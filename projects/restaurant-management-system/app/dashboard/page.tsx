"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUp, BarChart3, CalendarDays, Clock, DollarSign, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

import { formatCurrency, exportData, refreshData } from "@/lib/utils"
import { dashboardStats, orders, reservations } from "@/data/mock-data"

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Calculate current day stats
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get recent orders
  const recentOrders = orders.slice(0, 5)

  // Get upcoming reservations
  const upcomingReservations = reservations.filter((reservation) => reservation.status === "confirmed").slice(0, 5)

  const handleRefresh = async () => {
    setIsLoading(true)
    await refreshData()
    setIsLoading(false)
  }

  const handleExport = async () => {
    setIsExporting(true)
    await exportData("csv")
    setIsExporting(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="transition-all hover:shadow-md"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading} className="transition-all hover:shadow-md">
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="transition-all hover:bg-accent">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="transition-all hover:bg-accent">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="transition-all hover:bg-accent">
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+12.3% from yesterday</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardStats.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">+5.2% from last week</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservations Today</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.reservationsToday}</div>
                <p className="text-xs text-muted-foreground">+2 more than yesterday</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Showing the most recent 5 orders</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>Table {order.tableNumber}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-muted-foreground">No recent orders found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/orders" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    View All Orders
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="col-span-1 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Next 5 confirmed reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingReservations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingReservations.map((reservation) => (
                        <TableRow key={reservation.id} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">{reservation.customerName}</TableCell>
                          <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell className="text-right">{reservation.partySize} guests</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-muted-foreground">No upcoming reservations found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/reservations" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    View All Reservations
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Popular Menu Items</CardTitle>
                <CardDescription>Top selling items in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardStats.popularItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardStats.popularItems.map((item) => (
                        <TableRow key={item.itemName} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">{item.itemName}</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.count * 20.99)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-muted-foreground">No popular items data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-full lg:col-span-3 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
                <CardDescription>Live restaurant metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Occupancy Rate</span>
                    <span className="ml-auto">{dashboardStats.occupancyRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${dashboardStats.occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Kitchen Status</span>
                    <span className="ml-auto">5 orders in progress</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: "70%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Reservation Load</span>
                    <span className="ml-auto">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "85%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
              <CardDescription>Detailed statistics and trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Analytics charts and graphs would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
              <CardDescription>Generate and view restaurant reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Reports would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

