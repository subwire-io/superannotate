"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"

interface BudgetChartProps {
  budgets: Array<{
    id: string
    category: string
    allocated: number
    spent: number
    remaining: number
    progress: number
  }>
  height?: number
}

export function BudgetChart({ budgets = [], height = 350 }: BudgetChartProps) {
  const isMobile = useIsMobile()

  // Process budget data for the chart
  const processBudgetData = () => {
    if (!budgets || budgets.length === 0) {
      return [] // Return empty array if budgets is undefined or empty
    }

    return budgets.map((budget) => ({
      name: budget.category,
      value: budget.allocated,
      color: getCategoryColor(budget.category),
    }))
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      // Financial categories
      Housing: "#4f46e5", // Indigo
      Food: "#ef4444", // Red
      Transportation: "#f59e0b", // Amber
      Utilities: "#10b981", // Emerald
      Entertainment: "#8b5cf6", // Violet
      Healthcare: "#06b6d4", // Cyan
      Personal: "#ec4899", // Pink
      Education: "#0ea5e9", // Sky blue
      "Dining Out": "#f97316", // Orange

      // Investment categories
      Stock: "#3b82f6", // Blue
      ETF: "#8b5cf6", // Violet
      "Mutual Fund": "#a855f7", // Purple
      Bond: "#14b8a6", // Teal
      Crypto: "#f59e0b", // Amber
      "Real Estate": "#84cc16", // Lime
      Commodity: "#eab308", // Yellow
      Other: "#64748b", // Slate
    }

    return colors[category] || "#3b82f6" // Default to blue
  }

  const data = processBudgetData()

  // If no data, show a message instead of an empty chart
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No budget data available</div>
  }

  // Custom label renderer to prevent overflow
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Only show label if segment is large enough and not on mobile
    if (percent < 0.08 || isMobile) return null

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        stroke="none"
        strokeWidth={0}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Calculate appropriate chart dimensions based on container height and mobile status
  const outerRadius = Math.min(height / 2.5, isMobile ? 100 : 140)

  // On mobile, only show the table view without the chart and without the redundant title
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-muted/80 px-6 py-4 border-b">
            <div className="font-medium text-sm">Category</div>
            <div className="font-medium text-sm text-right">Allocated</div>
          </div>
          <div className="bg-card">
            {data.map((item, index) => (
              <div
                key={item.name}
                className={`grid grid-cols-2 px-6 py-4 ${index !== data.length - 1 ? "border-b" : ""}`}
              >
                <div className="text-sm truncate pr-2">{item.name}</div>
                <div className="text-sm text-right font-medium">${item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 20, right: 20, bottom: isMobile ? 40 : 20, left: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={outerRadius * 0.4}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
          strokeWidth={1}
          stroke="#121212"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
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
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            paddingTop: 30,
            fontSize: "12px",
            width: "100%",
          }}
          iconSize={12}
          iconType="circle"
          formatter={(value) => (
            <span
              style={{
                color: "hsl(var(--foreground))",
                marginLeft: "4px",
                fontSize: "14px",
                fontWeight: "medium",
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

