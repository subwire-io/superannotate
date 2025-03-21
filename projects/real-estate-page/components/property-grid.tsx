import { PropertyCard } from "./property-card"
import type { Property } from "@/types/property"
import { Loader2 } from "lucide-react"

interface PropertyGridProps {
  properties: Property[]
  isLoading: boolean
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export function PropertyGrid({ properties, isLoading, favorites, onToggleFavorite }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <h3 className="text-xl font-medium">No properties found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters to see more results</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}

