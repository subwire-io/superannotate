"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"

// Mock data for the calendar
const daysInMonth = 31 // August has 31 days
const firstDayOfMonth = 2 // Tuesday (0 is Sunday, 1 is Monday, etc.)
const currentDay = 15 // Assuming today is August 15

// Mock attendance data
const attendanceData = {
  1: { present: 130, absent: 12, late: 8, leave: 5 },
  2: { present: 132, absent: 10, late: 6, leave: 5 },
  3: { present: 135, absent: 7, late: 5, leave: 5 },
  4: { present: 133, absent: 9, late: 7, leave: 5 },
  5: { present: 128, absent: 14, late: 10, leave: 5 },
  // Weekend
  6: { present: 0, absent: 0, late: 0, leave: 0 },
  7: { present: 0, absent: 0, late: 0, leave: 0 },
  8: { present: 134, absent: 8, late: 9, leave: 5 },
  9: { present: 136, absent: 6, late: 5, leave: 5 },
  10: { present: 135, absent: 7, late: 6, leave: 5 },
  11: { present: 133, absent: 9, late: 8, leave: 5 },
  12: { present: 130, absent: 12, late: 10, leave: 5 },
  // Weekend
  13: { present: 0, absent: 0, late: 0, leave: 0 },
  14: { present: 0, absent: 0, late: 0, leave: 0 },
  15: { present: 134, absent: 8, late: 12, leave: 5 },
  // Future dates have no data
}

// Sample employees for the hover card
const sampleEmployees = {
  late: [
    { name: "Alex Morgan", avatar: "/placeholder.svg?height=40&width=40", initials: "AM", time: "9:15 AM" },
    { name: "Taylor Swift", avatar: "/placeholder.svg?height=40&width=40", initials: "TS", time: "9:22 AM" },
    { name: "Jordan Lee", avatar: "/placeholder.svg?height=40&width=40", initials: "JL", time: "9:08 AM" },
  ],
  absent: [
    { name: "Casey Zhang", avatar: "/placeholder.svg?height=40&width=40", initials: "CZ" },
    { name: "Jamie Rodriguez", avatar: "/placeholder.svg?height=40&width=40", initials: "JR" },
  ],
  leave: [
    { name: "Morgan Freeman", avatar: "/placeholder.svg?height=40&width=40", initials: "MF", reason: "Vacation" },
    { name: "Riley Johnson", avatar: "/placeholder.svg?height=40&width=40", initials: "RJ", reason: "Sick Leave" },
  ],
}

export function CalendarView() {
  const [month, setMonth] = useState("August")
  const [year, setYear] = useState(2023)

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Generate calendar days
  const calendarDays = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {month} {year}
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center font-medium text-sm">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-24 p-1 border rounded-md bg-muted/30" />
          }

          const isWeekend = index % 7 === 0 || index % 7 === 6
          const isToday = day === currentDay
          const hasData = attendanceData[day]

          return (
            <div
              key={`day-${day}`}
              className={`h-24 p-2 border rounded-md ${
                isToday ? "border-primary" : ""
              } ${isWeekend ? "bg-muted/30" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {day}
                </span>
                {hasData && !isWeekend && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Info className="h-3 w-3" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">August {day}, 2023</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Present</div>
                            <div className="text-sm">{hasData.present} employees</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Absent</div>
                            <div className="text-sm">{hasData.absent} employees</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Late</div>
                            <div className="text-sm">{hasData.late} employees</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">On Leave</div>
                            <div className="text-sm">{hasData.leave} employees</div>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
              {hasData && !isWeekend && (
                <div className="mt-2 space-y-1">
                  {hasData.late > 0 && (
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900"
                      >
                        {hasData.late} Late
                      </Badge>
                    </div>
                  )}
                  {hasData.absent > 0 && (
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900"
                      >
                        {hasData.absent} Absent
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

