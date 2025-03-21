"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Mail } from "lucide-react"
import { useState } from "react"

type Message = {
  id: string
  sender: {
    name: string
    avatar?: string
    initials: string
  }
  content: string
  timestamp: string
  read: boolean
}

export function AllMessagesDialog({
  open,
  onOpenChange,
  messages,
  onNewMessage,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: Message[]
  onNewMessage: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMessages = messages.filter(
    (message) =>
      message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>All Messages</DialogTitle>
            <DialogDescription>Your recent conversations.</DialogDescription>
          </div>
          <Button
            onClick={() => {
              onOpenChange(false)
              onNewMessage()
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4" aria-label="All messages">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 p-3 border rounded-lg ${!message.read ? "bg-muted/30" : ""}`}
              >
                <Avatar>
                  {message.sender.avatar ? <AvatarImage src={message.sender.avatar} alt={message.sender.name} /> : null}
                  <AvatarFallback>{message.sender.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{message.sender.name}</p>
                    <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.content}</p>
                </div>
                {!message.read && <div className="h-2 w-2 rounded-full bg-blue-500" aria-label="Unread message"></div>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

