"use client"

import { useState } from "react"
import { ParticipantGrid } from "./participant-grid"
import { ChatSidebar } from "./chat-sidebar"
import { MeetingControls } from "./meeting-controls"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

// Mock participants data
const mockParticipants = [
  { id: 1, name: "You", isSelf: true, isAudioOn: true, isVideoOn: true, isPinned: false },
  { id: 2, name: "Alex Johnson", isSelf: false, isAudioOn: true, isVideoOn: true, isPinned: false },
  { id: 3, name: "Maria Garcia", isSelf: false, isAudioOn: false, isVideoOn: true, isPinned: false },
  { id: 4, name: "James Smith", isSelf: false, isAudioOn: true, isVideoOn: false, isPinned: false },
  { id: 5, name: "Emma Williams", isSelf: false, isAudioOn: true, isVideoOn: true, isPinned: false },
]

// Mock chat messages
const initialMessages = [
  { id: 1, sender: "Alex Johnson", content: "Hello everyone! Thanks for joining the call.", time: "10:01 AM" },
  { id: 2, sender: "Maria Garcia", content: "Hi team, glad to be here.", time: "10:02 AM" },
  { id: 3, sender: "James Smith", content: "Sorry I'm a bit late. Had some technical issues.", time: "10:05 AM" },
]

export default function VideoConference() {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [participants, setParticipants] = useState(mockParticipants)
  const [messages, setMessages] = useState(initialMessages)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasLeftCall, setHasLeftCall] = useState(false)
  const { toast } = useToast()

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)

    // Update self participant
    setParticipants(participants.map((p) => (p.isSelf ? { ...p, isAudioOn: !isAudioEnabled } : p)))
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)

    // Update self participant
    setParticipants(participants.map((p) => (p.isSelf ? { ...p, isVideoOn: !isVideoEnabled } : p)))
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)

    if (!isScreenSharing) {
      toast({
        title: "Screen sharing started",
        description: "Your screen is now visible to all participants",
      })
    }
  }

  const togglePinParticipant = (participantId: number) => {
    // Check if this participant is already pinned
    const isCurrentlyPinned = participants.find((p) => p.id === participantId)?.isPinned

    if (isCurrentlyPinned) {
      // If already pinned, unpin them
      const updatedParticipants = participants.map((p) => (p.id === participantId ? { ...p, isPinned: false } : p))

      setParticipants(updatedParticipants)

      // Show toast notification
      const participant = participants.find((p) => p.id === participantId)
      toast({
        title: `Unpinned ${participant?.name}`,
        description: "Returned to grid view",
      })
    } else {
      // First unpinning all participants
      const updatedParticipants = participants.map((p) => ({
        ...p,
        isPinned: false,
      }))

      // Then pin the selected participant
      const finalParticipants = updatedParticipants.map((p) => (p.id === participantId ? { ...p, isPinned: true } : p))

      setParticipants(finalParticipants)

      // Show toast notification
      const participant = participants.find((p) => p.id === participantId)
      toast({
        title: `Pinned ${participant?.name}`,
        description: "This participant will be highlighted in the view",
      })
    }
  }

  const leaveCall = () => {
    setHasLeftCall(true)
    toast({
      title: "Call ended",
      description: "You've left the meeting",
      action: (
        <button
          onClick={rejoinCall}
          className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          Undo
        </button>
      ),
    })
  }

  const rejoinCall = () => {
    setHasLeftCall(false)
    toast({
      title: "Rejoined call",
      description: "Welcome back to the meeting",
    })
  }

  const searchParticipants = (term: string) => {
    setSearchTerm(term)
  }

  // Filter participants based on search term
  const filteredParticipants = searchTerm
    ? participants.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : participants

  if (hasLeftCall) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4">You've left the meeting</h1>
        <button
          onClick={rejoinCall}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Rejoin Meeting
        </button>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-1 overflow-hidden">
        {/* Main content area with participant grid */}
        <div className={`relative flex-1 flex flex-col ${isChatOpen ? "md:mr-[320px]" : ""}`}>
          <div className="flex-1 p-4 overflow-auto">
            <ParticipantGrid
              participants={filteredParticipants}
              isScreenSharing={isScreenSharing}
              searchTerm={searchTerm}
              onPinParticipant={togglePinParticipant}
            />
          </div>
          <MeetingControls
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isChatOpen={isChatOpen}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onToggleChat={toggleChat}
            onLeaveCall={leaveCall}
            onSearch={searchParticipants}
          />
        </div>

        {/* Chat sidebar */}
        <div
          className={`fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-20 ${
            isChatOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 md:static md:w-80 md:flex-none`}
        >
          <ChatSidebar messages={messages} onSendMessage={sendMessage} onClose={toggleChat} />
        </div>
      </main>
      <Toaster />
    </div>
  )
}

