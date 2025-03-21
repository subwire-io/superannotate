"use client"

import ImageGallery from "@/components/image-gallery"
import { galleryData } from "@/lib/gallery-data"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [category, setCategory] = useState<"nature" | "cities" | "abstract">("nature")

  const categoryData = {
    nature: galleryData.nature,
    cities: galleryData.city,
    abstract: galleryData.abstract,
  }

  return (
    <main className="min-h-screen p-3 md:p-6 bg-background">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 text-center">
          <h1 className="mb-2 text-2xl md:text-3xl font-bold">Image Gallery</h1>
        </header>

        <div className="flex justify-center mb-4 gap-2">
          <Button
            variant={category === "nature" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("nature")}
            className="min-h-[40px]"
          >
            Nature
          </Button>
          <Button
            variant={category === "cities" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("cities")}
            className="min-h-[40px]"
          >
            Cities
          </Button>
          <Button
            variant={category === "abstract" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("abstract")}
            className="min-h-[40px]"
          >
            Abstract
          </Button>
        </div>

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <ImageGallery images={categoryData[category]} />
        </div>
      </div>
    </main>
  )
}

