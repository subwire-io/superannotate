"use client"

import type React from "react"

import { format, isToday, isSameMonth } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/types/event"
import { EventItem } from "@/components/event-item"

interface CalendarDayProps {
  day: Date
  events: Event[]
  currentMonth: Date
  isSelected: boolean
  onSelect: (day: Date) => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (id: string) => void
  onUndoDelete: (event: Event) => void
}

export function CalendarDay({
  day,
  events,
  currentMonth,
  isSelected,
  onSelect,
  onEditEvent,
  onDeleteEvent,
  onUndoDelete,
}: CalendarDayProps) {
  const isCurrentDay = isToday(day)
  const isDifferentMonth = !isSameMonth(day, currentMonth)

  const handleDayClick = (e: React.MouseEvent) => {
    // Only trigger day selection if the click was directly on the day cell
    // and not on a child element that might have its own click handler
    if (e.currentTarget === e.target) {
      onSelect(day)
    }
  }

  return (
    <div
      className={`
        h-16 sm:h-24 p-1 border text-left overflow-y-auto transition-colors cursor-pointer
        ${isCurrentDay ? "bg-muted/50 border-primary" : "hover:bg-muted/30"}
        ${isSelected ? "ring-2 ring-primary" : ""}
        ${isDifferentMonth ? "text-muted-foreground opacity-50" : ""}
      `}
      onClick={handleDayClick}
      aria-selected={isSelected}
      aria-label={`${format(day, "PPPP")}, ${events.length} events`}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${isCurrentDay ? "text-primary" : ""}`}>{format(day, "d")}</span>
        {events.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {events.length}
          </Badge>
        )}
      </div>
      <div className="mt-1 space-y-1 max-h-10 sm:max-h-16 text-xs">
        {events.length > 0 ? (
          events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onUndoDelete={onUndoDelete}
            />
          ))
        ) : (
          <div className="text-xs text-center text-muted-foreground py-1 hidden sm:block">No events</div>
        )}
      </div>
    </div>
  )
}

