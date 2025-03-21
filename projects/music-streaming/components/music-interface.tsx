"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import NowPlaying from "./now-playing"
import PlaylistView from "./playlist-view"
import RecommendationsView from "./recommendations-view"
import { Toaster } from "@/components/ui/toaster"

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
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        playlists={playlists}
        currentView={currentView}
        onChangeView={setCurrentView}
        onSelectPlaylist={handleSelectPlaylist}
        selectedPlaylistId={selectedPlaylist?.id}
      />
      <main className="flex-1 overflow-auto pb-24">
        {currentView === "playlists" && selectedPlaylist ? (
          <PlaylistView
            playlist={selectedPlaylist}
            onPlaySong={handlePlaySong}
            currentSongId={currentSong?.id}
            isPlaying={isPlaying}
          />
        ) : (
          <RecommendationsView recommendations={recommendedSongs} onPlaySong={handlePlaySong} />
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

