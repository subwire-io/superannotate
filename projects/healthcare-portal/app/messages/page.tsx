"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlaneIcon as PaperPlaneIcon, PaperclipIcon, User, Phone, Video, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Message {
  id: number
  content: string
  sender: "user" | "doctor"
  time: string
  read: boolean
}

interface Conversation {
  id: number
  doctor: {
    name: string
    avatar: string
    specialty: string
    lastActive: string
  }
  messages: Message[]
  unread: number
}

export default function MessagesPage() {
  const { toast } = useToast()
  const [activeConversation, setActiveConversation] = useState<number>(1)
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      doctor: {
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg",
        specialty: "Cardiologist",
        lastActive: "10m ago",
      },
      messages: [
        {
          id: 1,
          content: "Good morning John, how have you been feeling since our last appointment?",
          sender: "doctor",
          time: "10:32 AM",
          read: true,
        },
        {
          id: 2,
          content:
            "I've been following the medication schedule, but I'm still experiencing some shortness of breath when climbing stairs.",
          sender: "user",
          time: "10:40 AM",
          read: true,
        },
        {
          id: 3,
          content:
            "Thank you for letting me know. When did you last check your blood pressure? It would be helpful to see those readings.",
          sender: "doctor",
          time: "10:45 AM",
          read: false,
        },
      ],
      unread: 1,
    },
    {
      id: 2,
      doctor: {
        name: "Dr. Michael Chen",
        avatar: "/placeholder.svg",
        specialty: "Endocrinologist",
        lastActive: "1h ago",
      },
      messages: [
        {
          id: 1,
          content: "Your latest lab results show your A1C levels have improved. Great job with your diet changes!",
          sender: "doctor",
          time: "Yesterday",
          read: true,
        },
        {
          id: 2,
          content: "That's great news! I've been working hard on cutting down sugar and increasing my activity level.",
          sender: "user",
          time: "Yesterday",
          read: true,
        },
      ],
      unread: 0,
    },
    {
      id: 3,
      doctor: {
        name: "Dr. Emily Wilson",
        avatar: "/placeholder.svg",
        specialty: "Dermatologist",
        lastActive: "3h ago",
      },
      messages: [
        {
          id: 1,
          content:
            "I've reviewed the photos of your skin condition. I'd like to schedule an in-person follow-up next week.",
          sender: "doctor",
          time: "Jun 3",
          read: true,
        },
        {
          id: 2,
          content: "That sounds good. Would Tuesday morning work?",
          sender: "user",
          time: "Jun 3",
          read: true,
        },
        {
          id: 3,
          content: "Tuesday at 9:30 AM is available. I'll have my assistant confirm the appointment.",
          sender: "doctor",
          time: "Jun 3",
          read: true,
        },
        {
          id: 4,
          content: "Perfect, thank you!",
          sender: "user",
          time: "Jun 3",
          read: true,
        },
      ],
      unread: 0,
    },
  ])

  const currentConversation = conversations.find((c) => c.id === activeConversation)

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // Update the conversation with the new message
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: conv.messages.length + 1,
                content: newMessage,
                sender: "user",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                read: true,
              },
            ],
          }
        }
        return conv
      }),
    )

    setNewMessage("")

    // Simulate doctor response after a delay
    setTimeout(() => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: conv.messages.length + 2,
                  content: "I've received your message. I'll get back to you shortly with more information.",
                  sender: "doctor",
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  read: false,
                },
              ],
            }
          }
          return conv
        }),
      )
    }, 2000)
  }

  const handleCall = () => {
    toast({
      title: "Starting Call",
      description: `Initiating call with ${currentConversation?.doctor.name}...`,
    })
  }

  const handleVideoCall = () => {
    toast({
      title: "Starting Video Call",
      description: `Initiating video call with ${currentConversation?.doctor.name}...`,
    })
  }

  const handleViewProfile = () => {
    toast({
      title: "Doctor Profile",
      description: `Viewing profile for ${currentConversation?.doctor.name}`,
    })
  }

  const handleAttachFile = () => {
    toast({
      title: "Attach File",
      description: "File attachment dialog opened",
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)]">
      <Toaster />
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search messages..." className="w-full pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-colors ${
                  activeConversation === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => {
                  setActiveConversation(conversation.id)
                  // Mark messages as read when conversation is opened
                  if (conversation.unread > 0) {
                    setConversations((prevConversations) =>
                      prevConversations.map((conv) => {
                        if (conv.id === conversation.id) {
                          return {
                            ...conv,
                            unread: 0,
                            messages: conv.messages.map((msg) => ({
                              ...msg,
                              read: true,
                            })),
                          }
                        }
                        return conv
                      }),
                    )
                  }
                }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.doctor.avatar} alt={conversation.doctor.name} />
                  <AvatarFallback>
                    {conversation.doctor.name.charAt(0)}
                    {conversation.doctor.name.split(" ")[1].charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{conversation.doctor.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conversation.messages[conversation.messages.length - 1].time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.messages[conversation.messages.length - 1].content}
                    </p>
                    {conversation.unread > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {currentConversation && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentConversation.doctor.avatar} alt={currentConversation.doctor.name} />
                  <AvatarFallback>
                    {currentConversation.doctor.name.charAt(0)}
                    {currentConversation.doctor.name.split(" ")[1].charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{currentConversation.doctor.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation.doctor.specialty} • {currentConversation.doctor.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleCall}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleVideoCall}>
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleViewProfile}>
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "doctor" && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={currentConversation.doctor.avatar} alt={currentConversation.doctor.name} />
                        <AvatarFallback>
                          {currentConversation.doctor.name.charAt(0)}
                          {currentConversation.doctor.name.split(" ")[1].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Card
                      className={`max-w-[80%] p-3 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-right opacity-70">{message.time}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleAttachFile}>
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <PaperPlaneIcon className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

