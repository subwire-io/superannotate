"use client"

import Image from "next/image"
import { Pause, Clock, Trash2 } from "lucide-react"
import type { Playlist, Song } from "./music-interface"
import { Button } from "@/components/ui/button"

interface PlaylistViewProps {
  playlist: Playlist
  onPlaySong: (song: Song) => void
  currentSongId?: string
  isPlaying: boolean
  onRemoveFromPlaylist: (songId: string) => void
}

export default function PlaylistView({
  playlist,
  onPlaySong,
  currentSongId,
  isPlaying,
  onRemoveFromPlaylist,
}: PlaylistViewProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-6">
        <div className="relative h-40 w-40 mx-auto md:mx-0 shadow-lg rounded-md overflow-hidden mb-4 md:mb-0">
          <Image src={playlist.coverArt || "/placeholder.svg"} alt={playlist.name} fill className="object-cover" />
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm font-medium uppercase text-muted-foreground">Playlist</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-2">{playlist.name}</h1>
          <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
        </div>
      </div>

      <div className="mt-8">
        {playlist.songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">This playlist is empty</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add songs from the recommendations or use the heart icon in the player
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-[16px_4fr_3fr_1fr_40px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
              <div className="text-center">#</div>
              <div>Title</div>
              <div>Album</div>
              <div className="flex justify-end">
                <Clock className="h-4 w-4" />
              </div>
              <div></div>
            </div>

            {playlist.songs.map((song, index) => {
              const isCurrentSong = song.id === currentSongId
              return (
                <div
                  key={song.id}
                  className={`grid grid-cols-[1fr_40px] md:grid-cols-[16px_4fr_3fr_1fr_40px] gap-4 px-4 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors ${
                    isCurrentSong ? "bg-accent/50" : ""
                  }`}
                >
                  <div
                    className="hidden md:flex items-center justify-center cursor-pointer"
                    onClick={() => onPlaySong(song)}
                  >
                    {isCurrentSong && isPlaying ? (
                      <Pause className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex items-center cursor-pointer" onClick={() => onPlaySong(song)}>
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
                  <div className="hidden md:flex items-center text-muted-foreground">{song.album}</div>
                  <div className="hidden md:flex items-center justify-end text-muted-foreground">{song.duration}</div>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveFromPlaylist(song.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      <span className="sr-only">Remove from playlist</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

