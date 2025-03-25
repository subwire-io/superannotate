"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          height={40}
          tickMargin={8}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={60}
          domain={["dataMin - 500", "dataMax + 500"]}
          allowDataOverflow={false}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number) => [`$${value}`, "Value"]}
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
      </AreaChart>
    </ResponsiveContainer>
  )
}

