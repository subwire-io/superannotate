"use client"

import { useState, useEffect } from "react"
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Event } from "@/types/event"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarDay } from "@/components/calendar-day"
import { CategoryLegend } from "@/components/category-legend"
import { AddEventForm } from "@/components/add-event-form"
import { Toaster } from "@/components/ui/toaster"
import { generateId, filterEventsByQuery } from "@/lib/utils"

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
  // State
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>(getCurrentMonthEvents())
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletedEvents, setDeletedEvents] = useState<Event[]>([])

  // Filter events when search query changes
  useEffect(() => {
    setFilteredEvents(filterEventsByQuery(events, searchQuery))
  }, [events, searchQuery])

  // Calendar navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Event handlers
  const handleAddEvent = (newEventData: Omit<Event, "id">) => {
    const id = generateId()
    const createdEvent = { ...newEventData, id }
    setEvents([...events, createdEvent])
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setEditingEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    // Store the deleted event for potential undo
    const eventToDelete = events.find((e) => e.id === id)
    if (eventToDelete) {
      setDeletedEvents([...deletedEvents, eventToDelete])
    }

    // Remove the event from the list
    setEvents(events.filter((event) => event.id !== id))
  }

  const handleUndoDelete = (event: Event) => {
    // Add the event back to the list
    setEvents([...events, event])

    // Remove from deleted events
    setDeletedEvents(deletedEvents.filter((e) => e.id !== event.id))
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  // Generate days for the month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Filter events for a specific day
  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter((event) => isSameDay(parseISO(event.date), day))
  }

  // Check if there are any events for the current month view
  const hasEventsInMonth = days.some((day) => getEventsForDay(day).length > 0)

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
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onUndoDelete={handleUndoDelete}
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
            onAddEvent={() => {
              setEditingEvent(null)
              setIsModalOpen(true)
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </CardHeader>
        <CardContent>
          {renderDays()}

          {/* No events message */}
          {!hasEventsInMonth && searchQuery && (
            <div className="text-center py-4 text-muted-foreground">No events found matching "{searchQuery}"</div>
          )}

          <CategoryLegend />
        </CardContent>
      </Card>

      <AddEventForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        selectedDate={selectedDay}
        editingEvent={editingEvent}
      />

      <Toaster />
    </div>
  )
}

