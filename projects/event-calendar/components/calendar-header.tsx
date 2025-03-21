"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface CalendarHeaderProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onAddEvent: () => void
}

export function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth, onAddEvent }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Event Calendar</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevMonth} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold min-w-[140px] text-center">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="outline" size="icon" onClick={onNextMonth} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={onAddEvent} className="gap-1">
        <Plus className="h-4 w-4" />
        <span>Add Event</span>
      </Button>
    </div>
  )
}

