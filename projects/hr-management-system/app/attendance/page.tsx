"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/attendance/calendar-view"
import { AttendanceStats } from "@/components/attendance/attendance-stats"
import { AttendanceTable } from "@/components/attendance/attendance-table"
import { Download, Filter, Calendar, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AttendancePage() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Filter Applied",
                description: "Attendance data has been filtered",
              })
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Export Started",
                description: "Attendance data export has started",
              })
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <AttendanceStats />

      <Card>
        <CardHeader>
          <CardTitle>Attendance Tracker</CardTitle>
          <CardDescription>View and manage employee attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="mr-2 h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">August 2023</div>
            </div>
            <TabsContent value="calendar">
              <CalendarView />
            </TabsContent>
            <TabsContent value="list">
              <AttendanceTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

