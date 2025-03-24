"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const reviews = [
  {
    id: 1,
    employee: {
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AM",
      position: "Senior Developer",
    },
    dueDate: "Aug 15, 2023",
    status: "Urgent",
  },
  {
    id: 2,
    employee: {
      name: "Taylor Swift",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TS",
      position: "Marketing Specialist",
    },
    dueDate: "Aug 18, 2023",
    status: "Upcoming",
  },
  {
    id: 3,
    employee: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
      position: "Product Manager",
    },
    dueDate: "Aug 20, 2023",
    status: "Upcoming",
  },
  {
    id: 4,
    employee: {
      name: "Casey Zhang",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CZ",
      position: "UX Designer",
    },
    dueDate: "Aug 22, 2023",
    status: "Scheduled",
  },
]

export function UpcomingReviews() {
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={review.employee.avatar} alt={review.employee.name} />
              <AvatarFallback>{review.employee.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{review.employee.name}</p>
              <p className="text-sm text-muted-foreground">{review.employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{review.dueDate}</span>
            </div>
            <Badge
              variant={
                review.status === "Urgent" ? "destructive" : review.status === "Upcoming" ? "outline" : "secondary"
              }
            >
              {review.status}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Review Started",
                  description: `Starting review for ${review.employee.name}`,
                })
              }}
            >
              Review
            </Button>
          </div>
        </div>
      ))}
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          // In a real app, this would navigate to the reviews page
          window.location.href = "/performance"
        }}
      >
        View All Reviews
      </Button>
    </div>
  )
}

