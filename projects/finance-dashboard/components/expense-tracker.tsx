"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus, Search, Download } from "lucide-react"
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
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredExpenses, setFilteredExpenses] = useState(expenses)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Apply filters whenever expenses, searchQuery, date, or selectedCategory changes
  useEffect(() => {
    applyFilters()
    // Check if there are any active filters
    setHasActiveFilters(!!searchQuery || !!date || selectedCategory !== "all")
  }, [expenses, searchQuery, date, selectedCategory])

  // Filter expenses based on search query, date, and category
  const applyFilters = () => {
    let filtered = [...expenses]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) || expense.category.toLowerCase().includes(query),
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
    setHasActiveFilters(false)
  }

  // Get unique categories from expenses
  const categories = ["all", ...Array.from(new Set(expenses.map((expense) => expense.category)))]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
        <p className="text-muted-foreground">Track and manage your expenses</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-3 flex-wrap">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="w-full pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal h-10",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] h-10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" className="w-full sm:w-auto h-10" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" size="icon" title="Export expenses" className="flex-shrink-0 h-10 w-10">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export expenses</span>
            </Button>
            <Button onClick={() => setIsAddingExpense(true)} className="w-full sm:w-auto h-10">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full sm:w-auto overflow-x-auto h-11">
            <TabsTrigger value="all" className="h-9">
              All Expenses
            </TabsTrigger>
            <TabsTrigger value="categories" className="h-9">
              By Category
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense List</CardTitle>
                <CardDescription>View and manage all your expenses</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-2 px-2 pb-2">
                <ExpenseTable expenses={filteredExpenses} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Breakdown of your expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-2 px-2 pb-2">
                <ExpenseChart expenses={filteredExpenses} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isAddingExpense && <ExpenseForm onClose={() => setIsAddingExpense(false)} />}
    </div>
  )
}

