import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, Edit, Trash, Users } from "lucide-react"

const jobPostings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    postedDate: "Aug 1, 2023",
    expiryDate: "Sep 1, 2023",
    status: "Active",
    applicants: 24,
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    postedDate: "Jul 25, 2023",
    expiryDate: "Aug 25, 2023",
    status: "Active",
    applicants: 18,
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    postedDate: "Jul 20, 2023",
    expiryDate: "Aug 20, 2023",
    status: "Active",
    applicants: 32,
  },
  {
    id: 4,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Full-time",
    postedDate: "Jul 15, 2023",
    expiryDate: "Aug 15, 2023",
    status: "Active",
    applicants: 15,
  },
  {
    id: 5,
    title: "Sales Executive",
    department: "Sales",
    location: "Austin, TX",
    type: "Full-time",
    postedDate: "Jul 10, 2023",
    expiryDate: "Aug 10, 2023",
    status: "Closed",
    applicants: 28,
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    type: "Full-time",
    postedDate: "Jul 5, 2023",
    expiryDate: "Aug 5, 2023",
    status: "Closed",
    applicants: 20,
  },
  {
    id: 7,
    title: "HR Coordinator",
    department: "HR",
    location: "Boston, MA",
    type: "Part-time",
    postedDate: "Jul 1, 2023",
    expiryDate: "Aug 1, 2023",
    status: "Filled",
    applicants: 22,
  },
]

export function JobPostings() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Posted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPostings.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                <TableCell className="hidden md:table-cell">{job.postedDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "Active" ? "default" : job.status === "Closed" ? "secondary" : "outline"}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{job.applicants}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        View Applicants
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

