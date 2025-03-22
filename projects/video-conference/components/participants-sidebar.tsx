"use client"

import { Button } from "@/components/ui/button"
import { X, Mic, MicOff, Video, VideoOff, Pin } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Participant {
  id: number
  name: string
  isSelf: boolean
  isAudioOn: boolean
  isVideoOn: boolean
  isPinned: boolean
}

interface ParticipantsSidebarProps {
  participants: Participant[]
  onClose: () => void
  onPinParticipant: (participantId: number) => void
  isOpen: boolean
}

export function ParticipantsSidebar({ participants, onClose, onPinParticipant, isOpen }: ParticipantsSidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const ParticipantsContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-medium text-lg">Participants ({participants.length})</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
          aria-label="Close participants"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Participants list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                participant.isPinned ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Participant avatar */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    participant.isVideoOn ? "bg-gradient-to-br from-purple-900 to-indigo-900" : "bg-gray-700"
                  }`}
                >
                  <span className="text-white font-medium">{participant.name.charAt(0)}</span>
                </div>

                {/* Participant info */}
                <div>
                  <p className="font-medium">{participant.isSelf ? `${participant.name} (You)` : participant.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {participant.isAudioOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3 text-red-500" />}
                    {participant.isVideoOn ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <VideoOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Pin button */}
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${participant.isPinned ? "text-primary" : ""}`}
                onClick={() => onPinParticipant(participant.id)}
                aria-label={participant.isPinned ? "Unpin participant" : "Pin participant"}
                title={participant.isPinned ? "Unpin participant" : "Pin participant"}
              >
                <Pin className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="h-[80vh] p-0" hideCloseButton>
          <ParticipantsContent />
        </SheetContent>
      </Sheet>
    )
  }

  return <ParticipantsContent />
}

