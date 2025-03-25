"use client"
import Link from "next/link"
import { CalendarDays, DollarSign, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

import { formatCurrency } from "@/lib/utils"
import { dashboardStats, orders, reservations } from "@/data/mock-data"

export function DashboardPage() {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="py-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12.3% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last week</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:border-primary/20">
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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1 transition-all hover:border-primary/20">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Showing the most recent 5 orders</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <ScrollArea className="w-full h-[250px]">
                <div className="min-w-[400px]">
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
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">No recent orders found</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full transition-all hover:bg-primary/90 hover:text-primary-foreground"
              asChild
            >
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1 transition-all hover:border-primary/20">
          <CardHeader>
            <CardTitle>Upcoming Reservations</CardTitle>
            <CardDescription>Next 5 confirmed reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <ScrollArea className="w-full h-[250px]">
                <div className="min-w-[400px]">
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
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">No upcoming reservations found</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full transition-all hover:bg-primary/90 hover:text-primary-foreground"
              asChild
            >
              <Link href="/tables">View All Reservations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage

