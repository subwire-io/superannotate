import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    employee: {
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AM",
      position: "Senior Developer",
      department: "Engineering",
    },
    reviewType: "Annual",
    dueDate: "Aug 15, 2023",
    status: "Pending",
    rating: null,
  },
  {
    id: 2,
    employee: {
      name: "Taylor Swift",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TS",
      position: "Marketing Specialist",
      department: "Marketing",
    },
    reviewType: "Quarterly",
    dueDate: "Aug 18, 2023",
    status: "Pending",
    rating: null,
  },
  {
    id: 3,
    employee: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
      position: "Product Manager",
      department: "Product",
    },
    reviewType: "Annual",
    dueDate: "Aug 20, 2023",
    status: "Pending",
    rating: null,
  },
  {
    id: 4,
    employee: {
      name: "Casey Zhang",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CZ",
      position: "UX Designer",
      department: "Design",
    },
    reviewType: "Quarterly",
    dueDate: "Aug 22, 2023",
    status: "Scheduled",
    rating: null,
  },
  {
    id: 5,
    employee: {
      name: "Jamie Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JR",
      position: "Sales Executive",
      department: "Sales",
    },
    reviewType: "Annual",
    dueDate: "Jul 15, 2023",
    status: "Completed",
    rating: 4.5,
  },
  {
    id: 6,
    employee: {
      name: "Morgan Freeman",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MF",
      position: "HR Specialist",
      department: "HR",
    },
    reviewType: "Quarterly",
    dueDate: "Jul 10, 2023",
    status: "Completed",
    rating: 4.2,
  },
]

export function PerformanceReviews() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="pending" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
          </TabsList>
        </Tabs>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge
                  variant={
                    review.status === "Completed" ? "default" : review.status === "Pending" ? "destructive" : "outline"
                  }
                >
                  {review.status}
                </Badge>
                <Badge variant="outline">{review.reviewType}</Badge>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Avatar>
                  <AvatarImage src={review.employee.avatar} alt={review.employee.name} />
                  <AvatarFallback>{review.employee.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{review.employee.name}</CardTitle>
                  <CardDescription>{review.employee.position}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <CalendarDays className="h-4 w-4" />
                <span>Due: {review.dueDate}</span>
              </div>
              {review.rating !== null && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(review.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : star - 0.5 <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant={review.status === "Completed" ? "outline" : "default"} className="w-full">
                {review.status === "Completed" ? "View Review" : "Start Review"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

