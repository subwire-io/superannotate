import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

const employees = [
  {
    id: 1,
    name: "Alex Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AM",
    position: "Senior Developer",
    department: "Engineering",
    email: "alex.morgan@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "Active",
    startDate: "Jan 15, 2020",
  },
  {
    id: 2,
    name: "Taylor Swift",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TS",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "taylor.swift@company.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    status: "Active",
    startDate: "Mar 22, 2021",
  },
  {
    id: 3,
    name: "Jordan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JL",
    position: "Product Manager",
    department: "Product",
    email: "jordan.lee@company.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    status: "Active",
    startDate: "Jun 10, 2019",
  },
  {
    id: 4,
    name: "Casey Zhang",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CZ",
    position: "UX Designer",
    department: "Design",
    email: "casey.zhang@company.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    status: "On Leave",
    startDate: "Sep 5, 2020",
  },
  {
    id: 5,
    name: "Jamie Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JR",
    position: "Sales Executive",
    department: "Sales",
    email: "jamie.rodriguez@company.com",
    phone: "+1 (555) 567-8901",
    location: "Austin, TX",
    status: "Active",
    startDate: "Feb 18, 2022",
  },
]

export function EmployeeList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Start Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.position}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{employee.department}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{employee.location}</TableCell>
              <TableCell className="hidden md:table-cell">{employee.startDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    employee.status === "Active" ? "default" : employee.status === "On Leave" ? "outline" : "secondary"
                  }
                >
                  {employee.status}
                </Badge>
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
                    <DropdownMenuItem asChild>
                      <Link href={`/employees/${employee.id}`}>View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem>Performance Review</DropdownMenuItem>
                    <DropdownMenuItem>Attendance Record</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

