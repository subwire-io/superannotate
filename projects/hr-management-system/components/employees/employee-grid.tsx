"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, Phone, MoreHorizontal, MapPin, UserX } from "lucide-react"
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
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "AM",
    position: "Senior Developer",
    department: "Engineering",
    email: "alex.morgan@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "Active",
  },
  {
    id: 2,
    name: "Taylor Swift",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "TS",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "taylor.swift@company.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    status: "Active",
  },
  {
    id: 3,
    name: "Jordan Lee",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "JL",
    position: "Product Manager",
    department: "Product",
    email: "jordan.lee@company.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    status: "Active",
  },
  {
    id: 4,
    name: "Casey Zhang",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "CZ",
    position: "UX Designer",
    department: "Design",
    email: "casey.zhang@company.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    status: "On Leave",
  },
  {
    id: 5,
    name: "Jamie Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "JR",
    position: "Sales Executive",
    department: "Sales",
    email: "jamie.rodriguez@company.com",
    phone: "+1 (555) 567-8901",
    location: "Austin, TX",
    status: "Active",
  },
  {
    id: 6,
    name: "Morgan Freeman",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "MF",
    position: "HR Specialist",
    department: "HR",
    email: "morgan.freeman@company.com",
    phone: "+1 (555) 678-9012",
    location: "Boston, MA",
    status: "Active",
  },
  {
    id: 7,
    name: "Riley Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "RJ",
    position: "Financial Analyst",
    department: "Finance",
    email: "riley.johnson@company.com",
    phone: "+1 (555) 789-0123",
    location: "Denver, CO",
    status: "Active",
  },
  {
    id: 8,
    name: "Avery Williams",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "AW",
    position: "Operations Manager",
    department: "Operations",
    email: "avery.williams@company.com",
    phone: "+1 (555) 890-1234",
    location: "Portland, OR",
    status: "Inactive",
  },
]

export function EmployeeGrid() {
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

  const handleDeactivate = (id: number) => {
    const employeeToDeactivate = employees.find((emp) => emp.id === id)
    const updatedEmployees = employees.map((emp) => (emp.id === id ? { ...emp, status: "Inactive" } : emp))

    setEmployees(updatedEmployees)

    toast({
      title: "Employee Deactivated",
      description: `${employeeToDeactivate?.name} has been deactivated`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEmployees(employees)
            toast({
              title: "Action Undone",
              description: `${employeeToDeactivate?.name} has been reactivated`,
            })
          }}
        >
          Undo
        </Button>
      ),
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {employees.map((employee) => (
        <Card
          key={employee.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
        >
          <CardHeader className="p-0">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback>{employee.initials}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              <Badge variant="outline" className="mt-2">
                {employee.department}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.location}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewProfile(employee.id)}
              className="transition-all hover:bg-primary hover:text-primary-foreground"
            >
              View Profile
            </Button>
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
                        This action cannot be undone. This will permanently delete the employee record and remove the
                        data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

