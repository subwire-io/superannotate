"use client"

import { useState } from "react"
import { Library, PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Playlist } from "./music-interface"
import AddPlaylistDialog from "./add-playlist-dialog"

interface SidebarProps {
  playlists: Playlist[]
  currentView: "playlists" | "recommendations"
  onChangeView: (view: "playlists" | "recommendations") => void
  onSelectPlaylist: (playlist: Playlist) => void
  onAddPlaylist: (name: string, coverArt?: string) => void
  selectedPlaylistId?: string
  isMobile?: boolean
  onClose?: () => void
}

export default function Sidebar({
  playlists,
  currentView,
  onChangeView,
  onSelectPlaylist,
  onAddPlaylist,
  selectedPlaylistId,
  isMobile = false,
  onClose,
}: SidebarProps) {
  const [showAddPlaylistDialog, setShowAddPlaylistDialog] = useState(false)

  return (
    <aside className={cn("bg-card flex flex-col h-full", isMobile ? "w-full" : "w-64 border-r md:block hidden")}>
      <div className="p-6">
        {isMobile ? (
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Musicify</h1>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </Button>
            )}
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-6">Musicify</h1>
        )}
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", currentView === "recommendations" && "bg-accent")}
            onClick={() => onChangeView("recommendations")}
          >
            <Library className="mr-2 h-4 w-4" />
            Recommendations
          </Button>
        </nav>
      </div>

      <div className="px-6 py-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Your Playlists</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => setShowAddPlaylistDialog(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add playlist</span>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-2">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start font-normal mb-1 text-sm",
                  selectedPlaylistId === playlist.id && "bg-accent",
                )}
                onClick={() => onSelectPlaylist(playlist)}
              >
                {playlist.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {showAddPlaylistDialog && (
        <AddPlaylistDialog
          open={showAddPlaylistDialog}
          onOpenChange={setShowAddPlaylistDialog}
          onAddPlaylist={onAddPlaylist}
        />
      )}
    </aside>
  )
}

