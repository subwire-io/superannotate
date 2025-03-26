"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMobile } from "@/hooks/use-mobile"
import { Separator } from "@/components/ui/separator"

export default function PerformancePage() {
  const [period, setPeriod] = useState("month")
  const [activeTab, setActiveTab] = useState("overview")
  const isMobile = useMobile()

  const handleGenerateReport = () => {
    toast.success("Performance report has been generated successfully.")
  }

  // Sample performance data
  const attendanceData = [
    { name: "Jan", attendance: 95 },
    { name: "Feb", attendance: 92 },
    { name: "Mar", attendance: 94 },
    { name: "Apr", attendance: 96 },
    { name: "May", attendance: 97 },
    { name: "Jun", attendance: 95 },
  ]

  const productivityData = [
    { name: "Jan", productivity: 78 },
    { name: "Feb", productivity: 75 },
    { name: "Mar", productivity: 80 },
    { name: "Apr", productivity: 82 },
    { name: "May", productivity: 85 },
    { name: "Jun", productivity: 83 },
  ]

  const qualityData = [
    { name: "Jan", quality: 82 },
    { name: "Feb", quality: 80 },
    { name: "Mar", quality: 85 },
    { name: "Apr", quality: 87 },
    { name: "May", quality: 90 },
    { name: "Jun", quality: 88 },
  ]

  // Sample goal completion data
  const goalCompletionData = [
    { name: "Completed", value: 68, color: "#4ade80" },
    { name: "In Progress", value: 22, color: "#facc15" },
    { name: "Not Started", value: 10, color: "#f87171" },
  ]

  // Sample top performers
  const topPerformers = [
    {
      id: "1",
      name: "John Smith",
      position: "Senior Developer",
      department: "Engineering",
      score: 95,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      position: "Marketing Specialist",
      department: "Marketing",
      score: 92,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Michael Brown",
      position: "UX Designer",
      department: "Design",
      score: 90,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Sample upcoming reviews
  const upcomingReviews = [
    {
      id: "1",
      name: "Emily Davis",
      position: "HR Manager",
      department: "Human Resources",
      date: "May 15, 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Robert Wilson",
      position: "Product Manager",
      department: "Product",
      date: "May 18, 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Jennifer Lee",
      position: "Financial Analyst",
      department: "Finance",
      date: "May 20, 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Sample review data for Reviews tab
  const reviewsData = [
    {
      id: "1",
      employee: "Emily Davis",
      position: "HR Manager",
      reviewType: "Annual",
      reviewer: "John Smith",
      status: "Scheduled",
      date: "May 15, 2023",
    },
    {
      id: "2",
      employee: "Robert Wilson",
      position: "Product Manager",
      reviewType: "Quarterly",
      reviewer: "Sarah Johnson",
      status: "Scheduled",
      date: "May 18, 2023",
    },
    {
      id: "3",
      employee: "Jennifer Lee",
      position: "Financial Analyst",
      reviewType: "Annual",
      reviewer: "Michael Brown",
      status: "Scheduled",
      date: "May 20, 2023",
    },
    {
      id: "4",
      employee: "David Miller",
      position: "Software Engineer",
      reviewType: "Quarterly",
      reviewer: "John Smith",
      status: "Completed",
      date: "April 10, 2023",
    },
    {
      id: "5",
      employee: "Lisa Wang",
      position: "Marketing Coordinator",
      reviewType: "Annual",
      reviewer: "Sarah Johnson",
      status: "Completed",
      date: "April 5, 2023",
    },
  ]

  // Sample goals data for Goals tab
  const goalsData = [
    {
      id: "1",
      title: "Increase team productivity by 15%",
      assignee: "John Smith",
      department: "Engineering",
      progress: 75,
      dueDate: "June 30, 2023",
    },
    {
      id: "2",
      title: "Reduce customer support response time to under 2 hours",
      assignee: "Emily Davis",
      department: "Customer Support",
      progress: 60,
      dueDate: "July 15, 2023",
    },
    {
      id: "3",
      title: "Launch new marketing campaign",
      assignee: "Sarah Johnson",
      department: "Marketing",
      progress: 40,
      dueDate: "August 1, 2023",
    },
    {
      id: "4",
      title: "Implement new HR onboarding process",
      assignee: "Robert Wilson",
      department: "Human Resources",
      progress: 90,
      dueDate: "May 31, 2023",
    },
    {
      id: "5",
      title: "Reduce operational costs by 10%",
      assignee: "Jennifer Lee",
      department: "Finance",
      progress: 30,
      dueDate: "September 30, 2023",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Performance</h1>
        <div className="flex gap-2">
          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Rate (%)</CardTitle>
                    <CardDescription>Monthly attendance percentage</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={period === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPeriod("month")}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={period === "quarter" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPeriod("quarter")}
                    >
                      Quarterly
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    attendance: {
                      label: "Attendance",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full max-w-full"
                >
                  <ResponsiveContainer width="99%" height="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="var(--color-attendance)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity & Quality Scores</CardTitle>
                <CardDescription>Monthly performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    productivity: {
                      label: "Productivity",
                      color: "hsl(var(--chart-2))",
                    },
                    quality: {
                      label: "Quality",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px] w-full max-w-full"
                >
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={[
                        ...productivityData.map((d) => ({
                          name: d.name,
                          productivity: d.productivity,
                          quality: qualityData.find((q) => q.name === d.name)?.quality,
                        })),
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="productivity" fill="var(--color-productivity)" />
                      <Bar dataKey="quality" fill="var(--color-quality)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Goal Completion</CardTitle>
                <CardDescription>Current status of team goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full max-w-full flex items-center justify-center">
                  <ResponsiveContainer width="99%" height="100%">
                    <PieChart>
                      <Pie
                        data={goalCompletionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {goalCompletionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Employees with highest performance scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer) => (
                    <div key={performer.id} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={performer.avatar} alt={performer.name} />
                        <AvatarFallback>
                          {performer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1 min-w-0">
                        <p className="font-medium leading-none truncate">{performer.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{performer.position}</p>
                      </div>
                      <Badge variant="outline">{performer.department}</Badge>
                      <div className="font-medium">{performer.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
              <CardDescription>Scheduled performance reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingReviews.map((review) => (
                  <div key={review.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-medium leading-none truncate">{review.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{review.position}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{review.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <Button variant="default" className="w-full" onClick={() => setActiveTab("reviews")}>
                View All Reviews
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Manage and schedule employee performance reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Review Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                {isMobile ? (
                  // Mobile view - card-based layout with improved spacing
                  <div className="divide-y">
                    {reviewsData.map((review) => (
                      <div key={review.id} className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-base">{review.employee}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{review.position}</p>
                          </div>
                          <Badge variant={review.status === "Completed" ? "outline" : "default"}>{review.status}</Badge>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                              Review Type
                            </span>
                            <span className="font-medium mt-1">{review.reviewType}</span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                              Date
                            </span>
                            <span className="font-medium mt-1">{review.date}</span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                              Reviewer
                            </span>
                            <span className="font-medium mt-1">{review.reviewer}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => toast.success("Review details would open here")}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop view - table layout
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted">
                        <th className="px-4 py-2 text-left font-medium">Employee</th>
                        <th className="px-4 py-2 text-left font-medium">Position</th>
                        <th className="px-4 py-2 text-left font-medium">Review Type</th>
                        <th className="px-4 py-2 text-left font-medium">Reviewer</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                        <th className="px-4 py-2 text-left font-medium">Date</th>
                        <th className="px-4 py-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reviewsData.map((review) => (
                        <tr key={review.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{review.employee}</td>
                          <td className="px-4 py-3">{review.position}</td>
                          <td className="px-4 py-3">{review.reviewType}</td>
                          <td className="px-4 py-3">{review.reviewer}</td>
                          <td className="px-4 py-3">
                            <Badge variant={review.status === "Completed" ? "outline" : "default"}>
                              {review.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{review.date}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success("Review details would open here")}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>Set and track employee and team goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {goalsData.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-5">
                        <div className="flex flex-col gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{goal.title}</h3>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <Badge variant="outline" className="bg-muted/50">
                                {goal.department}
                              </Badge>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <span className="font-medium mr-1">Due:</span> {goal.dueDate}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-medium">{goal.progress}%</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                            </div>
                          </div>

                          <Separator className="my-2" />

                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                              Assignee:
                            </span>
                            <span className="text-sm font-medium">{goal.assignee}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

