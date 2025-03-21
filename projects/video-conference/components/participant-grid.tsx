"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Pin, Monitor, Search } from "lucide-react"

interface Participant {
  id: number
  name: string
  isSelf: boolean
  isAudioOn: boolean
  isVideoOn: boolean
  isPinned: boolean
}

interface ParticipantGridProps {
  participants: Participant[]
  isScreenSharing: boolean
  searchTerm?: string
  onPinParticipant: (participantId: number) => void
}

export function ParticipantGrid({
  participants,
  isScreenSharing,
  searchTerm = "",
  onPinParticipant,
}: ParticipantGridProps) {
  // Calculate grid columns based on participant count
  const getGridCols = (count: number) => {
    if (isScreenSharing) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    if (count <= 1) return "grid-cols-1"
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2"
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
  }

  // Put self at the beginning, then pinned participants
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.isSelf) return -1
    if (b.isSelf) return 1
    return 0
  })

  // If no participants after filtering
  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <Search className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-lg font-medium">No participants found</p>
        <p className="text-sm">Try a different search term</p>
      </div>
    )
  }

  // If screen sharing, change layout
  if (isScreenSharing) {
    return (
      <div className="flex flex-col h-full gap-4">
        <div className="flex-1 bg-black rounded-lg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Monitor className="h-20 w-20 text-gray-500" aria-hidden="true" />
            <span className="sr-only">Screen sharing is active</span>
          </div>
          <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-600">Screen Share</Badge>
        </div>
        <div className={`grid ${getGridCols(participants.length)} gap-4 h-1/4`}>
          {sortedParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onPin={() => onPinParticipant(participant.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  // If there's a pinned participant, show them larger
  const pinnedParticipant = participants.find((p) => p.isPinned)

  if (pinnedParticipant) {
    const otherParticipants = participants.filter((p) => !p.isPinned)

    return (
      <div className="flex flex-col h-full gap-4">
        <div className="flex-1">
          <ParticipantCard
            participant={pinnedParticipant}
            onPin={() => onPinParticipant(pinnedParticipant.id)}
            isPrimary
          />
        </div>
        <div className={`grid ${getGridCols(otherParticipants.length)} gap-4 h-1/4`}>
          {otherParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onPin={() => onPinParticipant(participant.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`grid ${getGridCols(participants.length)} gap-4 h-full`}>
      {sortedParticipants.map((participant) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
          onPin={() => onPinParticipant(participant.id)}
        />
      ))}
    </div>
  )
}

interface ParticipantCardProps {
  participant: Participant
  onPin: () => void
  isPrimary?: boolean
}

function ParticipantCard({ participant, onPin, isPrimary = false }: ParticipantCardProps) {
  const { name, isSelf, isAudioOn, isVideoOn, isPinned } = participant

  return (
    <Card
      className={`relative overflow-hidden h-full min-h-[200px] flex flex-col transition-all hover:shadow-lg cursor-pointer group ${isPinned ? "ring-2 ring-primary" : ""}`}
    >
      <CardContent className="p-0 flex-1 bg-gray-900 flex flex-col justify-end">
        {isVideoOn ? (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
            {/* In a real app, this would be a video element */}
            <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
            </div>
          </div>
        )}

        <div className="relative p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">{isSelf ? `${name} (You)` : name}</span>
              {isAudioOn ? (
                <Mic className="h-4 w-4" aria-hidden="true" />
              ) : (
                <MicOff className="h-4 w-4 text-red-500" aria-hidden="true" />
              )}
            </div>
            {isPinned && <Pin className="h-4 w-4" aria-hidden="true" />}
          </div>
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            className={`bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors ${isPinned ? "bg-primary/50" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              onPin()
            }}
            aria-label={isPinned ? "Unpin participant" : "Pin participant"}
            title={isPinned ? "Unpin participant" : "Pin participant"}
          >
            <Pin className={`h-5 w-5 ${isPinned ? "text-primary-foreground" : "text-white"}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

