"use client"

import { useState } from "react"
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
import { MoreHorizontal, UserX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const initialEmployees = [
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
  const [employees, setEmployees] = useState(initialEmployees)
  const [deletedEmployees, setDeletedEmployees] = useState<any[]>([])
  const { toast } = useToast()

  const handleViewProfile = (id: number) => {
    toast({
      title: "Profile Viewed",
      description: `Viewing profile for employee #${id}`,
    })
  }

  const handleEditProfile = (id: number) => {
    toast({
      title: "Edit Profile",
      description: `Editing profile for employee #${id}`,
    })
  }

  const handlePerformanceReview = (id: number) => {
    toast({
      title: "Performance Review",
      description: `Opening performance review for employee #${id}`,
    })
  }

  const handleAttendanceRecord = (id: number) => {
    toast({
      title: "Attendance Record",
      description: `Viewing attendance record for employee #${id}`,
    })
  }

  const handleDeleteEmployee = (id: number) => {
    const employeeToDelete = employees.find((emp) => emp.id === id)
    const updatedEmployees = employees.filter((emp) => emp.id !== id)

    setDeletedEmployees([...deletedEmployees, employeeToDelete])
    setEmployees(updatedEmployees)

    toast({
      title: "Employee Deleted",
      description: `${employeeToDelete?.name} has been removed`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEmployees([...updatedEmployees, employeeToDelete!])
            setDeletedEmployees(deletedEmployees.filter((emp) => emp.id !== id))
            toast({
              title: "Action Undone",
              description: `${employeeToDelete?.name} has been restored`,
            })
          }}
        >
          Undo
        </Button>
      ),
    })
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md">
        <UserX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No employees found</h3>
        <p className="text-muted-foreground mt-2">Get started by adding your first employee to the system.</p>
        <Button
          className="mt-4"
          onClick={() => {
            setEmployees(initialEmployees)
            toast({
              title: "Employees Restored",
              description: "All employees have been restored",
            })
          }}
        >
          Restore Employees
        </Button>
      </div>
    )
  }

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
            <TableRow key={employee.id} className="transition-colors hover:bg-muted/50">
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
                    <Button variant="ghost" size="icon" className="transition-all hover:bg-secondary">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleViewProfile(employee.id)}>View Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditProfile(employee.id)}>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePerformanceReview(employee.id)}>
                      Performance Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAttendanceRecord(employee.id)}>
                      Attendance Record
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                          Delete Employee
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the employee record and remove
                            the data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

