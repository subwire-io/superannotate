export interface Event {
  id: string
  title: string
  date: string
  time: string
  description: string
  category: EventCategory
}

export type EventCategory = "personal" | "work" | "meeting" | "social" | "other"

export const colorMap: Record<EventCategory, string> = {
  personal: "bg-blue-600 hover:bg-blue-700 text-white",
  work: "bg-green-600 hover:bg-green-700 text-white",
  meeting: "bg-purple-600 hover:bg-purple-700 text-white",
  social: "bg-amber-600 hover:bg-amber-700 text-white",
  other: "bg-gray-600 hover:bg-gray-700 text-white",
}

