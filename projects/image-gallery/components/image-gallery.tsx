"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset loading state when selected image changes
    setIsLoading(true)
  }, [selectedImageIndex])

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
    <div className={cn("flex flex-col space-y-4 p-4 md:p-6", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image Display */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
        <div className={cn("absolute inset-0 flex items-center justify-center", isLoading ? "block" : "hidden")}>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>

        <Image
          src={selectedImage.src || "/placeholder.svg"}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-contain transition-all duration-300",
            isLoading ? "opacity-0" : "opacity-100 image-fade-in",
          )}
          onLoad={() => setIsLoading(false)}
        />

        {/* Image Info Overlay */}
        {selectedImage.category && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {selectedImage.category}
            </Badge>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm shadow-md hover:bg-background/90 transition-all"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm shadow-md hover:bg-background/90 transition-all"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Image Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fullscreen (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Caption (if any) */}
        {selectedImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/70 p-3 backdrop-blur-sm">
            <p className="text-sm text-foreground">{selectedImage.caption}</p>
          </div>
        )}
      </div>

      {/* Image Counter */}
      <div className="text-sm text-muted-foreground text-center">
        {selectedImageIndex + 1} / {images.length}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" role="region" aria-label="Image thumbnails">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all thumbnail-hover",
              index === selectedImageIndex
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-border hover:border-primary/50",
            )}
            onClick={() => handleThumbnailClick(index)}
            aria-label={`Select image: ${image.alt}`}
            aria-current={index === selectedImageIndex}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

