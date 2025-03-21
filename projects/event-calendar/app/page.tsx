"use client"

import { useState } from "react"
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Event } from "@/types/event"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarDay } from "@/components/calendar-day"
import { CategoryLegend } from "@/components/category-legend"
import { AddEventForm } from "@/components/add-event-form"

// Sample events with current month dates
const getCurrentMonthEvents = (): Event[] => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  return [
    {
      id: "1",
      title: "Team Meeting",
      date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-15`,
      time: "09:00",
      description: "Weekly team sync",
      category: "work",
    },
    {
      id: "2",
      title: "Doctor Appointment",
      date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-18`,
      time: "14:30",
      description: "Annual check-up",
      category: "personal",
    },
    {
      id: "3",
      title: "Birthday Party",
      date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-22`,
      time: "18:00",
      description: "Sarah's birthday celebration",
      category: "social",
    },
  ]
}

export default function EventCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>(getCurrentMonthEvents())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  // Calendar navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Event handlers
  const handleAddEvent = (newEventData: Omit<Event, "id">) => {
    const id = Math.random().toString(36).substring(2, 11)
    const createdEvent = { ...newEventData, id }
    setEvents([...events, createdEvent])
    setIsModalOpen(false)
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    setIsModalOpen(true)
  }

  // Generate days for the month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Filter events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.date), day))
  }

  // Generate day cells for the calendar
  const renderDays = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => (
          <CalendarDay
            key={day.toString()}
            day={day}
            events={getEventsForDay(day)}
            currentMonth={currentMonth}
            isSelected={selectedDay ? isSameDay(selectedDay, day) : false}
            onSelect={handleDayClick}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CalendarHeader
            currentMonth={currentMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onAddEvent={() => setIsModalOpen(true)}
          />
        </CardHeader>
        <CardContent>
          {renderDays()}
          <CategoryLegend />
        </CardContent>
      </Card>

      <AddEventForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddEvent={handleAddEvent}
        selectedDate={selectedDay}
      />
    </div>
  )
}

