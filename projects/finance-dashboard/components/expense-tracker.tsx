"use client"

import { useState } from "react"
import { CalendarIcon, Plus, Search } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExpenseChart } from "@/components/charts/expense-chart"
import { ExpenseTable } from "@/components/tables/expense-table"
import { ExpenseForm } from "@/components/forms/expense-form"
import { cn } from "@/lib/utils"
import { useFinance } from "@/lib/data-context"

export function ExpenseTracker() {
  const { expenses } = useFinance()
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [date, setDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredExpenses, setFilteredExpenses] = useState(expenses)

  // Filter expenses based on search query, date, and category
  const handleSearch = () => {
    let filtered = [...expenses]

    if (searchQuery) {
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (date) {
      const dateString = format(date, "yyyy-MM-dd")
      filtered = filtered.filter((expense) => expense.date === dateString)
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory)
    }

    setFilteredExpenses(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setDate(undefined)
    setSelectedCategory("all")
    setFilteredExpenses(expenses)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
        <p className="text-muted-foreground">Track and manage your expenses</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date)
                    if (date) {
                      handleSearch()
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                handleSearch()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Dining Out">Dining Out</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={resetFilters}>
              Reset
            </Button>
          </div>
          <Button onClick={() => setIsAddingExpense(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense List</CardTitle>
                <CardDescription>View and manage all your expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Breakdown of your expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
                <CardDescription>Track how your expenses change over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ExpenseChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isAddingExpense && <ExpenseForm onClose={() => setIsAddingExpense(false)} />}
    </div>
  )
}

