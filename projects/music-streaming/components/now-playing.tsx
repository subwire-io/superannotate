"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from "lucide-react"
import Image from "next/image"
import type { Song, Playlist } from "./music-interface"

interface NowPlayingProps {
  song: Song
  isPlaying: boolean
  onTogglePlayPause: () => void
  onNextSong: () => void
  onPrevSong: () => void
  onAddToPlaylist: (song: Song) => void
  selectedPlaylist?: Playlist | null
  onRemoveFromPlaylist?: (songId: string) => void
}

export default function NowPlaying({
  song,
  isPlaying,
  onTogglePlayPause,
  onNextSong,
  onPrevSong,
  onAddToPlaylist,
  selectedPlaylist,
  onRemoveFromPlaylist,
}: NowPlayingProps) {
  const [volume, setVolume] = useState(70)
  const [prevVolume, setPrevVolume] = useState(70)
  const isMuted = volume === 0
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 768)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isSmallScreen = windowWidth <= 480

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] > 0) {
      setPrevVolume(value[0])
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
    }
  }

  // Check if the song is in the current playlist
  const isSongInPlaylist = () => {
    if (!selectedPlaylist) return false
    return selectedPlaylist.songs.some((s) => s.id === song.id)
  }

  const inPlaylist = isSongInPlaylist()

  const handleHeartClick = () => {
    if (inPlaylist && onRemoveFromPlaylist) {
      onRemoveFromPlaylist(song.id)
      // Toast is handled in the parent component
    } else {
      onAddToPlaylist(song)
      // Toast is handled in the parent component
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-card border-t flex items-center px-2 md:px-4 z-10">
      {/* Song info - always visible */}
      <div className={`flex items-center ${isSmallScreen ? "w-3/5" : "w-1/3 md:w-1/4"} group`}>
        <div className="relative h-10 w-10 md:h-12 md:w-12 mr-2 md:mr-3 overflow-hidden rounded group-hover:shadow-md transition-shadow duration-200">
          <Image
            src={song.coverArt || "/placeholder.svg"}
            alt={`${song.album} cover`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs md:text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
            {song.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
      </div>

      {/* Controls - simplified on small screens */}
      {isSmallScreen ? (
        <div className="flex items-center justify-end w-2/5 pr-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            onClick={onTogglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-1/3 md:w-2/4">
            <div className="flex items-center space-x-4 mb-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent transition-colors duration-200"
                onClick={onPrevSong}
              >
                <SkipBack className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                onClick={onTogglePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent transition-colors duration-200"
                onClick={onNextSong}
              >
                <SkipForward className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
            <div className="flex items-center w-full space-x-2">
              <span className="text-xs text-muted-foreground">1:21</span>
              <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
              <span className="text-xs text-muted-foreground">{song.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-end w-1/3 md:w-1/4 space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${inPlaylist ? "hover:bg-red-100" : ""}`}
              onClick={handleHeartClick}
            >
              <Heart
                className={`h-4 w-4 ${inPlaylist ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-primary"} transition-colors`}
              />
              <span className="sr-only">{inPlaylist ? "Remove from playlist" : "Add to playlist"}</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
            <Slider value={[volume]} max={100} step={1} className="w-24" onValueChange={handleVolumeChange} />
          </div>
        </>
      )}
    </div>
  )
}

