"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const departmentPerformance = [
  { department: "Engineering", performance: 87, target: 85 },
  { department: "Marketing", performance: 82, target: 80 },
  { department: "Sales", performance: 91, target: 90 },
  { department: "Product", performance: 84, target: 85 },
  { department: "Design", performance: 88, target: 85 },
  { department: "HR", performance: 86, target: 85 },
  { department: "Finance", performance: 83, target: 85 },
]

const skillsData = [
  {
    employee: "Alex Morgan",
    technical: 90,
    communication: 75,
    teamwork: 85,
    problemSolving: 92,
    leadership: 70,
  },
  {
    employee: "Taylor Swift",
    technical: 70,
    communication: 95,
    teamwork: 88,
    problemSolving: 82,
    leadership: 78,
  },
  {
    employee: "Jordan Lee",
    technical: 85,
    communication: 90,
    teamwork: 92,
    problemSolving: 88,
    leadership: 94,
  },
]

const performanceTrends = [
  { month: "Jan", engineering: 82, marketing: 78, sales: 88 },
  { month: "Feb", engineering: 84, marketing: 80, sales: 87 },
  { month: "Mar", engineering: 83, marketing: 81, sales: 89 },
  { month: "Apr", engineering: 86, marketing: 79, sales: 90 },
  { month: "May", engineering: 85, marketing: 83, sales: 91 },
  { month: "Jun", engineering: 87, marketing: 82, sales: 90 },
  { month: "Jul", engineering: 87, marketing: 82, sales: 91 },
]

export function PerformanceMetrics() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Convert skills data to radar format
  const radarData = [
    { subject: "Technical", A: 90, B: 70, C: 85, fullMark: 100 },
    { subject: "Communication", A: 75, B: 95, C: 90, fullMark: 100 },
    { subject: "Teamwork", A: 85, B: 88, C: 92, fullMark: 100 },
    { subject: "Problem Solving", A: 92, B: 82, C: 88, fullMark: 100 },
    { subject: "Leadership", A: 70, B: 78, C: 94, fullMark: 100 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">Showing performance metrics for all departments</div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Performance scores by department vs targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={departmentPerformance}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                <XAxis dataKey="department" stroke={isDark ? "#888" : "#666"} />
                <YAxis stroke={isDark ? "#888" : "#666"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    color: isDark ? "#fff" : "#333",
                    border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                  }}
                />
                <Legend />
                <Bar dataKey="performance" fill="#8884d8" name="Performance" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Skills Assessment</CardTitle>
            <CardDescription>Comparison of key skills across employees</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid stroke={isDark ? "#444" : "#ddd"} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? "#888" : "#666" }} />
                <PolarRadiusAxis stroke={isDark ? "#444" : "#ddd"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    color: isDark ? "#fff" : "#333",
                    border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                  }}
                />
                <Radar name="Alex Morgan" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Taylor Swift" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="Jordan Lee" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Monthly performance trends by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={performanceTrends}
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
                <Bar dataKey="engineering" fill="#8884d8" name="Engineering" />
                <Bar dataKey="marketing" fill="#82ca9d" name="Marketing" />
                <Bar dataKey="sales" fill="#ffc658" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

