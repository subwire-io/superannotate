"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface GalleryImage {
  id: number | string
  src: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  className?: string
}

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handlePrevious = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    }
  }

  const selectedImage = images[selectedImageIndex]

  if (images.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No images to display</div>
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image Display */}
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
        <Image
          src={selectedImage.src || "/placeholder.svg"}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-opacity duration-300"
        />

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Caption (if any) */}
        {selectedImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/70 p-2 backdrop-blur-sm">
            <p className="text-sm text-foreground">{selectedImage.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" role="region" aria-label="Image thumbnails">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
              index === selectedImageIndex
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleThumbnailClick(index)}
            aria-label={`Select image: ${image.alt}`}
            aria-current={index === selectedImageIndex}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

