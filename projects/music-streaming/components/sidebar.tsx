"use client"

import { useState } from "react"
import { Home, Search, Library, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Playlist } from "./music-interface"
import { useToast } from "@/components/ui/use-toast"
import AddPlaylistDialog from "./add-playlist-dialog"

interface SidebarProps {
  playlists: Playlist[]
  currentView: "playlists" | "recommendations"
  onChangeView: (view: "playlists" | "recommendations") => void
  onSelectPlaylist: (playlist: Playlist) => void
  selectedPlaylistId?: string
}

export default function Sidebar({
  playlists,
  currentView,
  onChangeView,
  onSelectPlaylist,
  selectedPlaylistId,
}: SidebarProps) {
  const [showAddPlaylistDialog, setShowAddPlaylistDialog] = useState(false)
  const { toast } = useToast()

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Musicify</h1>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => onChangeView("playlists")}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              // Show a toast notification for now
              toast({
                title: "Search functionality",
                description: "Search feature will be implemented in the next update.",
              })
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
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
          onClick={() => {
            // Show dialog for adding new playlist
            setShowAddPlaylistDialog(true)
          }}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add playlist</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
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
      {showAddPlaylistDialog && (
        <AddPlaylistDialog
          open={showAddPlaylistDialog}
          onOpenChange={setShowAddPlaylistDialog}
          onAddPlaylist={(name) => {
            // This would be handled by the parent component
            toast({
              title: "Playlist created",
              description: `"${name}" has been added to your playlists.`,
            })
          }}
        />
      )}
    </div>
  )
}

