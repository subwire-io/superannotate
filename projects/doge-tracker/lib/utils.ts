import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price < 0.01 ? 6 : 2,
    maximumFractionDigits: price < 0.01 ? 6 : 2,
  }).format(price)
}

export function formatDateForTimePeriod(timestamp: number, timePeriod: string): string {
  const date = new Date(timestamp)

  switch (timePeriod) {
    case "1":
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    case "7":
      return date.toLocaleDateString([], { weekday: "short" })
    case "30":
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    case "90":
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    case "365":
      return date.toLocaleDateString([], { month: "short", year: "2-digit" })
    case "max":
      return date.toLocaleDateString([], { year: "numeric" })
    default:
      return date.toLocaleDateString()
  }
}

export function getTimeLabel(timePeriod: string): string {
  switch (timePeriod) {
    case "1":
      return "in the last 24 hours"
    case "7":
      return "in the last 7 days"
    case "30":
      return "in the last 30 days"
    case "90":
      return "in the last 90 days"
    case "365":
      return "in the last year"
    case "max":
      return "all time"
    default:
      return ""
  }
}

