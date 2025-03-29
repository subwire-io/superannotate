"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { DollarSign, LineChartIcon, ShoppingCart, Users } from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { OrdersTab } from "@/components/dashboard/orders-tab"
import { InventoryTab } from "@/components/dashboard/inventory-tab"
import { CustomersTab } from "@/components/dashboard/customers-tab"
import { SalesTab } from "@/components/dashboard/sales-tab"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"

export default function Dashboard() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("overview")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background max-w-full">
      {/* Main dashboard content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">E-Commerce Dashboard</h1>
            {/* Mobile dropdown navigation */}
            <div className="md:hidden mt-2 mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isInitialLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Revenue"
                  value="$45,231.89"
                  icon={DollarSign}
                  change={{ value: "+20.1%", isPositive: true }}
                />
                <StatCard
                  title="Orders"
                  value="+2,350"
                  icon={ShoppingCart}
                  change={{ value: "+12.2%", isPositive: true }}
                />
                <StatCard
                  title="Customers"
                  value="+12,234"
                  icon={Users}
                  change={{ value: "+5.4%", isPositive: true }}
                />
                <StatCard
                  title="Conversion Rate"
                  value="3.2%"
                  icon={LineChartIcon}
                  change={{ value: "-0.5%", isPositive: false }}
                />
              </div>

              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="border-b hidden md:block">
                  <div className="container mx-auto px-0">
                    <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                      <TabsTrigger
                        value="overview"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="orders"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Orders
                      </TabsTrigger>
                      <TabsTrigger
                        value="inventory"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Inventory
                      </TabsTrigger>
                      <TabsTrigger
                        value="customers"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Customers
                      </TabsTrigger>
                      <TabsTrigger
                        value="sales"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Sales
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                {/* Tab Contents */}
                <TabsContent value="overview">
                  <OverviewTab />
                </TabsContent>

                <TabsContent value="orders">
                  <OrdersTab />
                </TabsContent>

                <TabsContent value="inventory">
                  <InventoryTab />
                </TabsContent>

                <TabsContent value="customers">
                  <CustomersTab />
                </TabsContent>

                <TabsContent value="sales">
                  <SalesTab />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>

      {/* Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

