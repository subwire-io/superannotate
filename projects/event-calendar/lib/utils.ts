import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Function to filter events by search query
export function filterEventsByQuery(events: any[], query: string): any[] {
  if (!query.trim()) return events

  const lowerQuery = query.toLowerCase().trim()

  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.category.toLowerCase().includes(lowerQuery),
  )
}

