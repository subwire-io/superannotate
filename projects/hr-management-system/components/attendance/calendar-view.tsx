"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ChevronLeft, ChevronRight, Info, CalendarIcon } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Card } from "@/components/ui/card"

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

export function CalendarView() {
  const [month, setMonth] = useState("August")
  const [year, setYear] = useState(2023)
  const isMobile = useMobile()

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

  // Function to handle month navigation
  const navigateMonth = (direction: "prev" | "next") => {
    // This is a mock function since we're using static data
    // In a real app, this would update the month and fetch new data
    console.log(`Navigate ${direction} month`)
  }

  if (isMobile) {
    // Mobile view - vertical list of days with attendance data
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <div className="font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {month} {year}
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-2">
          {calendarDays.map((day, index) => {
            if (day === null) return null

            const isWeekend = index % 7 === 0 || index % 7 === 6
            const isToday = day === currentDay
            const hasData = attendanceData[day]
            const dayOfWeek = dayNames[index % 7]

            if (isWeekend && !hasData) return null

            return (
              <Card
                key={`day-${day}`}
                className={`p-3 ${isToday ? "border-primary" : ""} ${isWeekend ? "bg-muted/30" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center rounded-full w-7 h-7 mr-2 ${
                        isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <span className="text-sm font-medium">{day}</span>
                    </div>
                    <span className="text-sm font-medium">{dayOfWeek}</span>
                  </div>

                  {hasData && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Info className="h-4 w-4" />
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

                {hasData && (
                  <div className="flex flex-wrap gap-2">
                    {hasData.late > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900"
                      >
                        {hasData.late} Late
                      </Badge>
                    )}
                    {hasData.absent > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900"
                      >
                        {hasData.absent} Absent
                      </Badge>
                    )}
                    {hasData.leave > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900"
                      >
                        {hasData.leave} Leave
                      </Badge>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Desktop view - traditional calendar grid
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {month} {year}
          </div>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
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
                <div className="mt-2 flex flex-col gap-1">
                  {hasData.late > 0 && (
                    <Badge
                      variant="outline"
                      className="w-fit text-xs py-0 h-5 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900"
                    >
                      {hasData.late} Late
                    </Badge>
                  )}
                  {hasData.absent > 0 && (
                    <Badge
                      variant="outline"
                      className="w-fit text-xs py-0 h-5 mt-1 bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900"
                    >
                      {hasData.absent} Absent
                    </Badge>
                  )}
                  {hasData.leave > 0 && (
                    <Badge
                      variant="outline"
                      className="w-fit text-xs py-0 h-5 mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900"
                    >
                      {hasData.leave} Leave
                    </Badge>
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

