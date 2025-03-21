import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Pin, Monitor } from "lucide-react"

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
}

export function ParticipantGrid({ participants, isScreenSharing }: ParticipantGridProps) {
  // Calculate grid columns based on participant count
  const getGridCols = (count: number) => {
    if (isScreenSharing) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    if (count <= 1) return "grid-cols-1"
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2"
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
  }

  // Put self at the beginning
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isSelf) return -1
    if (b.isSelf) return 1
    return 0
  })

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
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`grid ${getGridCols(participants.length)} gap-4 h-full`}>
      {sortedParticipants.map((participant) => (
        <ParticipantCard key={participant.id} participant={participant} />
      ))}
    </div>
  )
}

function ParticipantCard({ participant }: { participant: Participant }) {
  const { name, isSelf, isAudioOn, isVideoOn } = participant

  return (
    <Card className="relative overflow-hidden h-full min-h-[200px] flex flex-col">
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
            {participant.isPinned && <Pin className="h-4 w-4" aria-hidden="true" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

