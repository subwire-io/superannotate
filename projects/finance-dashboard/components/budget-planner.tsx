"use client"

import { useState } from "react"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BudgetChart } from "@/components/charts/budget-chart"
import { BudgetTable } from "@/components/tables/budget-table"
import { BudgetForm } from "@/components/forms/budget-form"
import { cn } from "@/lib/utils"
import { useFinance } from "@/lib/data-context"

export function BudgetPlanner() {
  const { budgets } = useFinance()
  const [isAddingBudget, setIsAddingBudget] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
        <p className="text-muted-foreground">Create and manage your budgets</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsAddingBudget(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Budget
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Budget Details</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Budget</CardTitle>
                  <CardDescription>Monthly allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${budgets.reduce((sum, budget) => sum + budget.allocated, 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${budgets.reduce((sum, budget) => sum + budget.spent, 0).toFixed(2)} spent so far
                  </p>
                  <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((budgets.reduce((sum, budget) => sum + budget.spent, 0) / budgets.reduce((sum, budget) => sum + budget.allocated, 0)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.min(
                      100,
                      Math.round(
                        (budgets.reduce((sum, budget) => sum + budget.spent, 0) /
                          budgets.reduce((sum, budget) => sum + budget.allocated, 0)) *
                          100,
                      ),
                    )}
                    % of budget used
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Remaining</CardTitle>
                  <CardDescription>Available to spend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${budgets.reduce((sum, budget) => sum + budget.remaining, 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${(budgets.reduce((sum, budget) => sum + budget.remaining, 0) / 30).toFixed(2)} per day for the rest
                    of the month
                  </p>
                  <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((budgets.reduce((sum, budget) => sum + budget.remaining, 0) / budgets.reduce((sum, budget) => sum + budget.allocated, 0)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.min(
                      100,
                      Math.round(
                        (budgets.reduce((sum, budget) => sum + budget.remaining, 0) /
                          budgets.reduce((sum, budget) => sum + budget.allocated, 0)) *
                          100,
                      ),
                    )}
                    % of budget remaining
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>Budget warnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">
                    {budgets.filter((budget) => budget.progress >= 75 && budget.progress < 100).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Categories approaching limit</p>
                  <div className="mt-4 space-y-2">
                    {budgets
                      .filter((budget) => budget.progress >= 75 && budget.progress < 100)
                      .slice(0, 2)
                      .map((budget) => (
                        <div key={budget.id} className="flex items-center justify-between">
                          <span className="text-sm">{budget.category}</span>
                          <span className="text-sm text-amber-500">{budget.progress}%</span>
                        </div>
                      ))}
                    {budgets.filter((budget) => budget.progress >= 75 && budget.progress < 100).length === 0 && (
                      <div className="text-sm text-muted-foreground">No alerts at this time</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>How your budget is distributed across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Details</CardTitle>
                <CardDescription>Detailed breakdown of your budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
                <CardDescription>Analyze your budget performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Monthly Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <BudgetChart />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Budget vs. Actual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <BudgetChart />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Budget Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-4xl font-bold text-green-500">87%</div>
                        <p className="text-sm text-muted-foreground mt-2">Your budget utilization is efficient</p>
                        <div className="w-full mt-4 grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">Overspending</span>
                            <span className="text-green-500">Low</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">Allocation</span>
                            <span className="text-green-500">Good</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">Consistency</span>
                            <span className="text-amber-500">Fair</span>
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

