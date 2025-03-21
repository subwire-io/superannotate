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
  personal:
    "bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:bg-blue-500/30 dark:hover:bg-blue-500/40 dark:text-blue-300",
  work: "bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:bg-green-500/30 dark:hover:bg-green-500/40 dark:text-green-300",
  meeting:
    "bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:bg-purple-500/30 dark:hover:bg-purple-500/40 dark:text-purple-300",
  social:
    "bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:bg-amber-500/30 dark:hover:bg-amber-500/40 dark:text-amber-300",
  other:
    "bg-gray-500/20 hover:bg-gray-500/30 text-gray-700 dark:bg-gray-500/30 dark:hover:bg-gray-500/40 dark:text-gray-300",
}

