import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
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

