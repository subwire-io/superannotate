"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoalTable } from "@/components/tables/goal-table"
import { GoalForm } from "@/components/forms/goal-form"
import { useFinance } from "@/lib/data-context"

export function FinancialGoals() {
  const { goals } = useFinance()
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Filter active goals
  const activeGoals = goals.filter((goal) => goal.progress < 100)
  const completedGoals = goals.filter((goal) => goal.progress >= 100)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
        <p className="text-muted-foreground">Set and track your financial goals</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsAddingGoal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Goal
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Goals</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
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
              <CardContent>
                <GoalTable />
              </CardContent>
            </Card>
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
                      <div key={goal.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="font-medium">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">{goal.type}</p>
                        </div>
                        <div className="text-right">
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
              <CardContent>
                <GoalTable />
              </CardContent>
            </Card>
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
                        <div key={goal.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{goal.name}</h3>
                            <p className="text-xs text-muted-foreground">{goal.type}</p>
                          </div>
                          <div className="text-right">
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

