"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Property } from "@/types/property"
import { formatPrice } from "@/lib/utils"
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function PropertyCard({ property, isFavorite, onToggleFavorite }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge className="absolute top-2 right-2 bg-primary">{property.status}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 left-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all",
              isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onToggleFavorite(property.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          <p className="text-xl font-bold mt-4 text-primary">{formatPrice(property.price)}</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.squareFeet} sqft</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <span className="text-sm text-muted-foreground capitalize">{property.type}</span>
          <span className="text-sm text-muted-foreground">Listed {property.listedDate}</span>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

