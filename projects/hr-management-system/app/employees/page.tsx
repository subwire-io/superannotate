"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeList } from "@/components/employees/employee-list"
import { EmployeeGrid } from "@/components/employees/employee-grid"
import { Download, Upload, Filter, Search, SearchX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AddEmployeeForm } from "@/components/employees/add-employee-form"

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchPerformed(true)

    toast({
      title: "Search Performed",
      description: `Searching for "${searchQuery}" in ${selectedDepartment === "all" ? "all departments" : selectedDepartment}`,
    })
  }

  const handleExport = () => {
    toast({
      title: "Export Data",
      description: "Exporting employee data",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import Data",
      description: "Opening import data dialog",
    })
  }

  const handleFilterToggle = () => {
    toast({
      title: "Filter Options",
      description: "Toggling advanced filter options",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your employee directory</p>
        </div>
        <AddEmployeeForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>View and manage all employees in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <form className="flex flex-1 items-center gap-2" onSubmit={handleSearch}>
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Search employees..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <Button type="submit" variant="outline" size="icon" className="transition-all hover:bg-secondary">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleFilterToggle}
                className="transition-all hover:bg-secondary"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex items-center gap-2">
              <Select defaultValue="all" value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                className="transition-all hover:bg-secondary"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleImport}
                className="transition-all hover:bg-secondary"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {searchPerformed && searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md mb-6">
              <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground mt-2">
                We couldn't find any matches for "{searchQuery}". Try different keywords or filters.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSearchPerformed(false)
                }}
              >
                Clear Search
              </Button>
            </div>
          )}

          {!searchPerformed && (
            <Tabs defaultValue="grid">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger
                    value="grid"
                    className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    List
                  </TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">
                  Showing <strong>142</strong> employees
                </div>
              </div>
              <TabsContent value="grid" className="mt-6">
                <EmployeeGrid />
              </TabsContent>
              <TabsContent value="list" className="mt-6">
                <EmployeeList />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

