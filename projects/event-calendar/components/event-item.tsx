import type { Event } from "@/types/event"

interface EventItemProps {
  event: Event
}

export function EventItem({ event }: EventItemProps) {
  // Direct color mapping with explicit colors that work in dark mode
  const getBgColor = () => {
    switch (event.category) {
      case "personal":
        return "bg-blue-800 text-white"
      case "work":
        return "bg-green-800 text-white"
      case "meeting":
        return "bg-purple-800 text-white"
      case "social":
        return "bg-amber-800 text-white"
      case "other":
      default:
        return "bg-gray-700 text-white"
    }
  }

  return (
    <div
      className={`px-1.5 py-0.5 rounded-sm truncate ${getBgColor()} text-xs`}
      title={`${event.title} - ${event.time} - ${event.description}`}
    >
      {event.time} {event.title}
    </div>
  )
}

