import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Post, SortField, SortDirection, PostFilter } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date helper
export function formatDate(date: Date | undefined) {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

// Sort posts helper
export function sortPosts(posts: Post[], field: SortField, direction: SortDirection): Post[] {
  return [...posts].sort((a, b) => {
    let valueA: any = a[field]
    let valueB: any = b[field]

    // Handle dates
    if (field.includes("At") && valueA && valueB) {
      valueA = new Date(valueA).getTime()
      valueB = new Date(valueB).getTime()
    }

    // Handle missing values
    if (valueA === undefined || valueA === null) return direction === "asc" ? 1 : -1
    if (valueB === undefined || valueB === null) return direction === "asc" ? -1 : 1

    // String comparison
    if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Number comparison
    return direction === "asc" ? valueA - valueB : valueB - valueA
  })
}

// Filter posts helper
export function filterPosts(posts: Post[], filter: PostFilter): Post[] {
  return posts.filter((post) => {
    // Filter by search term
    if (
      filter.search &&
      !post.title.toLowerCase().includes(filter.search.toLowerCase()) &&
      !post.content.toLowerCase().includes(filter.search.toLowerCase()) &&
      !post.excerpt.toLowerCase().includes(filter.search.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (filter.category && post.category !== filter.category) {
      return false
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      if (!post.tags || !filter.tags.some((tag) => post.tags.includes(tag))) {
        return false
      }
    }

    // Filter by status
    if (filter.status === "published" && !post.published) {
      return false
    }
    if (filter.status === "draft" && post.published) {
      return false
    }

    return true
  })
}

