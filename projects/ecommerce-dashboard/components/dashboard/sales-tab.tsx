"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
import { Loader2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { handleChartElementClick } from "@/lib/utils"
import { revenueData, salesData, categoryData, COLORS } from "@/lib/data"
import { downloadCSV } from "@/lib/utils"

export function SalesTab() {
  const isMobile = useIsMobile()
  const [exportLoading, setExportLoading] = useState(false)

  // Handle export functionality
  const handleExport = () => {
    setExportLoading(true)

    // Simulate export process
    setTimeout(() => {
      setExportLoading(false)
      const fileName = `sales_export_${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(salesData, fileName)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Sales Overview Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl mb-2">Sales Overview</CardTitle>
            {isMobile && (
              <CardDescription className="text-xs text-muted-foreground">Tap on points for details</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) => (isMobile ? value.substring(0, 1) : value)}
                    />
                    <YAxis
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 30 : 40}
                      tickFormatter={(value) => (isMobile ? `${value / 100}h` : value)}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ strokeDasharray: "3 3" }}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--color-sales)"
                      strokeWidth={2}
                      activeDot={{
                        r: 8,
                        onClick: (data) => handleChartElementClick(data.payload, "sales", isMobile),
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

      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl mb-2">Sales Performance</CardTitle>
          <CardDescription className="text-muted-foreground">Monthly sales performance metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueData.map((item, index) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>${item.revenue.toLocaleString()}</TableCell>
                  <TableCell>{salesData[index].sales}</TableCell>
                  <TableCell>
                    {index > 0 ? (
                      <div className="flex items-center">
                        {item.revenue > revenueData[index - 1].revenue ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1 h-4 w-4 text-green-500"
                            >
                              <line x1="7" y1="17" x2="17" y2="7"></line>
                              <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                            <span className="text-green-500">
                              +
                              {(
                                ((item.revenue - revenueData[index - 1].revenue) / revenueData[index - 1].revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1 h-4 w-4 text-red-500"
                            >
                              <line x1="7" y1="7" x2="17" y2="17"></line>
                              <polyline points="17 7 17 17 7 17"></polyline>
                            </svg>
                            <span className="text-red-500">
                              {(
                                ((item.revenue - revenueData[index - 1].revenue) / revenueData[index - 1].revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
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
    </div>
  )
}

