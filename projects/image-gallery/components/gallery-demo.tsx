"use client"

import { useState } from "react"
import ImageGallery, { type GalleryImage } from "./image-gallery"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const natureImages: GalleryImage[] = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Mountain landscape",
    caption: "Beautiful mountain landscape with a lake",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Ocean sunset",
    caption: "Sunset over the ocean horizon",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Forest",
    caption: "Dense forest with sunlight streaming through the trees",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Desert",
    caption: "Desert landscape with cactus plants",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Snowy mountains",
    caption: "Snowy mountains under clear blue sky",
  },
]

const cityImages: GalleryImage[] = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "New York skyline",
    caption: "New York City skyline at night",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Tokyo street",
    caption: "Busy street in Tokyo with neon lights",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Paris",
    caption: "Eiffel Tower in Paris, France",
  },
]

export default function GalleryDemo() {
  const [showCaptions, setShowCaptions] = useState(true)

  // Create modified image arrays based on caption visibility
  const processedNatureImages = natureImages.map((img) => ({
    ...img,
    caption: showCaptions ? img.caption : undefined,
  }))

  const processedCityImages = cityImages.map((img) => ({
    ...img,
    caption: showCaptions ? img.caption : undefined,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery</h2>
        <Button variant="outline" onClick={() => setShowCaptions(!showCaptions)}>
          {showCaptions ? "Hide Captions" : "Show Captions"}
        </Button>
      </div>

      <Tabs defaultValue="nature" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="nature">Nature</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
        </TabsList>
        <TabsContent value="nature">
          <ImageGallery images={processedNatureImages} />
        </TabsContent>
        <TabsContent value="cities">
          <ImageGallery images={processedCityImages} />
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-2 font-medium">How to use</h3>
        <p className="text-sm text-muted-foreground">
          Click on thumbnails to view different images. Use the arrow buttons or keyboard left/right arrows to navigate.
          Toggle the button above to show or hide image captions. Switch between tabs to view different image
          collections.
        </p>
      </div>
    </div>
  )
}

