"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

interface CalendarHeaderProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onAddEvent: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onAddEvent,
  searchQuery,
  onSearchChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold">Event Calendar</h2>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="transition-all hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold min-w-[140px] text-center">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          aria-label="Next month"
          className="transition-all hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8 w-[180px] h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onAddEvent} className="gap-1 transition-all hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </Button>
      </div>
    </div>
  )
}

