export interface Property {
  id: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  image: string
  location: string
  type: string
  status: string
  listedDate: string
  latitude: number
  longitude: number
}

export interface FilterOptions {
  priceRange: [number, number]
  bedrooms: string
  propertyType: string
}

export type SortOption = "default" | "price-asc" | "price-desc" | "newest"

