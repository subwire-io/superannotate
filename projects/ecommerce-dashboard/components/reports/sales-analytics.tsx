'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { SalesData, CategorySales, RegionalSales } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface SalesAnalyticsProps {
  salesData: SalesData[]
  categorySales: CategorySales[]
  regionalSales: RegionalSales[]
}

export function SalesAnalytics({ salesData, categorySales, regionalSales }: SalesAnalyticsProps) {
  // Process sales data for charts
  const dailyData = salesData.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  // Weekly data (average per week)
  const weeklyData = []
  for (let i = 0; i < dailyData.length; i += 7) {
    const week = dailyData.slice(i, i + 7)
    if (week.length > 0) {
      const weekStart = week[0].date
      const weekEnd = week[week.length - 1].date
      const avgRevenue = week.reduce((sum, day) => sum + day.revenue, 0) / week.length
      const avgOrders = week.reduce((sum, day) => sum + day.orders, 0) / week.length

      weeklyData.push({
        date: `${weekStart} - ${weekEnd}`,
        revenue: avgRevenue,
        orders: avgOrders
      })
    }
  }

  // Monthly data (average per month)
  const monthlyData: any[] | undefined = []
  const months: { [month: string]: any } = {}

  dailyData.forEach(day => {
    const month = new Date(day.date).toLocaleDateString('en-US', { month: 'short' });
    months[month] = months[month] ?? { days: 0, revenue: 0, orders: 0 };
    months[month].days++;
    months[month].revenue += day.revenue;
    months[month].orders += day.orders;
  });

  Object.entries(months).forEach(([month, data]: [string, any]) => {
    monthlyData.push({
      date: month,
      revenue: data.revenue / data.days,
      orders: data.orders / data.days
    })
  })

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
        <CardDescription>Analyze your sales data across different time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="region">By Region</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue') return formatCurrency(Number(value))
                    return value
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="weekly" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue') return formatCurrency(Number(value))
                    return value
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Avg. Revenue"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Avg. Orders"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="monthly" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue') return formatCurrency(Number(value))
                    return value
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Avg. Revenue"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Avg. Orders"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="category" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySales}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="region" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionalSales}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
