"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const categories = [
  { value: "tutorial", label: "Tutorial" },
  { value: "guide", label: "Guide" },
  { value: "review", label: "Review" },
  { value: "news", label: "News" },
  { value: "opinion", label: "Opinion" },
  { value: "case-study", label: "Case Study" },
  { value: "interview", label: "Interview" },
]

interface CategorySelectorProps {
  value: string
  onValueChange: (value: string) => void
  required?: boolean
  error?: string
}

export function CategorySelector({ value, onValueChange, required = true, error }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Find the selected category label
  const selectedCategory = categories.find((category) => category.value === value)

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle category selection
  const handleCategorySelect = (categoryValue: string) => {
    onValueChange(categoryValue)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between sm:w-[200px] transition-colors hover:bg-muted",
          error && "border-destructive",
        )}
      >
        {selectedCategory ? (
          selectedCategory.label
        ) : (
          <span className={cn(required && !value ? "text-destructive" : "text-muted-foreground")}>
            {required ? "Select category*" : "Select category..."}
          </span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category..."
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-[200px] overflow-auto p-1" role="listbox" aria-label="Categories">
            {filteredCategories.length === 0 ? (
              <li className="py-2 px-2 text-center text-sm text-muted-foreground">No category found</li>
            ) : (
              filteredCategories.map((category) => (
                <li
                  key={category.value}
                  role="option"
                  aria-selected={value === category.value}
                  className={cn(
                    "cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === category.value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  {category.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

