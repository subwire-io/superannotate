"use client"

import Image from "next/image"
import { useMemo } from "react"

interface PlaceholderImageProps {
  title: string
  artist?: string
  width: number
  height: number
  className?: string
  alt: string
}

export default function PlaceholderImage({ title, artist, width, height, className = "", alt }: PlaceholderImageProps) {
  // Generate a consistent color based on the title
  const backgroundColor = useMemo(() => {
    const hash = title.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return `hsl(${hash % 360}, 70%, 60%)`
  }, [title])

  // Generate a placeholder URL with the title and background color
  const placeholderUrl = `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(
    artist ? `${title} - ${artist}` : title,
  )}&bg=${encodeURIComponent(backgroundColor.replace("#", ""))}&textColor=ffffff`

  return (
    <Image src={placeholderUrl || "/placeholder.svg"} alt={alt} width={width} height={height} className={className} />
  )
}

