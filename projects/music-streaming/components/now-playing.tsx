"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import Image from "next/image"
import type { Song } from "./music-interface"

interface NowPlayingProps {
  song: Song
  isPlaying: boolean
  onTogglePlayPause: () => void
  onNextSong: () => void
  onPrevSong: () => void
}

export default function NowPlaying({ song, isPlaying, onTogglePlayPause, onNextSong, onPrevSong }: NowPlayingProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t flex items-center px-4 z-10">
      <div className="flex items-center w-1/4 group">
        <div className="relative h-12 w-12 mr-3 overflow-hidden rounded group-hover:shadow-md transition-shadow duration-200">
          <Image
            src={song.coverArt || "/placeholder.svg"}
            alt={`${song.album} cover`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {song.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-2/4">
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

      <div className="flex items-center justify-end w-1/4">
        <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
        <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
      </div>
    </div>
  )
}

