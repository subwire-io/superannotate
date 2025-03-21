"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import type { Property } from "@/types/property"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Custom map bounds component
const MapBoundsAdjuster = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod
      return function MapBoundsAdjuster({ properties }: { properties: Property[] }) {
        const map = useMap()

        useEffect(() => {
          // Only run in browser
          if (typeof window !== "undefined" && map && properties.length > 0) {
            // Import Leaflet dynamically
            import("leaflet").then((L) => {
              const bounds = L.latLngBounds(properties.map((p) => [p.latitude, p.longitude]))
              map.fitBounds(bounds, { padding: [50, 50] })
            })
          }
        }, [map, properties])

        return null
      }
    }),
  { ssr: false },
)

interface PropertyMapProps {
  properties: Property[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export function PropertyMap({ properties, favorites, onToggleFavorite }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const mapRef = useRef<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)

  // Load Leaflet dynamically on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Fix Leaflet icon issues
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        setLeaflet(L)
        setIsMounted(true)
      })
    }
  }, [])

  // Create custom icon function
  const createCustomIcon = (isFavorite: boolean) => {
    if (!leaflet) return null

    return leaflet.divIcon({
      className: "custom-marker-icon",
      html: `<div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full ${isFavorite ? "bg-red-500" : "bg-primary"} flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>`,
      iconSize: [24, 40],
      iconAnchor: [12, 40],
      popupAnchor: [0, -40],
    })
  }

  if (!isMounted) {
    return (
      <div className="h-[600px] w-full bg-muted flex items-center justify-center rounded-lg border">
        <p>Loading map...</p>
      </div>
    )
  }

  // Default center position
  const center = properties.length > 0 ? [properties[0].latitude, properties[0].longitude] : [40.7128, -74.006] // New York City

  return (
    <div className="space-y-4">
      <div className="h-[600px] w-full rounded-lg overflow-hidden border shadow-md transition-all hover:shadow-lg">
        {/* Import CSS for Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        <MapContainer
          center={[center[0], center[1]] as [number, number]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map: any) => {
            mapRef.current = map
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude] as [number, number]}
              icon={createCustomIcon(favorites.includes(property.id))}
              eventHandlers={{
                click: () => {
                  setSelectedProperty(property)
                },
              }}
            >
              <Popup>
                <div className="p-1 w-[200px]">
                  <div className="relative h-24 w-full mb-2">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="absolute inset-0 w-full h-full object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-sm">{property.title}</h3>
                  <p className="text-xs text-muted-foreground">{property.location}</p>
                  <p className="font-bold text-primary mt-1 text-sm">{formatPrice(property.price)}</p>
                  <p className="text-xs mt-1">
                    {property.bedrooms} beds • {property.bathrooms} baths
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs capitalize">{property.type}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("h-8 px-2", favorites.includes(property.id) ? "text-red-500" : "")}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(property.id)
                      }}
                    >
                      <Heart className={cn("h-4 w-4 mr-1", favorites.includes(property.id) ? "fill-current" : "")} />
                      {favorites.includes(property.id) ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {properties.length > 0 && <MapBoundsAdjuster properties={properties} />}
        </MapContainer>
      </div>

      {selectedProperty && (
        <AlertDialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedProperty.title}</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-md">
                    <img
                      src={selectedProperty.image || "/placeholder.svg"}
                      alt={selectedProperty.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-sm text-primary font-bold">{formatPrice(selectedProperty.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Property Type</p>
                      <p className="text-sm text-muted-foreground capitalize">{selectedProperty.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Listed</p>
                      <p className="text-sm text-muted-foreground">{selectedProperty.listedDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{selectedProperty.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Beds</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{selectedProperty.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Baths</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{selectedProperty.squareFeet}</p>
                      <p className="text-xs text-muted-foreground">Sq Ft</p>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction
                className={cn(
                  favorites.includes(selectedProperty.id)
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-primary hover:bg-primary/90",
                )}
                onClick={() => onToggleFavorite(selectedProperty.id)}
              >
                {favorites.includes(selectedProperty.id) ? "Remove from Favorites" : "Add to Favorites"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

