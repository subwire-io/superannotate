"use client"

import { useState, useEffect } from "react"
import { ParticipantGrid } from "./participant-grid"
import { ChatSidebar } from "./chat-sidebar"
import { MeetingControls } from "./meeting-controls"
import { ParticipantsSidebar } from "./participants-sidebar"
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

// Default settings
const defaultSettings = {
  backgroundBlur: false,
  muteOnEntry: true,
  autoRecord: false,
}

export default function VideoConference() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const [participants, setParticipants] = useState(mockParticipants)
  const [messages, setMessages] = useState(initialMessages)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasLeftCall, setHasLeftCall] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const { toast } = useToast()

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("videoCallSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage when they change
  const saveSettings = (newSettings: typeof defaultSettings) => {
    setSettings(newSettings)
    localStorage.setItem("videoCallSettings", JSON.stringify(newSettings))
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    // Close participants sidebar if opening chat
    if (!isChatOpen) {
      setIsParticipantsOpen(false)
    }
  }

  const toggleParticipants = () => {
    setIsParticipantsOpen(!isParticipantsOpen)
    // Close chat sidebar if opening participants
    if (!isParticipantsOpen) {
      setIsChatOpen(false)
    }
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
        <div className={`relative flex-1 flex flex-col`}>
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
            isParticipantsOpen={isParticipantsOpen}
            settings={settings}
            onSaveSettings={saveSettings}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onToggleChat={toggleChat}
            onToggleParticipants={toggleParticipants}
            onLeaveCall={leaveCall}
            onSearch={searchParticipants}
          />
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-none">
            <ChatSidebar messages={messages} onSendMessage={sendMessage} onClose={toggleChat} />
          </div>
        )}

        {/* Participants sidebar */}
        {isParticipantsOpen && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-none">
            <ParticipantsSidebar
              participants={participants}
              onClose={toggleParticipants}
              onPinParticipant={togglePinParticipant}
            />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

