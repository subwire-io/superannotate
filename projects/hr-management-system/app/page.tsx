import { ArrowUpRight, ArrowDownRight, Calendar, CircleUser, FileText, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DashboardPage() {
  // Sample data
  const metrics = [
    {
      title: "Total Employees",
      value: "248",
      change: "+12%",
      increasing: true,
    },
    {
      title: "Active Employees",
      value: "235",
      change: "+5%",
      increasing: true,
    },
    {
      title: "On Leave",
      value: "13",
      change: "-2%",
      increasing: false,
    },
    {
      title: "Attendance Rate",
      value: "96%",
      change: "+1%",
      increasing: true,
    },
  ]

  const upcomingReviews = [
    {
      id: "1",
      name: "John Smith",
      position: "Senior Developer",
      department: "Engineering",
      date: "May 15, 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      position: "Marketing Specialist",
      department: "Marketing",
      date: "May 18, 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Michael Brown",
      position: "UX Designer",
      department: "Design",
      date: "May 20, 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const recentActivities = [
    {
      id: "1",
      action: "New employee added",
      name: "Emily Davis",
      time: "2 hours ago",
      icon: CircleUser,
    },
    {
      id: "2",
      action: "Performance review completed",
      name: "Robert Wilson",
      time: "Yesterday",
      icon: FileText,
    },
    {
      id: "3",
      action: "Leave request approved",
      name: "Jennifer Lee",
      time: "2 days ago",
      icon: Calendar,
    },
    {
      id: "4",
      action: "Job application received",
      name: "Thomas Moore",
      time: "3 days ago",
      icon: Mail,
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 max-w-full overflow-hidden">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`flex items-center text-sm ${metric.increasing ? "text-green-500" : "text-red-500"}`}>
                {metric.increasing ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Upcoming Performance Reviews</CardTitle>
            <CardDescription>Reviews scheduled for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-1">
              {upcomingReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b last:border-0"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1 mt-2 sm:mt-0">
                    <p className="font-medium leading-none text-base">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.position}</p>
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                      <Badge variant="outline" className="mr-2">
                        {review.department}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="px-4 sm:px-6 pt-2 pb-4">
            <Link href="/performance" className="w-full">
              <Button variant="default" className="w-full">
                View All Reviews
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 py-4 border-b last:border-0">
                  <div className="rounded-full bg-muted p-2 flex-shrink-0 h-9 w-9 flex items-center justify-center">
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

