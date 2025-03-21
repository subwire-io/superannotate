export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface Category {
  value: string
  label: string
}

