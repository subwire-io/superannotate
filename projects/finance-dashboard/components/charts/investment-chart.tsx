"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"

// This would typically come from an API with historical data
const data = [
  {
    name: "Jan",
    value: 7000,
  },
  {
    name: "Feb",
    value: 7200,
  },
  {
    name: "Mar",
    value: 7150,
  },
  {
    name: "Apr",
    value: 7300,
  },
  {
    name: "May",
    value: 7800,
  },
  {
    name: "Jun",
    value: 8000,
  },
  {
    name: "Jul",
    value: 8200,
  },
  {
    name: "Aug",
    value: 8450,
  },
]

export function InvestmentChart() {
  const isMobile = useIsMobile()
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden border border-border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 font-medium text-sm">Month</th>
                <th className="text-right px-6 py-4 font-medium text-sm">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.name} className="border-t border-border">
                  <td className="text-left px-6 py-4 text-sm">{item.name}</td>
                  <td className="text-right px-6 py-4 text-sm font-medium">${item.value.toFixed(2)}</td>
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
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={true}
          height={30}
          tickMargin={8}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={true}
          tickFormatter={(value) => `$${value}`}
          width={50}
          domain={["dataMin - 200", "dataMax + 200"]}
          allowDataOverflow={false}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
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
      </AreaChart>
    </ResponsiveContainer>
  )
}

