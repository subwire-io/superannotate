"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus } from "lucide-react"
import Image from "next/image"

interface AddPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPlaylist: (name: string, coverArt?: string) => void
}

export default function AddPlaylistDialog({ open, onOpenChange, onAddPlaylist }: AddPlaylistDialogProps) {
  const [playlistName, setPlaylistName] = useState("")
  const [coverArt, setCoverArt] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playlistName.trim()) {
      onAddPlaylist(playlistName, coverArt || undefined)
      setPlaylistName("")
      setCoverArt("")
      setPreviewUrl("")
      onOpenChange(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For demo purposes, we'll just create a placeholder URL
      // In a real app, you would upload this to a server and get a URL back
      const placeholderUrl = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(file.name)}&bg=FF8C42&textColor=ffffff`
      setCoverArt(placeholderUrl)
      setPreviewUrl(placeholderUrl)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new playlist</DialogTitle>
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
                  <Input id="cover" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("cover")?.click()}
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

