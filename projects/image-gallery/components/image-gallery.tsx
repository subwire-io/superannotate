"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface GalleryImage {
  id: number | string
  src: string
  alt: string
  caption?: string
  category?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  className?: string
}

export default function ImageGallery({ images = [], className }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Reset selected index if images change
  useEffect(() => {
    if (images.length > 0 && selectedImageIndex >= images.length) {
      setSelectedImageIndex(0)
    }
  }, [images, selectedImageIndex])

  // Reset loading state when selected image changes
  useEffect(() => {
    setIsLoading(true)
  }, [selectedImageIndex])

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handlePrevious = useCallback(() => {
    if (images.length === 0) return
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    if (images.length === 0) return
    setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [images.length])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    },
    [handlePrevious, handleNext],
  )

  // Handle touch swipe for mobile
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // minimum distance to be considered a swipe

    if (diff > threshold) {
      // Swipe left, go to next image
      handleNext()
    } else if (diff < -threshold) {
      // Swipe right, go to previous image
      handlePrevious()
    }
  }

  // Check if images array is empty
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed h-[200px]">
        <h3 className="mb-1 text-lg font-medium">No images to display</h3>
        <p className="max-w-md text-sm">Please try another category.</p>
      </div>
    )
  }

  // Ensure selectedImageIndex is valid
  const validIndex = Math.min(Math.max(0, selectedImageIndex), images.length - 1)
  const selectedImage = images[validIndex]

  return (
    <div ref={galleryRef} className={cn("flex flex-col space-y-3", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image Display */}
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-muted"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}

        <Image
          src={selectedImage?.src || "/placeholder.svg"}
          alt={selectedImage?.alt || "Gallery image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn("object-contain transition-all duration-300", isLoading ? "opacity-0" : "opacity-100")}
          onLoad={() => setIsLoading(false)}
        />

        {/* Caption (if any) */}
        {selectedImage?.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/70 p-2 backdrop-blur-sm">
            <p className="text-sm text-foreground">{selectedImage.caption}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-background/70 backdrop-blur-sm shadow-md hover:bg-background/90 min-h-[40px] min-w-[40px]"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-background/70 backdrop-blur-sm shadow-md hover:bg-background/90 min-h-[40px] min-w-[40px]"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div
        className="flex gap-2 overflow-x-auto p-3 bg-muted/20 rounded-b-lg"
        role="region"
        aria-label="Image thumbnails"
      >
        {images.map((image, index) => (
          <button
            key={image.id || index}
            className={cn(
              "relative overflow-hidden rounded-md border transition-all",
              index === selectedImageIndex
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-border hover:border-primary/50",
              "h-14 w-14 md:h-16 md:w-16 flex-shrink-0 min-h-[44px] min-w-[44px]",
            )}
            onClick={() => handleThumbnailClick(index)}
            aria-label={`Select image: ${image.alt}`}
            aria-current={index === selectedImageIndex}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt=""
              fill
              sizes="(max-width: 768px) 56px, 64px"
              className="object-cover"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

