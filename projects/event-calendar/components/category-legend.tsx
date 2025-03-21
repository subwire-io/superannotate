import type { EventCategory } from "@/types/event"

export function CategoryLegend() {
  const categories: { name: string; color: string; category: EventCategory }[] = [
    { name: "Personal", color: "bg-blue-800", category: "personal" },
    { name: "Work", color: "bg-green-800", category: "work" },
    { name: "Meeting", color: "bg-purple-800", category: "meeting" },
    { name: "Social", color: "bg-amber-800", category: "social" },
    { name: "Other", color: "bg-gray-700", category: "other" },
  ]

  return (
    <div className="flex flex-wrap gap-3 mt-4 text-xs">
      {categories.map((item) => (
        <div key={item.category} className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  )
}

