"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinance } from "@/lib/data-context"

export function ExpenseChart() {
  const { expenses } = useFinance()

  // Process expenses data for the chart
  const processExpenseData = () => {
    const categoryTotals: Record<string, number> = {}

    expenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount
      } else {
        categoryTotals[expense.category] = expense.amount
      }
    })

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount: Number(amount.toFixed(2)),
    }))
  }

  const data = processExpenseData()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          height={50}
          tickMargin={8}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={60}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Bar dataKey="amount" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" maxBarSize={60} />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          formatter={(value: number) => [`$${value}`, "Amount"]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          wrapperStyle={{ zIndex: 10 }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

