"use client"

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
}

// Update the CalendarDay component to ensure proper contrast in dark mode
export function CalendarDay({ day, events, currentMonth, isSelected, onSelect }: CalendarDayProps) {
  const isCurrentDay = isToday(day)
  const isDifferentMonth = !isSameMonth(day, currentMonth)

  return (
    <button
      className={`
        h-24 p-1 border text-left overflow-y-auto transition-colors
        ${isCurrentDay ? "bg-muted/50 border-primary" : "hover:bg-muted/30"}
        ${isSelected ? "ring-2 ring-primary" : ""}
        ${isDifferentMonth ? "text-muted-foreground opacity-50" : ""}
      `}
      onClick={() => onSelect(day)}
      aria-selected={isSelected}
      aria-label={`${format(day, "PPPP")}, ${events.length} events`}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${isCurrentDay ? "text-primary" : ""}`}>{format(day, "d")}</span>
        {events.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {events.length}
          </Badge>
        )}
      </div>
      <div className="mt-1 space-y-1 max-h-16 text-xs">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </button>
  )
}

