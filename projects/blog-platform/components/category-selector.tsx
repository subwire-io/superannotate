"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SimpleInput } from "./ui/simple-input"

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
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between sm:w-[200px] transition-colors hover:bg-muted",
              error && "border-destructive",
            )}
          >
            {value ? (
              categories.find((category) => category.value === value)?.label
            ) : (
              <span className={cn(required && !value ? "text-destructive" : "text-muted-foreground")}>
                {required ? "Select category*" : "Select category..."}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 sm:w-[200px]">
          <div className="w-full">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <SimpleInput
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="py-6 text-center text-sm">No category found.</div>
              ) : (
                <div className="p-1">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.value}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        value === category.value && "bg-accent text-accent-foreground",
                      )}
                      onClick={() => {
                        onValueChange(category.value)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === category.value ? "opacity-100" : "opacity-0")} />
                      {category.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

