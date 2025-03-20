import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, MapPin, Calendar, Star } from "lucide-react"

const candidates = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "JS",
    position: "Senior Developer",
    location: "San Francisco, CA",
    appliedDate: "Aug 5, 2023",
    stage: "Applied",
    skills: ["React", "TypeScript", "Node.js"],
    rating: 4,
  },
  {
    id: 2,
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "EJ",
    position: "UX Designer",
    location: "New York, NY",
    appliedDate: "Aug 7, 2023",
    stage: "Applied",
    skills: ["Figma", "UI/UX", "Prototyping"],
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "MB",
    position: "Product Manager",
    location: "Chicago, IL",
    appliedDate: "Aug 3, 2023",
    stage: "Screening",
    skills: ["Product Strategy", "Agile", "User Research"],
    rating: 4,
  },
  {
    id: 4,
    name: "Sarah Davis",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "SD",
    position: "Marketing Specialist",
    location: "Austin, TX",
    appliedDate: "Aug 8, 2023",
    stage: "Screening",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
    rating: 3,
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "DW",
    position: "Senior Developer",
    location: "Seattle, WA",
    appliedDate: "Jul 28, 2023",
    stage: "Interview",
    skills: ["Java", "Spring", "Microservices"],
    rating: 5,
  },
  {
    id: 6,
    name: "Jennifer Lee",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "JL",
    position: "Product Manager",
    location: "Boston, MA",
    appliedDate: "Jul 30, 2023",
    stage: "Interview",
    skills: ["Product Development", "Data Analysis", "Team Leadership"],
    rating: 4,
  },
]

export function CandidatesList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="product">Product Manager</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge variant="outline">{candidate.stage}</Badge>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= candidate.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Avatar>
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback>{candidate.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.position}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Applied: {candidate.appliedDate}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                  <DropdownMenuItem>Move to Next Stage</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Reject Candidate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

