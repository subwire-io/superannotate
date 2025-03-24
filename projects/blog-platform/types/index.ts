export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string // Now required
  tags: string[] // Added tags for more complexity
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  viewCount?: number // Added for analytics
  scheduledToPublish?: boolean // Added for scheduled publishing
}

export interface Category {
  value: string
  label: string
}

export interface Tag {
  value: string
  label: string
}

export type SortField = "title" | "category" | "updatedAt" | "createdAt" | "publishedAt" | "viewCount"
export type SortDirection = "asc" | "desc"

export interface PostFilter {
  search?: string
  category?: string
  tags?: string[]
  status?: "all" | "published" | "draft" | "scheduled"
}

