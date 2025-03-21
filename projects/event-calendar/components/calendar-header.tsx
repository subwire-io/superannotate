"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react"
import type { EventCategory } from "@/types/event"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface CalendarHeaderProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onAddEvent: () => void
  selectedCategories: EventCategory[]
  onCategoryToggle: (category: EventCategory) => void
  onClearFilters: () => void
}

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onAddEvent,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
}: CalendarHeaderProps) {
  const allCategories: { label: string; value: EventCategory }[] = [
    { label: "Personal", value: "personal" },
    { label: "Work", value: "work" },
    { label: "Meeting", value: "meeting" },
    { label: "Social", value: "social" },
    { label: "Other", value: "other" },
  ]

  const isFiltered = selectedCategories.length > 0 && selectedCategories.length < allCategories.length

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={isFiltered ? "default" : "outline"} size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {isFiltered && (
                <span className="ml-1 rounded-full bg-primary-foreground text-primary w-5 h-5 text-xs flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => onCategoryToggle(category.value)}
              >
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClearFilters}>Clear filters</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAddEvent} className="gap-1 transition-all hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Event</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  )
}

