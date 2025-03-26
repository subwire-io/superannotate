"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { EmployeeCard } from "@/components/employee-card"
import { toast } from "sonner"

// Sample employee data
const initialEmployeesData = [
  {
    id: "1",
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Michael Brown",
    position: "UX Designer",
    department: "Design",
    email: "michael.brown@example.com",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "Emily Davis",
    position: "HR Manager",
    department: "Human Resources",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    name: "Robert Wilson",
    position: "Product Manager",
    department: "Product",
    email: "robert.wilson@example.com",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    name: "Jennifer Lee",
    position: "Financial Analyst",
    department: "Finance",
    email: "jennifer.lee@example.com",
    phone: "+1 (555) 678-9012",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [department, setDepartment] = useState("all")
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
  })

  // Load employees from localStorage on initial render
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees")
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees)
      setEmployees(parsedEmployees)
      setFilteredEmployees(parsedEmployees)
    } else {
      // If no stored employees, use initial data
      setEmployees(initialEmployeesData)
      setFilteredEmployees(initialEmployeesData)
    }
  }, [])

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem("employees", JSON.stringify(employees))
    }
  }, [employees])

  // Apply filters whenever search query or department changes
  useEffect(() => {
    applyFilters()
  }, [searchQuery, department, employees])

  const applyFilters = () => {
    let filtered = [...employees]

    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query) ||
          employee.department.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query),
      )
    }

    // Apply department filter if not "all"
    if (department !== "all") {
      filtered = filtered.filter((emp) => emp.department === department)
    }

    setFilteredEmployees(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDepartment("all")
    setFilteredEmployees(employees)
  }

  const handleAddEmployee = () => {
    // Validate form
    if (!newEmployee.name || !newEmployee.position || !newEmployee.department || !newEmployee.email) {
      toast.error("Please fill in all required fields")
      return
    }

    const newEmployeeData = {
      id: (employees.length + 1).toString(),
      ...newEmployee,
      avatar: "/placeholder.svg?height=100&width=100",
    }

    const updatedEmployees = [...employees, newEmployeeData]
    setEmployees(updatedEmployees)
    setFilteredEmployees(updatedEmployees)

    // Reset form
    setNewEmployee({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
    })

    // Show success toast
    toast.success(`${newEmployee.name} has been added successfully.`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter the details of the new employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  placeholder="Senior Developer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="john.smith@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddEmployee}>Add Employee</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || department !== "all") && (
                <Button variant="outline" onClick={clearFilters} type="button">
                  Clear Filters
                </Button>
              )}
            </div>
          </form>

          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No employees found matching your filters.</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

