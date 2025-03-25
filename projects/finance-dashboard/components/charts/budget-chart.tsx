"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useFinance } from "@/lib/data-context"

export function BudgetChart() {
  const { budgets } = useFinance()

  // Process budget data for the chart
  const processBudgetData = () => {
    return budgets.map((budget) => ({
      name: budget.category,
      value: budget.allocated,
      color: getCategoryColor(budget.category),
    }))
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Housing: "hsl(var(--primary))",
      Food: "hsl(var(--destructive))",
      Transportation: "hsl(var(--warning))",
      Utilities: "hsl(var(--secondary))",
      Entertainment: "hsl(var(--accent))",
      Healthcare: "hsl(var(--muted))",
    }

    return colors[category] || "hsl(var(--primary))"
  }

  const data = processBudgetData()

  // Custom label renderer to prevent overflow
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Only show label if segment is large enough
    if (percent < 0.05) return null

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value}`, "Amount"]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 20 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

