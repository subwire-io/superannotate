"use client"

import { useState } from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subMonths, parseISO } from "date-fns"

interface ExpenseTrendsProps {
  expenses?: Array<{
    id: string
    date: string
    description: string
    category: string
    amount: number
  }>
}

export function ExpenseTrends({ expenses = [] }: ExpenseTrendsProps) {
  const [timeRange, setTimeRange] = useState("6months")

  // Get unique categories
  const categories = Array.from(new Set((expenses || []).map((expense) => expense.category)))

  // Filter expenses based on time range
  const filterExpensesByTimeRange = () => {
    const now = new Date()
    let cutoffDate: Date

    switch (timeRange) {
      case "3months":
        cutoffDate = subMonths(now, 3)
        break
      case "6months":
        cutoffDate = subMonths(now, 6)
        break
      case "1year":
        cutoffDate = subMonths(now, 12)
        break
      default:
        cutoffDate = subMonths(now, 6)
    }

    return (expenses || []).filter((expense) => new Date(expense.date) >= cutoffDate)
  }

  // Group expenses by month and category
  const getChartData = () => {
    const filteredExpenses = filterExpensesByTimeRange()
    const monthlyData: Record<string, Record<string, number>> = {}

    // Initialize months
    const now = new Date()
    let months = 6
    if (timeRange === "3months") months = 3
    if (timeRange === "1year") months = 12

    for (let i = 0; i < months; i++) {
      const date = subMonths(now, i)
      const monthKey = format(date, "yyyy-MM")
      monthlyData[monthKey] = { name: format(date, "MMM yyyy") }

      // Initialize all categories to 0
      categories.forEach((category) => {
        monthlyData[monthKey][category] = 0
      })
    }

    // Sum expenses by month and category
    filteredExpenses.forEach((expense) => {
      const date = parseISO(expense.date)
      const monthKey = format(date, "yyyy-MM")

      if (monthlyData[monthKey]) {
        if (!monthlyData[monthKey][expense.category]) {
          monthlyData[monthKey][expense.category] = 0
        }
        monthlyData[monthKey][expense.category] += expense.amount
      }
    })

    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a, b) => {
      return new Date(a.name).getTime() - new Date(b.name).getTime()
    })
  }

  const chartData = getChartData()

  // Generate a color for each category
  const getCategoryColor = (index: number) => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--destructive))",
      "hsl(var(--warning))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))",
      "hsl(var(--muted))",
      "hsl(var(--success))",
    ]
    return colors[index % colors.length]
  }

  // If no data or categories, show a message
  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-[450px] text-muted-foreground">No expense data available</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            height={30}
            tickMargin={5}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={50}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold", marginBottom: "6px" }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "10px" }}
            iconSize={10}
            iconType="circle"
          />

          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              name={category}
              stroke={getCategoryColor(index)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

