"use client"

import { useState } from "react"
import { Plus, Eye, Edit, Trash, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoalForm } from "@/components/forms/goal-form"
import { useFinance } from "@/lib/data-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FinancialGoals() {
  const { goals, deleteGoal } = useFinance()
  const { toast } = useToast()
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [filteredGoals, setFilteredGoals] = useState(goals)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)

  // Filter active goals
  const activeGoals = filteredGoals.filter((goal) => goal.progress < 100)
  const completedGoals = filteredGoals.filter((goal) => goal.progress >= 100)

  // Apply filters
  const applyFilters = () => {
    let filtered = [...goals]

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter((goal) => goal.type === selectedType)
    }

    if (selectedStatus && selectedStatus !== "all") {
      if (selectedStatus === "active") {
        filtered = filtered.filter((goal) => goal.progress < 100)
      } else if (selectedStatus === "completed") {
        filtered = filtered.filter((goal) => goal.progress >= 100)
      }
    }

    setFilteredGoals(filtered)
    setHasActiveFilters(selectedType !== "all" || selectedStatus !== "all")
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedType("all")
    setSelectedStatus("all")
    setFilteredGoals(goals)
    setHasActiveFilters(false)
  }

  // Handle goal actions
  const handleEdit = (id: string) => {
    setSelectedGoal(id)
    setIsEditing(true)
  }

  const handleView = (id: string) => {
    setSelectedGoal(id)
    setIsViewingDetails(true)
  }

  const handleDelete = (id: string) => {
    setSelectedGoal(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedGoal) {
      deleteGoal(selectedGoal)
      toast({
        title: "Goal deleted",
        description: "The financial goal has been deleted successfully.",
        duration: 3000,
        action: (
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Action undone",
                description: "The goal has been restored.",
                duration: 3000,
              })
            }}
          >
            Undo
          </Button>
        ),
      })
      setIsDeleting(false)
      setSelectedGoal(null)
    }
  }

  // Get the details of the selected goal
  const goalDetails = selectedGoal ? goals.find((g) => g.id === selectedGoal) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
        <p className="text-muted-foreground">Set and track your financial goals</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-2 flex-wrap">
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value)
                applyFilters()
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
                <SelectItem value="Debt Repayment">Debt Repayment</SelectItem>
                <SelectItem value="Retirement">Retirement</SelectItem>
                <SelectItem value="Major Purchase">Major Purchase</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value)
                applyFilters()
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" className="w-full sm:w-auto" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
          <Button onClick={() => setIsAddingGoal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Goal
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="active">Active Goals</TabsTrigger>
            <TabsTrigger value="completed">Completed Goals</TabsTrigger>
            <TabsTrigger value="all">All Goals</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeGoals.slice(0, 3).map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{goal.name}</CardTitle>
                    <CardDescription>{goal.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="mt-3 text-xs text-muted-foreground">Target date: {goal.deadline}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ${calculateMonthlyContribution(goal).toFixed(0)} per month needed to reach goal
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(goal.id)}
                        aria-label={`View details for ${goal.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal.id)}
                        aria-label={`Edit ${goal.name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        aria-label={`Delete ${goal.name}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeGoals.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="flex items-center justify-center h-24 text-muted-foreground">
                    No active goals found. Create one to get started.
                  </CardContent>
                </Card>
              )}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>Track progress on your current financial goals</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="rounded-md border hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Goal</th>
                        <th className="py-3 px-4 text-left font-medium">Type</th>
                        <th className="py-3 px-4 text-left font-medium">Target</th>
                        <th className="py-3 px-4 text-left font-medium">Current</th>
                        <th className="py-3 px-4 text-left font-medium">Deadline</th>
                        <th className="py-3 px-4 text-left font-medium">Progress</th>
                        <th className="py-3 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeGoals.length > 0 ? (
                        activeGoals.map((goal) => (
                          <tr key={goal.id} className="border-b">
                            <td className="py-3 px-4 font-medium">{goal.name}</td>
                            <td className="py-3 px-4">{goal.type}</td>
                            <td className="py-3 px-4">${goal.target.toLocaleString()}</td>
                            <td className="py-3 px-4">${goal.current.toLocaleString()}</td>
                            <td className="py-3 px-4">{goal.deadline}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Progress value={goal.progress} className="h-2 w-[60px] sm:w-[100px]" />
                                <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(goal.id)}
                                  aria-label={`View details for ${goal.name}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(goal.id)}
                                  aria-label={`Edit ${goal.name}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(goal.id)}
                                  aria-label={`Delete ${goal.name}`}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="h-24 text-center">
                            No active goals found. Create one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Mobile card view */}
            <div className="md:hidden space-y-4 mt-4 px-1">
              {activeGoals.length > 0 ? (
                activeGoals.map((goal) => (
                  <Card key={goal.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-base">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">{goal.type}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(goal.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(goal.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(goal.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                        <div className="text-muted-foreground">Target:</div>
                        <div className="text-right">${goal.target.toLocaleString()}</div>

                        <div className="text-muted-foreground">Current:</div>
                        <div className="text-right">${goal.current.toLocaleString()}</div>

                        <div className="text-muted-foreground">Deadline:</div>
                        <div className="text-right">{goal.deadline}</div>
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No active goals found. Create one to get started.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Goals</CardTitle>
                <CardDescription>Financial goals you have successfully achieved</CardDescription>
              </CardHeader>
              <CardContent>
                {completedGoals.length > 0 ? (
                  <div className="space-y-4">
                    {completedGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2"
                      >
                        <div>
                          <h3 className="font-medium">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">{goal.type}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-medium">${goal.target.toLocaleString()}</p>
                          <p className="text-sm text-green-500">Completed on {goal.deadline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 text-muted-foreground">
                    No completed goals yet. Keep working towards your active goals!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Goals</CardTitle>
                <CardDescription>Complete overview of all your financial goals</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="rounded-md border hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Goal</th>
                        <th className="py-3 px-4 text-left font-medium">Type</th>
                        <th className="py-3 px-4 text-left font-medium">Target</th>
                        <th className="py-3 px-4 text-left font-medium">Current</th>
                        <th className="py-3 px-4 text-left font-medium">Deadline</th>
                        <th className="py-3 px-4 text-left font-medium">Progress</th>
                        <th className="py-3 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGoals.length > 0 ? (
                        filteredGoals.map((goal) => (
                          <tr key={goal.id} className="border-b">
                            <td className="py-3 px-4 font-medium">{goal.name}</td>
                            <td className="py-3 px-4">{goal.type}</td>
                            <td className="py-3 px-4">${goal.target.toLocaleString()}</td>
                            <td className="py-3 px-4">${goal.current.toLocaleString()}</td>
                            <td className="py-3 px-4">{goal.deadline}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Progress value={goal.progress} className="h-2 w-[60px] sm:w-[100px]" />
                                <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleView(goal.id)}
                                  aria-label={`View details for ${goal.name}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(goal.id)}
                                  aria-label={`Edit ${goal.name}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(goal.id)}
                                  aria-label={`Delete ${goal.name}`}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="h-24 text-center">
                            No goals found. Create one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Mobile card view */}
            <div className="md:hidden space-y-4 mt-4 px-1">
              {filteredGoals.length > 0 ? (
                filteredGoals.map((goal) => (
                  <Card key={goal.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-base">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">{goal.type}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(goal.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(goal.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(goal.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                        <div className="text-muted-foreground">Target:</div>
                        <div className="text-right">${goal.target.toLocaleString()}</div>

                        <div className="text-muted-foreground">Current:</div>
                        <div className="text-right">${goal.current.toLocaleString()}</div>

                        <div className="text-muted-foreground">Deadline:</div>
                        <div className="text-right">{goal.deadline}</div>
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No goals found. Create one to get started.
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Progress Summary</CardTitle>
                  <CardDescription>Overall progress towards your financial goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm">{calculateOverallProgress(goals)}%</span>
                      </div>
                      <Progress value={calculateOverallProgress(goals)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Total Saved</span>
                        <span className="text-sm">${calculateTotalSaved(goals).toLocaleString()}</span>
                      </div>
                      <Progress value={calculateTotalSavedPercentage(goals)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Remaining</span>
                        <span className="text-sm">${calculateTotalRemaining(goals).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Goal Timeline</CardTitle>
                  <CardDescription>Upcoming goal deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals
                      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                      .slice(0, 4)
                      .map((goal) => (
                        <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{goal.name}</h3>
                            <p className="text-xs text-muted-foreground">{goal.type}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-medium">{goal.deadline}</p>
                            <p className="text-xs text-muted-foreground">
                              {calculateDaysRemaining(goal.deadline)} days left
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isAddingGoal && <GoalForm onClose={() => setIsAddingGoal(false)} />}

      {isEditing && selectedGoal && (
        <GoalForm
          goalId={selectedGoal}
          onClose={() => {
            setIsEditing(false)
            setSelectedGoal(null)
          }}
        />
      )}

      {isViewingDetails && goalDetails && (
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Goal Details</DialogTitle>
              <DialogDescription>Detailed information about this financial goal</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{goalDetails.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3">{goalDetails.type}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Target:</div>
                <div className="col-span-3">${goalDetails.target.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Current:</div>
                <div className="col-span-3">${goalDetails.current.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Deadline:</div>
                <div className="col-span-3">{goalDetails.deadline}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Progress:</div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Progress value={goalDetails.progress} className="h-2 w-[100px]" />
                    <span className="text-sm text-muted-foreground">{goalDetails.progress}%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Monthly:</div>
                <div className="col-span-3">
                  ${calculateMonthlyContribution(goalDetails).toFixed(2)} per month needed
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Notes:</div>
                <div className="col-span-3">{goalDetails.notes || "No additional notes available."}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the financial goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="w-full sm:w-auto">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Helper functions
function calculateMonthlyContribution(goal: { current: number; target: number; deadline: string }) {
  const today = new Date()
  const deadline = new Date(goal.deadline)
  const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth())

  if (monthsRemaining <= 0) return 0

  const amountRemaining = goal.target - goal.current
  return amountRemaining / monthsRemaining
}

function calculateOverallProgress(goals: { progress: number }[]) {
  if (goals.length === 0) return 0
  return Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
}

function calculateTotalSaved(goals: { current: number }[]) {
  return goals.reduce((sum, goal) => sum + goal.current, 0)
}

function calculateTotalRemaining(goals: { current: number; target: number }[]) {
  return goals.reduce((sum, goal) => sum + (goal.target - goal.current), 0)
}

function calculateTotalSavedPercentage(goals: { current: number; target: number }[]) {
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const totalCurrent = calculateTotalSaved(goals)

  if (totalTarget === 0) return 0
  return Math.round((totalCurrent / totalTarget) * 100)
}

function calculateDaysRemaining(deadline: string) {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = Math.abs(deadlineDate.getTime() - today.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

