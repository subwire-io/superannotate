"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceReviews } from "@/components/performance/performance-reviews"
import { PerformanceMetrics } from "@/components/performance/performance-metrics"
import { GoalTracking } from "@/components/performance/goal-tracking"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PerformancePage() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">Manage employee performance reviews and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              toast({
                title: "New Review",
                description: "Creating a new performance review",
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Review
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Manage and track employee performance reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceReviews />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Track key performance indicators for employees</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceMetrics />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>Set and track employee goals and objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <GoalTracking />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

