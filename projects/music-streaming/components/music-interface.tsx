"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import NowPlaying from "./now-playing"
import PlaylistView from "./playlist-view"
import RecommendationsView from "./recommendations-view"
import { Toaster } from "@/components/ui/toaster"
import { Menu, X, Library, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import AddPlaylistDialog from "./add-playlist-dialog"

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
  const selectedPlaylistId = selectedPlaylist?.id

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextSong = () => {
    if (selectedPlaylist && currentSong) {
      const currentIndex = selectedPlaylist.songs.findIndex((song) => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % selectedPlaylist.songs.length
      setCurrentSong(selectedPlaylist.songs[nextIndex])
    }
  }

  const handlePrevSong = () => {
    if (selectedPlaylist && currentSong) {
      const currentIndex = selectedPlaylist.songs.findIndex((song) => song.id === currentSong.id)
      const prevIndex = (currentIndex - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length
      setCurrentSong(selectedPlaylist.songs[prevIndex])
    }
  }

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setCurrentView("playlists")
    setIsSidebarOpen(false)
  }

  const handleAddPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${playlists.length + 1}`,
      name,
      songs: [],
      coverArt: `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(name)}&bg=42FF71&textColor=333333`,
    }

    setPlaylists([...playlists, newPlaylist])
    setSelectedPlaylist(newPlaylist)
    setCurrentView("playlists")
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
        <h1 className="text-xl font-bold">Musicify</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Musicify</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${currentView === "recommendations" ? "bg-accent" : ""}`}
                  onClick={() => {
                    setCurrentView("recommendations")
                    setIsSidebarOpen(false)
                  }}
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
                className="h-8 w-8"
                onClick={() => {
                  setShowAddPlaylistDialog(true)
                  setIsSidebarOpen(false)
                }}
              >
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add playlist</span>
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="px-6 py-2">
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant="ghost"
                    className={`w-full justify-start font-normal mb-1 text-sm ${
                      selectedPlaylistId === playlist.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectPlaylist(playlist)}
                  >
                    {playlist.name}
                  </Button>
                ))}
              </div>
            </div>
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
          />
        ) : (
          <RecommendationsView
            recommendations={recommendedSongs}
            onPlaySong={handlePlaySong}
            currentSongId={currentSong?.id}
            isPlaying={isPlaying}
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
        />
      )}

      {showAddPlaylistDialog && (
        <AddPlaylistDialog
          open={showAddPlaylistDialog}
          onOpenChange={setShowAddPlaylistDialog}
          onAddPlaylist={(name) => {
            handleAddPlaylist(name)
            setShowAddPlaylistDialog(false)
          }}
        />
      )}

      <Toaster />
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

