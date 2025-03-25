"use client"

import { useState, useCallback } from "react"
import Sidebar from "./sidebar"
import NowPlaying from "./now-playing"
import PlaylistView from "./playlist-view"
import RecommendationsView from "./recommendations-view"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import AddPlaylistDialog from "./add-playlist-dialog"
import SelectPlaylistDialog from "./select-playlist-dialog"
import { toast } from "sonner"

export type Song = {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  coverArt: string
}

export type Playlist = {
  id: string
  name: string
  songs: Song[]
  coverArt: string
}

export default function MusicInterface() {
  const [currentView, setCurrentView] = useState<"playlists" | "recommendations">("playlists")
  const [currentSong, setCurrentSong] = useState<Song | null>(sampleSongs[0])
  const [playlists, setPlaylists] = useState<Playlist[]>(samplePlaylists)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(samplePlaylists[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showAddPlaylistDialog, setShowAddPlaylistDialog] = useState(false)
  const [showSelectPlaylistDialog, setShowSelectPlaylistDialog] = useState(false)
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null)
  const selectedPlaylistId = selectedPlaylist?.id

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      // Toggle play/pause if it's the same song
      setIsPlaying(!isPlaying)
    } else {
      // Play new song
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleNextSong = useCallback(() => {
    if (selectedPlaylist && currentSong) {
      const currentIndex = selectedPlaylist.songs.findIndex((song) => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % selectedPlaylist.songs.length
      setCurrentSong(selectedPlaylist.songs[nextIndex])
    }
  }, [selectedPlaylist, currentSong])

  const handlePrevSong = useCallback(() => {
    if (selectedPlaylist && currentSong) {
      const currentIndex = selectedPlaylist.songs.findIndex((song) => song.id === currentSong.id)
      const prevIndex = (currentIndex - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length
      setCurrentSong(selectedPlaylist.songs[prevIndex])
    }
  }, [selectedPlaylist, currentSong])

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setCurrentView("playlists")
    setIsSidebarOpen(false)
  }

  const handleAddPlaylist = (name: string, coverArt?: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${playlists.length + 1}`,
      name,
      songs: [],
      coverArt:
        coverArt || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(name)}&bg=42FF71&textColor=333333`,
    }

    setPlaylists([...playlists, newPlaylist])
    setSelectedPlaylist(newPlaylist)
    setCurrentView("playlists")

    toast.success("Playlist created", {
      description: `"${name}" has been added to your playlists.`,
    })
  }

  const handleAddToPlaylist = (song: Song) => {
    if (playlists.length === 0) {
      toast.error("No playlists available", {
        description: "Create a playlist first before adding songs.",
      })
      return
    }

    setSongToAddToPlaylist(song)
    setShowSelectPlaylistDialog(true)
  }

  const handleAddToSpecificPlaylist = (playlistId: string, song: Song) => {
    const targetPlaylist = playlists.find((p) => p.id === playlistId)
    if (!targetPlaylist) return

    // Check if song is already in the playlist
    if (targetPlaylist.songs.some((s) => s.id === song.id)) {
      toast.info("Already in playlist", {
        description: `"${song.title}" is already in "${targetPlaylist.name}".`,
      })
      return
    }

    // Add song to the selected playlist
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: [...playlist.songs, song],
        }
      }
      return playlist
    })

    setPlaylists(updatedPlaylists)

    // If this is the currently selected playlist, update it too
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist({
        ...selectedPlaylist,
        songs: [...selectedPlaylist.songs, song],
      })
    }

    toast.success("Added to playlist", {
      description: `"${song.title}" has been added to "${targetPlaylist.name}".`,
    })
  }

  const handleRemoveFromPlaylist = (songId: string) => {
    if (!selectedPlaylist) return

    const songToRemove = selectedPlaylist.songs.find((s) => s.id === songId)
    if (!songToRemove) return

    // Remove song from the selected playlist
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === selectedPlaylist.id) {
        return {
          ...playlist,
          songs: playlist.songs.filter((song) => song.id !== songId),
        }
      }
      return playlist
    })

    setPlaylists(updatedPlaylists)
    setSelectedPlaylist({
      ...selectedPlaylist,
      songs: selectedPlaylist.songs.filter((song) => song.id !== songId),
    })

    toast.success("Removed from playlist", {
      description: `"${songToRemove.title}" has been removed from "${selectedPlaylist.name}".`,
    })
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        playlists={playlists}
        currentView={currentView}
        onChangeView={setCurrentView}
        onSelectPlaylist={handleSelectPlaylist}
        onAddPlaylist={handleAddPlaylist}
        selectedPlaylistId={selectedPlaylist?.id}
      />

      {/* Mobile Header with Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b flex items-center justify-between px-4 z-20">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        <h1 className="text-xl font-bold">Musicify</h1>
      </div>

      {/* Mobile Sidebar Sheet - Now opens from the left to match the menu button */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <Sidebar
              playlists={playlists}
              currentView={currentView}
              onChangeView={(view) => {
                setCurrentView(view)
                setIsSidebarOpen(false)
              }}
              onSelectPlaylist={handleSelectPlaylist}
              onAddPlaylist={handleAddPlaylist}
              selectedPlaylistId={selectedPlaylist?.id}
              isMobile={true}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto pb-24 md:pb-20 pt-14 md:pt-0">
        {currentView === "playlists" && selectedPlaylist ? (
          <PlaylistView
            playlist={selectedPlaylist}
            onPlaySong={handlePlaySong}
            currentSongId={currentSong?.id}
            isPlaying={isPlaying}
            onRemoveFromPlaylist={handleRemoveFromPlaylist}
          />
        ) : (
          <RecommendationsView
            recommendations={recommendedSongs}
            onPlaySong={handlePlaySong}
            currentSongId={currentSong?.id}
            isPlaying={isPlaying}
            onAddToPlaylist={handleAddToPlaylist}
          />
        )}
      </main>

      {currentSong && (
        <NowPlaying
          song={currentSong}
          isPlaying={isPlaying}
          onTogglePlayPause={togglePlayPause}
          onNextSong={handleNextSong}
          onPrevSong={handlePrevSong}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}

      {showAddPlaylistDialog && (
        <AddPlaylistDialog
          open={showAddPlaylistDialog}
          onOpenChange={setShowAddPlaylistDialog}
          onAddPlaylist={handleAddPlaylist}
        />
      )}

      {showSelectPlaylistDialog && songToAddToPlaylist && (
        <SelectPlaylistDialog
          open={showSelectPlaylistDialog}
          onOpenChange={setShowSelectPlaylistDialog}
          playlists={playlists}
          song={songToAddToPlaylist}
          onAddToPlaylist={handleAddToSpecificPlaylist}
        />
      )}
    </div>
  )
}

