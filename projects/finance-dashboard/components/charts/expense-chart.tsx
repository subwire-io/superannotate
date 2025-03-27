"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"

interface ExpenseChartProps {
  expenses?: Array<{
    id: string
    date: string
    description: string
    category: string
    amount: number
  }>
}

export function ExpenseChart({ expenses = [] }: ExpenseChartProps) {
  const isMobile = useIsMobile()

  // Process expenses data for the chart
  const processExpenseData = () => {
    const categoryTotals: Record<string, number> = {}

    // Make sure expenses is an array before calling forEach
    if (!expenses || !Array.isArray(expenses)) {
      return []
    }

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

  // If no data, show a message instead of an empty chart
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">No expense data available</div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-medium mb-3">Expense Summary</h3>
        <div className="rounded-md border overflow-hidden shadow-sm">
          <div className="bg-muted/80 px-6 py-4 border-b">
            <div className="grid grid-cols-2">
              <div className="font-medium text-sm">Category</div>
              <div className="font-medium text-sm text-right">Amount</div>
            </div>
          </div>
          <div className="bg-card">
            {data.map((item, index) => (
              <div key={item.name} className={`px-6 py-4 ${index !== data.length - 1 ? "border-b" : ""}`}>
                <div className="grid grid-cols-2">
                  <div className="text-sm truncate pr-2">{item.name}</div>
                  <div className="text-sm text-right font-medium">${item.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          height={40}
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
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <Bar dataKey="amount" fill="currentColor" radius={[6, 6, 0, 0]} className="fill-primary" maxBarSize={60} />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            padding: "12px 16px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            fontSize: 12,
            color: "hsl(var(--foreground))",
            textAlign: "center",
            fontWeight: "500",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60px",
          }}
          itemStyle={{
            color: "hsl(var(--foreground))",
            textAlign: "center",
            padding: "2px 0",
            fontWeight: "500",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
          labelStyle={{
            color: "hsl(var(--foreground))",
            fontWeight: "bold",
            marginBottom: "8px",
            textAlign: "center",
            display: "block",
            width: "100%",
          }}
          separator=": "
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

