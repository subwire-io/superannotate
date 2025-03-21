import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Event, EventCategory } from "@/types/event"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Function to filter events by category
export function filterEventsByCategory(events: Event[], categories: EventCategory[]): Event[] {
  if (categories.length === 0) return events

  return events.filter((event) => categories.includes(event.category))
}

