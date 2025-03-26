"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns"

interface AttendanceCalendarProps {
  month: Date
}

export function AttendanceCalendar({ month }: AttendanceCalendarProps) {
  // Sample attendance data
  const [attendanceData] = useState({
    "2023-05-01": { present: 45, absent: 3, late: 2 },
    "2023-05-02": { present: 47, absent: 1, late: 2 },
    "2023-05-03": { present: 46, absent: 2, late: 2 },
    "2023-05-04": { present: 44, absent: 4, late: 2 },
    "2023-05-05": { present: 43, absent: 5, late: 2 },
    "2023-05-08": { present: 48, absent: 1, late: 1 },
    "2023-05-09": { present: 47, absent: 2, late: 1 },
    "2023-05-10": { present: 46, absent: 3, late: 1 },
    "2023-05-11": { present: 45, absent: 3, late: 2 },
    "2023-05-12": { present: 44, absent: 4, late: 2 },
    "2023-05-15": { present: 48, absent: 0, late: 2 },
    "2023-05-16": { present: 47, absent: 1, late: 2 },
    "2023-05-17": { present: 46, absent: 2, late: 2 },
    "2023-05-18": { present: 45, absent: 3, late: 2 },
    "2023-05-19": { present: 44, absent: 4, late: 2 },
    "2023-05-22": { present: 48, absent: 0, late: 2 },
    "2023-05-23": { present: 47, absent: 1, late: 2 },
    "2023-05-24": { present: 46, absent: 2, late: 2 },
    "2023-05-25": { present: 45, absent: 3, late: 2 },
    "2023-05-26": { present: 44, absent: 4, late: 2 },
    "2023-05-29": { present: 46, absent: 2, late: 2 },
    "2023-05-30": { present: 45, absent: 3, late: 2 },
    "2023-05-31": { present: 44, absent: 4, late: 2 },
  })

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
  const startDay = getDay(monthStart)

  // Create an array of days including empty slots for the days before the month starts
  const calendarDays = Array(startDay).fill(null).concat(days)

  // Calculate the number of weeks
  const weeks = Math.ceil(calendarDays.length / 7)

  // Ensure we have a complete grid by adding empty slots at the end if needed
  while (calendarDays.length < weeks * 7) {
    calendarDays.push(null)
  }

  // Group days into weeks
  const calendarWeeks = Array(weeks)
    .fill([])
    .map((_, weekIndex) => calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7))

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2 text-center font-medium">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-1 max-w-full overflow-hidden">
        {calendarWeeks.flat().map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-24 border rounded-md bg-muted/20"></div>
          }

          const dateKey = format(day, "yyyy-MM-dd")
          const dayData = attendanceData[dateKey]
          const isCurrentMonth = isSameMonth(day, month)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={dateKey}
              className={`h-20 sm:h-24 border rounded-md p-1 text-xs sm:text-sm ${
                !isCurrentMonth ? "bg-muted/20" : isCurrentDay ? "border-primary" : ""
              }`}
            >
              <div className="text-right font-medium mb-1">{format(day, "d")}</div>
              {dayData && (
                <div className="flex flex-col gap-1">
                  {dayData.present > 0 && (
                    <div className="text-xs px-1 py-0.5 bg-green-100 text-green-800 rounded flex justify-between">
                      <span>P</span>
                      <span>{dayData.present}</span>
                    </div>
                  )}
                  {dayData.late > 0 && (
                    <div className="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded flex justify-between">
                      <span>L</span>
                      <span>{dayData.late}</span>
                    </div>
                  )}
                  {dayData.absent > 0 && (
                    <div className="text-xs px-1 py-0.5 bg-red-100 text-red-800 rounded flex justify-between">
                      <span>A</span>
                      <span>{dayData.absent}</span>
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

