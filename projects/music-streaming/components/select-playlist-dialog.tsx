"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import type { Playlist, Song } from "./music-interface"

interface SelectPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlists: Playlist[]
  song: Song
  onAddToPlaylist: (playlistId: string, song: Song) => void
}

export default function SelectPlaylistDialog({
  open,
  onOpenChange,
  playlists,
  song,
  onAddToPlaylist,
}: SelectPlaylistDialogProps) {
  const handleSelectPlaylist = (playlistId: string) => {
    onAddToPlaylist(playlistId, song)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to playlist</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select a playlist to add "{song.title}" by {song.artist}
          </p>

          {playlists.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              You don't have any playlists yet. Create one first!
            </p>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-2 hover:bg-accent"
                    onClick={() => handleSelectPlaylist(playlist.id)}
                  >
                    <div className="flex items-center w-full">
                      <div className="relative h-12 w-12 mr-3 rounded overflow-hidden">
                        <Image
                          src={playlist.coverArt || "/placeholder.svg"}
                          alt={playlist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{playlist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

