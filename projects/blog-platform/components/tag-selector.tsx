"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleInput } from "./ui/simple-input"

const suggestedTags = [
  { value: "nextjs", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "api", label: "API" },
  { value: "database", label: "Database" },
  { value: "performance", label: "Performance" },
  { value: "security", label: "Security" },
  { value: "testing", label: "Testing" },
]

interface TagSelectorProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagSelector({ tags, onChange }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestedTags
    .filter((tag) => !tags.includes(tag.value))
    .filter((tag) => tag.label.toLowerCase().includes(inputValue.toLowerCase()))

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, "-")
    if (normalizedTag && !tags.includes(normalizedTag)) {
      onChange([...tags, normalizedTag])
    }
    setInputValue("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      handleAddTag(inputValue)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            <TagIcon className="h-3 w-3" />
            {tag}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveTag(tag)}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag} tag</span>
            </Button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <div className="flex">
          <SimpleInput
            placeholder="Add tags..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (inputValue) handleAddTag(inputValue)
            }}
            disabled={!inputValue}
            className="ml-2"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add tag</span>
          </Button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
            <div className="py-1">
              {filteredSuggestions.map((tag) => (
                <div
                  key={tag.value}
                  className="flex items-center px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => handleAddTag(tag.value)}
                >
                  <TagIcon className="mr-2 h-3 w-3" />
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

