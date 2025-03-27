"use client"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface BudgetVsActualChartProps {
  data?: Array<{
    category: string
    budgeted: number
    actual: number
    remaining: number
    progress: number
  }>
}

export function BudgetVsActualChart({ data = [] }: BudgetVsActualChartProps) {
  const isMobile = useIsMobile()

  // Format data for the chart - for mobile, abbreviate category names
  const chartData = (data || []).map((item) => ({
    name: isMobile ? abbreviateCategory(item.category) : item.category,
    fullName: item.category, // Keep full name for tooltip
    Budgeted: item.budgeted,
    Actual: item.actual,
  }))

  // If no data, show a message instead of an empty chart
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No budget data available</div>
  }

  if (isMobile) {
    return (
      <div className="space-y-4 px-2">
        <h3 className="text-lg font-medium">Budget vs Actual</h3>
        <div className="overflow-hidden rounded-md bg-card px-1 pt-1 pb-2">
          <div className="grid grid-cols-3 bg-muted/80 px-4 py-3 mb-1 rounded-t-sm">
            <div className="font-medium text-sm">Category</div>
            <div className="font-medium text-sm text-right">Budgeted</div>
            <div className="font-medium text-sm text-right">Actual</div>
          </div>
          <div className="space-y-1">
            {chartData.map((item, index) => (
              <div key={item.fullName} className={cn("grid grid-cols-3 px-4 py-3", index !== 0 && "border-t")}>
                <div className="text-sm truncate pr-2">{item.fullName}</div>
                <div className="text-sm text-right">${item.Budgeted.toFixed(0)}</div>
                <div className="text-sm text-right">${item.Actual.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={isMobile ? { top: 10, right: 10, left: 0, bottom: 50 } : { top: 10, right: 10, left: 0, bottom: 40 }}
        barGap={8}
        barCategoryGap={16}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={isMobile ? 10 : 12}
          tickLine={false}
          axisLine={false}
          height={isMobile ? 50 : 40}
          tickMargin={5}
          angle={isMobile ? -45 : -45}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          stroke="#888888"
          fontSize={isMobile ? 10 : 12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={isMobile ? 40 : 50}
          // Limit the number of ticks on mobile
          tickCount={isMobile ? 4 : 6}
        />
        <Tooltip
          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
          labelFormatter={(label, payload) => {
            // Use the full category name in tooltip
            if (payload && payload.length > 0) {
              return payload[0].payload.fullName
            }
            return label
          }}
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
          wrapperStyle={{
            fontSize: isMobile ? "10px" : 12,
            paddingTop: "10px",
            bottom: isMobile ? -45 : -35,
          }}
          iconSize={isMobile ? 8 : 10}
          align="center"
          verticalAlign="bottom"
          layout={isMobile ? "horizontal" : "horizontal"}
        />
        <Bar
          dataKey="Budgeted"
          name="Budgeted"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          maxBarSize={isMobile ? 30 : 40}
        />
        <Bar
          dataKey="Actual"
          name="Actual"
          fill="hsl(var(--destructive))"
          radius={[4, 4, 0, 0]}
          maxBarSize={isMobile ? 30 : 40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Helper function to abbreviate category names for mobile
function abbreviateCategory(category: string): string {
  const abbreviations: Record<string, string> = {
    Housing: "House",
    Transportation: "Trans",
    Entertainment: "Ent",
    Utilities: "Util",
    Healthcare: "Health",
    Education: "Edu",
    Personal: "Pers",
    "Dining Out": "Dining",
    Groceries: "Groc",
    Insurance: "Ins",
    Subscriptions: "Subs",
  }

  return abbreviations[category] || category.substring(0, 4)
}

