"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus, Download } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BudgetChart } from "@/components/charts/budget-chart"
import { BudgetTable } from "@/components/tables/budget-table"
import { BudgetForm } from "@/components/forms/budget-form"
import { cn } from "@/lib/utils"
import { useFinance } from "@/lib/data-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BudgetVsActualChart } from "@/components/charts/budget-vs-actual-chart"

export function BudgetPlanner() {
  const { budgets, expenses } = useFinance()
  const [isAddingBudget, setIsAddingBudget] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredBudgets, setFilteredBudgets] = useState(budgets)
  const [activeTab, setActiveTab] = useState("overview")
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Get unique categories from budgets
  const categories = ["all", ...Array.from(new Set(budgets.map((budget) => budget.category)))]

  // Apply filters whenever budgets, selectedMonth, or selectedCategory changes
  useEffect(() => {
    applyFilters()
    // Check if there are any active filters
    setHasActiveFilters(!!selectedMonth || selectedCategory !== "all")
  }, [budgets, selectedMonth, selectedCategory])

  // Filter budgets based on month and category
  const applyFilters = () => {
    let filtered = [...budgets]

    if (selectedMonth) {
      const monthYear = format(selectedMonth, "MMMM yyyy")
      // In a real app, budgets would have a period field to filter by
      // For now, we'll just simulate this filtering
      filtered = filtered.filter(() => true) // Placeholder for actual month filtering
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((budget) => budget.category === selectedCategory)
    }

    setFilteredBudgets(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedMonth(undefined)
    setSelectedCategory("all")
    setFilteredBudgets(budgets)
    setHasActiveFilters(false)
  }

  // Calculate budget vs actual spending for each category
  const getBudgetVsActual = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    return budgets.map((budget) => {
      // Filter expenses for the current month and matching category
      const categoryExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expense.category === budget.category &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        )
      })

      const actualSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        category: budget.category,
        budgeted: budget.allocated,
        actual: actualSpent,
        remaining: budget.allocated - actualSpent,
        progress: Math.min(100, Math.round((actualSpent / budget.allocated) * 100)),
      }
    })
  }

  const budgetVsActual = getBudgetVsActual()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
        <p className="text-muted-foreground">Create and manage your budgets</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-3 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal h-10",
                    !selectedMonth && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 text-center text-sm font-medium">
                  {/* Only show month and year in header */}
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select month"}
                </div>
                <div className="p-3">
                  {/* Custom month picker that only allows selecting months */}
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date()
                      date.setMonth(i)
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-9 w-full",
                            selectedMonth && selectedMonth.getMonth() === i ? "bg-primary text-primary-foreground" : "",
                          )}
                          onClick={() => {
                            const newDate = new Date()
                            newDate.setMonth(i)
                            setSelectedMonth(newDate)
                          }}
                        >
                          {format(date, "MMM")}
                        </Button>
                      )
                    })}
                  </div>
                </div>
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
            <Button variant="outline" size="icon" title="Export budgets" className="flex-shrink-0 h-10 w-10">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export budgets</span>
            </Button>
            <Button onClick={() => setIsAddingBudget(true)} className="w-full sm:w-auto h-10">
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full sm:w-auto overflow-x-auto h-11">
            <TabsTrigger value="overview" className="h-9">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="h-9">
              Budget Details
            </TabsTrigger>
            <TabsTrigger value="analysis" className="h-9">
              Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Total Budget</CardTitle>
                  <CardDescription>Monthly allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${filteredBudgets.reduce((sum, budget) => sum + budget.allocated, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ${filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0).toFixed(2)} spent so far
                  </p>
                  <div className="mt-5 h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0) / filteredBudgets.reduce((sum, budget) => sum + budget.allocated, 0)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.min(
                      100,
                      Math.round(
                        (filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0) /
                          filteredBudgets.reduce((sum, budget) => sum + budget.allocated, 0)) *
                          100,
                      ),
                    )}
                    % of budget used
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Remaining</CardTitle>
                  <CardDescription>Available to spend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${filteredBudgets.reduce((sum, budget) => sum + budget.remaining, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ${(filteredBudgets.reduce((sum, budget) => sum + budget.remaining, 0) / 30).toFixed(2)} per day for
                    the rest of the month
                  </p>
                  <div className="mt-5 h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((filteredBudgets.reduce((sum, budget) => sum + budget.remaining, 0) / filteredBudgets.reduce((sum, budget) => sum + budget.allocated, 0)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.min(
                      100,
                      Math.round(
                        (filteredBudgets.reduce((sum, budget) => sum + budget.remaining, 0) /
                          filteredBudgets.reduce((sum, budget) => sum + budget.allocated, 0)) *
                          100,
                      ),
                    )}
                    % of budget remaining
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>Budget warnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">
                    {filteredBudgets.filter((budget) => budget.progress >= 75 && budget.progress < 100).length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Categories approaching limit</p>
                  <div className="mt-5 space-y-3">
                    {filteredBudgets
                      .filter((budget) => budget.progress >= 75 && budget.progress < 100)
                      .slice(0, 2)
                      .map((budget) => (
                        <div key={budget.id} className="flex items-center justify-between">
                          <span className="text-sm">{budget.category}</span>
                          <span className="text-sm text-amber-500">{budget.progress}%</span>
                        </div>
                      ))}
                    {filteredBudgets.filter((budget) => budget.progress >= 75 && budget.progress < 100).length ===
                      0 && <div className="text-sm text-muted-foreground py-2">No alerts at this time</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>How your budget is distributed across categories</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-2 px-2 pb-2">
                <div className="h-[400px]">
                  <BudgetChart budgets={filteredBudgets} height={400} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Details</CardTitle>
                <CardDescription>Detailed breakdown of your budgets</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-2 px-2 pb-2">
                <BudgetTable budgets={filteredBudgets} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
                <CardDescription>Analyze your budget performance over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-2 px-2 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Budget vs. Actual</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] p-0 pt-2 px-2 pb-2">
                      {budgetVsActual.length > 0 ? (
                        <BudgetVsActualChart data={budgetVsActual} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No budget data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] p-0 pt-2 px-2 pb-2">
                      <BudgetChart budgets={filteredBudgets} height={350} />
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2 border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Budget Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-4 md:py-8">
                        <div className="text-4xl md:text-6xl font-bold text-green-500 mb-2 md:mb-4">87%</div>
                        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8">
                          Your budget utilization is efficient
                        </p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-sm md:text-base font-medium mb-1 md:mb-2">Overspending</span>
                            <span className="text-green-500 text-base md:text-lg">Low</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm md:text-base font-medium mb-1 md:mb-2">Allocation</span>
                            <span className="text-green-500 text-base md:text-lg">Good</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm md:text-base font-medium mb-1 md:mb-2">Consistency</span>
                            <span className="text-amber-500 text-base md:text-lg">Fair</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isAddingBudget && <BudgetForm onClose={() => setIsAddingBudget(false)} />}
    </div>
  )
}

