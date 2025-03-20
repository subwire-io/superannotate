"use client"

import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", employees: 120, attendance: 94, hiring: 5 },
  { month: "Feb", employees: 125, attendance: 95, hiring: 8 },
  { month: "Mar", employees: 128, attendance: 93, hiring: 6 },
  { month: "Apr", employees: 130, attendance: 96, hiring: 4 },
  { month: "May", employees: 134, attendance: 97, hiring: 7 },
  { month: "Jun", employees: 138, attendance: 95, hiring: 9 },
  { month: "Jul", employees: 142, attendance: 96, hiring: 5 },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="month" stroke={isDark ? "#888" : "#666"} />
        <YAxis stroke={isDark ? "#888" : "#666"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#333",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="employees" name="Total Employees" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#82ca9d" />
        <Line type="monotone" dataKey="hiring" name="New Hires" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  )
}

