"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"

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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const galleryRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Reset loading state when selected image changes
  useEffect(() => {
    setIsLoading(true)
  }, [selectedImageIndex])

  // Handle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (galleryRef.current?.requestFullscreen) {
        galleryRef.current
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => console.error(`Error attempting to enable fullscreen: ${err.message}`))
      }
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => console.error(`Error attempting to exit fullscreen: ${err.message}`))
      }
    }
  }, [])

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handlePrevious = useCallback(() => {
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [images.length])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen()
      }
    },
    [handlePrevious, handleNext, isFullscreen],
  )

  // Add global keyboard listener when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreen, handleKeyDown])

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

  const selectedImage = images[selectedImageIndex]

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 md:p-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed h-[300px]">
        <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
          <Image
            src="/images/empty-gallery.svg"
            alt="No images"
            width={64}
            height={64}
            className="h-16 w-16 opacity-70"
          />
        </div>
        <h3 className="mb-1 text-lg font-medium">No images to display</h3>
        <p className="max-w-md text-sm">
          There are no images available in this gallery. Please check back later or try another category.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={galleryRef}
      className={cn(
        "flex flex-col space-y-4 p-3 md:p-6",
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "",
        className,
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Image Display */}
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-1 rounded-full border-2 border-primary/30 border-t-transparent animate-spin animation-delay-200"></div>
            </div>
          </div>
        )}

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
        {selectedImage.category && showInfo && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {selectedImage.category}
            </Badge>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4">
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm shadow-md hover:bg-background/90 transition-all hover:scale-110 focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary",
              "min-h-[44px] min-w-[44px]",
            )}
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm shadow-md hover:bg-background/90 transition-all hover:scale-110 focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary",
              "min-h-[44px] min-w-[44px]",
            )}
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
                  className={cn(
                    "h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all hover:scale-110",
                    "min-h-[40px] min-w-[40px]",
                  )}
                  onClick={() => setShowInfo(!showInfo)}
                  aria-label={showInfo ? "Hide image info" : "Show image info"}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showInfo ? "Hide" : "Show"} image info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all hover:scale-110",
                    "min-h-[40px] min-w-[40px]",
                  )}
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit" : "Enter"} fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Caption (if any) */}
        {selectedImage.caption && showInfo && (
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
              "relative overflow-hidden rounded-md border transition-all duration-200",
              index === selectedImageIndex
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-border hover:border-primary/50",
              "hover:scale-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "h-16 w-16 md:h-20 md:w-20 flex-shrink-0 min-h-[44px] min-w-[44px]",
            )}
            onClick={() => handleThumbnailClick(index)}
            aria-label={`Select image: ${image.alt}`}
            aria-current={index === selectedImageIndex}
          >
            <div className={cn("absolute inset-0 bg-muted/50 flex items-center justify-center", "thumbnail-loading")}>
              <div className="h-4 w-4 rounded-full border-2 border-primary/50 border-t-transparent animate-spin"></div>
            </div>
            <Image
              src={image.src || "/placeholder.svg"}
              alt=""
              fill
              sizes="(max-width: 768px) 64px, 80px"
              className="object-cover"
              aria-hidden="true"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement
                const parent = target.parentElement
                if (parent) {
                  const loader = parent.querySelector(".thumbnail-loading")
                  if (loader) {
                    loader.classList.add("opacity-0")
                  }
                }
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

