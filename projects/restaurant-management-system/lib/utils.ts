import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update the formatCurrency function to handle decimal places consistently
export function formatCurrency(amount: number): string {
  // First round to 2 decimal places to avoid floating point issues
  const roundedAmount = Math.round((amount + Number.EPSILON) * 100) / 100

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedAmount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(timeString: string): string {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getCurrentTimeSlots(interval = 30): string[] {
  const slots: string[] = []
  const now = new Date()
  now.setHours(9, 0, 0, 0) // Start at 9 AM

  const end = new Date()
  end.setHours(22, 0, 0, 0) // End at 10 PM

  while (now < end) {
    slots.push(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    )
    now.setMinutes(now.getMinutes() + interval)
  }

  return slots
}

export function generateTimeSlots(startHour = 9, endHour = 22, interval = 30): string[] {
  const slots: string[] = []
  const now = new Date()
  now.setHours(startHour, 0, 0, 0)

  const end = new Date()
  end.setHours(endHour, 0, 0, 0)

  while (now < end) {
    slots.push(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    )
    now.setMinutes(now.getMinutes() + interval)
  }

  return slots
}

export function generateOrderNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getNextWeekDates(): Date[] {
  const dates: Date[] = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date()
    nextDate.setDate(today.getDate() + i)
    dates.push(nextDate)
  }

  return dates
}

// New utility functions for our modifications - without JSX
export function refreshData() {
  // In a real app, this would fetch fresh data from the API
  return new Promise((resolve) => setTimeout(resolve, 500))
}

export function exportData(format: "csv" | "pdf" | "excel" = "csv") {
  // In a real app, this would generate and download the export file
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

