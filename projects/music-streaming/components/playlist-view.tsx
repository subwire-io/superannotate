"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Pause, Clock, Trash2, MoreHorizontal, Pencil } from "lucide-react"
import type { Playlist, Song } from "./music-interface"
import { Button } from "@/components/ui/button"
import ConfirmDialog from "./confirm-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EditPlaylistDialog from "./edit-playlist-dialog"

interface PlaylistViewProps {
  playlist: Playlist
  onPlaySong: (song: Song) => void
  currentSongId?: string
  isPlaying: boolean
  onRemoveFromPlaylist: (songId: string) => void
  onUpdatePlaylist: (id: string, name: string, coverArt?: string) => void
  onDeletePlaylist: (id: string) => void
}

export default function PlaylistView({
  playlist,
  onPlaySong,
  currentSongId,
  isPlaying,
  onRemoveFromPlaylist,
  onUpdatePlaylist,
  onDeletePlaylist,
}: PlaylistViewProps) {
  const [songToDelete, setSongToDelete] = useState<Song | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeletePlaylistDialog, setShowDeletePlaylistDialog] = useState(false)
  const [showEditPlaylistDialog, setShowEditPlaylistDialog] = useState(false)
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

  const handleDeleteClick = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation()
    setSongToDelete(song)
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    if (songToDelete) {
      onRemoveFromPlaylist(songToDelete.id)
      setSongToDelete(null)
    }
    setShowConfirmDialog(false)
  }

  const handleDeletePlaylist = () => {
    onDeletePlaylist(playlist.id)
    setShowDeletePlaylistDialog(false)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-6">
        <div className="relative h-40 w-40 mx-auto md:mx-0 shadow-lg rounded-md overflow-hidden mb-4 md:mb-0">
          <Image src={playlist.coverArt || "/placeholder.svg"} alt={playlist.name} fill className="object-cover" />
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase text-muted-foreground">Playlist</p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-2">{playlist.name}</h1>
              <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
              {isMobile ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => setShowEditPlaylistDialog(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeletePlaylistDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditPlaylistDialog(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setShowDeletePlaylistDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
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
                  className={`grid grid-cols-[1fr_40px] md:grid-cols-[16px_4fr_3fr_1fr_40px] gap-4 px-4 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors group ${
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
                      className="h-8 w-8 opacity-70 md:opacity-0 md:group-hover:opacity-100 hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(e, song)}
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

      {songToDelete && (
        <ConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          title="Remove song"
          description={`Are you sure you want to remove "${songToDelete.title}" from this playlist?`}
          onConfirm={handleConfirmDelete}
          confirmText="Remove"
          cancelText="Cancel"
        />
      )}

      <ConfirmDialog
        open={showDeletePlaylistDialog}
        onOpenChange={setShowDeletePlaylistDialog}
        title="Delete playlist"
        description={`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`}
        onConfirm={handleDeletePlaylist}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {showEditPlaylistDialog && (
        <EditPlaylistDialog
          open={showEditPlaylistDialog}
          onOpenChange={setShowEditPlaylistDialog}
          playlist={playlist}
          onUpdatePlaylist={onUpdatePlaylist}
        />
      )}
    </div>
  )
}

