"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinance } from "@/lib/data-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"

export function IncomeExpenseChart() {
  const { expenses } = useFinance()
  const isMobile = useIsMobile()
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

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

  // Update the mobile view to match the dark theme styling in the image
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden border border-border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 font-medium text-sm">Month</th>
                <th className="text-right px-6 py-4 font-medium text-sm">Income</th>
                <th className="text-right px-6 py-4 font-medium text-sm">Expenses</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.name} className="border-t border-border">
                  <td className="text-left px-6 py-4 text-sm">{item.name}</td>
                  <td className="text-right px-6 py-4 text-sm">${item.income}</td>
                  <td className="text-right px-6 py-4 text-sm">${item.expenses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barGap={0} barCategoryGap={10}>
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
          domain={[0, "dataMax + 500"]}
          allowDataOverflow={false}
        />
        <Tooltip
          formatter={(value: number) => [`$${value}`, ""]}
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
        <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={20} />
        <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

