"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus } from "lucide-react"
import Image from "next/image"
import type { Playlist } from "./music-interface"

interface EditPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlist: Playlist
  onUpdatePlaylist: (id: string, name: string, coverArt?: string) => void
}

export default function EditPlaylistDialog({
  open,
  onOpenChange,
  playlist,
  onUpdatePlaylist,
}: EditPlaylistDialogProps) {
  const [playlistName, setPlaylistName] = useState(playlist.name)
  const [previewUrl, setPreviewUrl] = useState(playlist.coverArt)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update state when playlist changes
  useEffect(() => {
    setPlaylistName(playlist.name)
    setPreviewUrl(playlist.coverArt)
  }, [playlist])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playlistName.trim()) {
      onUpdatePlaylist(playlist.id, playlistName, previewUrl || undefined)
      onOpenChange(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Use FileReader to read the actual file
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          setPreviewUrl(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Playlist name</Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My awesome playlist"
                autoFocus
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover">Playlist cover</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden flex items-center justify-center border">
                  {previewUrl ? (
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Playlist cover preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    id="cover"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Optional. Recommended size: 300x300px</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!playlistName.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