// Sample data with distinct placeholder images
const sampleSongs: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    coverArt: "/placeholder.svg?height=300&width=300&text=Blinding+Lights&bg=FF5A5A&textColor=ffffff",
  },
  {
    id: "2",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:35",
    coverArt: "/placeholder.svg?height=300&width=300&text=Save+Your+Tears&bg=5A7FFF&textColor=ffffff",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    coverArt: "/placeholder.svg?height=300&width=300&text=Levitating&bg=9D5AFF&textColor=ffffff",
  },
  {
    id: "4",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:03",
    coverArt: "/placeholder.svg?height=300&width=300&text=Don't+Start+Now&bg=5AFFB0&textColor=333333",
  },
  {
    id: "5",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    coverArt: "/placeholder.svg?height=300&width=300&text=Watermelon+Sugar&bg=FF5AE8&textColor=ffffff",
  },
]

const samplePlaylists: Playlist[] = [
  {
    id: "1",
    name: "My Favorites",
    songs: sampleSongs.slice(0, 3),
    coverArt: "/placeholder.svg?height=300&width=300&text=My+Favorites&bg=FF8C42&textColor=ffffff",
  },
  {
    id: "2",
    name: "Workout Mix",
    songs: sampleSongs.slice(2, 5),
    coverArt: "/placeholder.svg?height=300&width=300&text=Workout+Mix&bg=42C2FF&textColor=ffffff",
  },
  {
    id: "3",
    name: "Chill Vibes",
    songs: sampleSongs.slice(1, 4),
    coverArt: "/placeholder.svg?height=300&width=300&text=Chill+Vibes&bg=42FF71&textColor=333333",
  },
]

const recommendedSongs: Song[] = [
  {
    id: "6",
    title: "Circles",
    artist: "Post Malone",
    album: "Hollywood's Bleeding",
    duration: "3:35",
    coverArt: "/placeholder.svg?height=300&width=300&text=Circles&bg=FFD25A&textColor=333333",
  },
  {
    id: "7",
    title: "Adore You",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "3:27",
    coverArt: "/placeholder.svg?height=300&width=300&text=Adore+You&bg=5AFFEA&textColor=333333",
  },
  {
    id: "8",
    title: "Dynamite",
    artist: "BTS",
    album: "BE",
    duration: "3:19",
    coverArt: "/placeholder.svg?height=300&width=300&text=Dynamite&bg=FF5A5A&textColor=ffffff",
  },
  {
    id: "9",
    title: "Mood",
    artist: "24kGoldn ft. iann dior",
    album: "El Dorado",
    duration: "2:21",
    coverArt: "/placeholder.svg?height=300&width=300&text=Mood&bg=A35AFF&textColor=ffffff",
  },
]

