"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinance } from "@/lib/data-context"

export function IncomeExpenseChart() {
  const { expenses } = useFinance()

  // Sample data for income vs expenses
  const data = [
    {
      name: "Jan",
      income: 5000,
      expenses: 3200,
    },
    {
      name: "Feb",
      income: 5200,
      expenses: 3400,
    },
    {
      name: "Mar",
      income: 5100,
      expenses: 3300,
    },
    {
      name: "Apr",
      income: 5300,
      expenses: 3600,
    },
    {
      name: "May",
      income: 5500,
      expenses: 3800,
    },
    {
      name: "Jun",
      income: 5400,
      expenses: 3700,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barGap={0} barCategoryGap={10}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          height={20}
          tickMargin={5}
        />
        <YAxis
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={40}
        />
        <Tooltip
          formatter={(value: number) => [`$${value}`, ""]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          wrapperStyle={{ zIndex: 10 }}
        />
        <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} iconSize={8} align="center" />
        <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={20} />
        <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

