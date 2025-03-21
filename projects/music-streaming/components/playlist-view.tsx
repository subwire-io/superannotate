"use client"

import Image from "next/image"
import { Pause, Clock } from "lucide-react"
import type { Playlist, Song } from "./music-interface"
import { Button } from "@/components/ui/button"

interface PlaylistViewProps {
  playlist: Playlist
  onPlaySong: (song: Song) => void
  currentSongId?: string
  isPlaying: boolean
}

export default function PlaylistView({ playlist, onPlaySong, currentSongId, isPlaying }: PlaylistViewProps) {
  return (
    <div className="p-6">
      <div className="flex items-end space-x-6 mb-6">
        <div className="relative h-40 w-40 shadow-lg rounded-md overflow-hidden">
          <Image src={playlist.coverArt || "/placeholder.svg"} alt={playlist.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Playlist</p>
          <h1 className="text-3xl font-bold mt-1 mb-2">{playlist.name}</h1>
          <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
        </div>
      </div>

      <div className="mt-8">
        {playlist.songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">This playlist is empty</p>
            <Button variant="outline">Add songs to this playlist</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
              <div className="text-center">#</div>
              <div>Title</div>
              <div>Album</div>
              <div className="flex justify-end">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            {playlist.songs.map((song, index) => {
              const isCurrentSong = song.id === currentSongId
              return (
                <div
                  key={song.id}
                  className={`grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors ${
                    isCurrentSong ? "bg-accent/50" : ""
                  }`}
                  onClick={() => onPlaySong(song)}
                >
                  <div className="flex items-center justify-center">
                    {isCurrentSong && isPlaying ? (
                      <Pause className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 mr-3 rounded overflow-hidden">
                      <Image
                        src={song.coverArt || "/placeholder.svg"}
                        alt={`${song.title} by ${song.artist}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className={`font-medium ${isCurrentSong ? "text-primary" : ""}`}>{song.title}</p>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">{song.album}</div>
                  <div className="flex items-center justify-end text-muted-foreground">{song.duration}</div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

