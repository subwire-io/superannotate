"use client"

import { useState } from "react"
import { ParticipantGrid } from "./participant-grid"
import { ChatSidebar } from "./chat-sidebar"
import { MeetingControls } from "./meeting-controls"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

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
  }

  const leaveCall = () => {
    // In a real app, this would handle cleanup and navigation
    alert("You've left the call. This would normally redirect you to the post-call screen.")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-1 overflow-hidden">
        {/* Main content area with participant grid */}
        <div className={`relative flex-1 flex flex-col ${isChatOpen ? "md:mr-[320px]" : ""}`}>
          <div className="flex-1 p-4 overflow-auto">
            <ParticipantGrid participants={participants} isScreenSharing={isScreenSharing} />
          </div>
          <MeetingControls
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onLeaveCall={leaveCall}
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

        {/* Mobile chat toggle button */}
        <Button
          variant="outline"
          size="icon"
          className={`fixed bottom-24 right-4 z-30 rounded-full md:hidden ${isChatOpen ? "hidden" : "flex"}`}
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </main>
    </div>
  )
}

