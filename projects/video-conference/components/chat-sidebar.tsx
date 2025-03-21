"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, X, Send } from "lucide-react"

interface Message {
  id: number
  sender: string
  content: string
  time: string
}

interface ChatSidebarProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  onClose: () => void
}

export function ChatSidebar({ messages, onSendMessage, onClose }: ChatSidebarProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <h2 className="font-medium text-lg">Chat</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden" aria-label="Close chat">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{message.sender}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
            </div>
            <p className="text-sm">{message.content}</p>
            <Separator className="mt-2" />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            aria-label="Chat message input"
          />
          <Button onClick={handleSend} size="icon" disabled={!inputValue.trim()} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

