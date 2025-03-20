import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, CheckCircle2, Target } from "lucide-react"

const goals = [
  {
    id: 1,
    employee: {
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AM",
      position: "Senior Developer",
    },
    title: "Complete Advanced React Training",
    description: "Finish the advanced React certification course",
    dueDate: "Sep 30, 2023",
    progress: 75,
    status: "In Progress",
  },
  {
    id: 2,
    employee: {
      name: "Taylor Swift",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TS",
      position: "Marketing Specialist",
    },
    title: "Increase Social Media Engagement",
    description: "Achieve 20% increase in social media engagement",
    dueDate: "Oct 15, 2023",
    progress: 60,
    status: "In Progress",
  },
  {
    id: 3,
    employee: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
      position: "Product Manager",
    },
    title: "Launch New Product Feature",
    description: "Successfully launch the new product feature",
    dueDate: "Nov 1, 2023",
    progress: 40,
    status: "In Progress",
  },
  {
    id: 4,
    employee: {
      name: "Casey Zhang",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CZ",
      position: "UX Designer",
    },
    title: "Redesign User Dashboard",
    description: "Complete the redesign of the user dashboard",
    dueDate: "Aug 30, 2023",
    progress: 90,
    status: "In Progress",
  },
  {
    id: 5,
    employee: {
      name: "Jamie Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JR",
      position: "Sales Executive",
    },
    title: "Exceed Quarterly Sales Target",
    description: "Exceed the quarterly sales target by 15%",
    dueDate: "Sep 30, 2023",
    progress: 85,
    status: "In Progress",
  },
  {
    id: 6,
    employee: {
      name: "Morgan Freeman",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MF",
      position: "HR Specialist",
    },
    title: "Implement New Onboarding Process",
    description: "Roll out the new employee onboarding process",
    dueDate: "Jul 31, 2023",
    progress: 100,
    status: "Completed",
  },
]

export function GoalTracking() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">Showing goals for all employees</div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge
                  variant={
                    goal.status === "Completed" ? "default" : goal.status === "Overdue" ? "destructive" : "outline"
                  }
                >
                  {goal.status}
                </Badge>
                {goal.status === "Completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </div>
              <div className="pt-2">
                <CardTitle className="text-base">{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={goal.employee.avatar} alt={goal.employee.name} />
                  <AvatarFallback>{goal.employee.initials}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{goal.employee.name}</div>
                  <div className="text-muted-foreground">{goal.employee.position}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Due: {goal.dueDate}</span>
                  </div>
                  <div className="font-medium">{goal.progress}%</div>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={goal.status === "Completed" ? "outline" : "default"} className="w-full">
                {goal.status === "Completed" ? "View Details" : "Update Progress"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

