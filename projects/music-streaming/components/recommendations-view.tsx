"use client"

import type React from "react"

import Image from "next/image"
import { Play, Pause, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Song, Playlist } from "./music-interface"
import { useEffect, useState } from "react"

interface RecommendationsViewProps {
  recommendations: Song[]
  onPlaySong: (song: Song) => void
  currentSongId?: string
  isPlaying: boolean
  onAddToPlaylist: (song: Song) => void
  onRemoveFromPlaylist: (songId: string) => void
  selectedPlaylist: Playlist | null
}

export default function RecommendationsView({
  recommendations,
  onPlaySong,
  currentSongId,
  isPlaying,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  selectedPlaylist,
}: RecommendationsViewProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Check if a song is in the current playlist
  const isSongInPlaylist = (songId: string) => {
    if (!selectedPlaylist) return false
    return selectedPlaylist.songs.some((song) => song.id === songId)
  }

  // Handle heart button click
  const handleHeartClick = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation()
    if (isSongInPlaylist(song.id)) {
      onRemoveFromPlaylist(song.id)
    } else {
      onAddToPlaylist(song)
    }
  }

  // Handle card click to play song
  const handleCardClick = (song: Song) => {
    onPlaySong(song)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recommended for You</h1>

      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">No recommendations available</p>
          <p className="text-sm text-muted-foreground">
            Try listening to more music to get personalized recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((song) => {
            const isCurrentSong = song.id === currentSongId
            const inPlaylist = isSongInPlaylist(song.id)

            return (
              <div key={song.id} className="group relative cursor-pointer" onClick={() => handleCardClick(song)}>
                <div className="relative aspect-square overflow-hidden rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={song.coverArt || "/placeholder.svg"}
                    alt={`${song.title} by ${song.artist}`}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isCurrentSong ? "brightness-75" : ""
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center ${
                      isCurrentSong || isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    } transition-opacity duration-300`}
                  >
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-lg transform scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPlaySong(song)
                        }}
                      >
                        {isCurrentSong && isPlaying ? (
                          <Pause className="h-5 w-5 fill-current" />
                        ) : (
                          <Play className="h-5 w-5 fill-current" />
                        )}
                        <span className="sr-only">
                          {isCurrentSong && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                        </span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className={`rounded-full shadow-lg transform scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ${
                          inPlaylist ? "bg-red-100 hover:bg-red-200" : ""
                        }`}
                        onClick={(e) => handleHeartClick(e, song)}
                      >
                        <Heart className={`h-5 w-5 ${inPlaylist ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="sr-only">{inPlaylist ? "Remove from playlist" : "Add to playlist"}</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-start">
                  <div>
                    <h3
                      className={`font-medium line-clamp-1 group-hover:text-primary transition-colors duration-300 ${
                        isCurrentSong ? "text-primary" : ""
                      }`}
                    >
                      {song.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

