"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

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

type KeyboardAccessibleMessageListProps = {
  messages: Message[]
  onDelete: (id: string) => void
  onView?: (id: string) => void
  className?: string
}

export function KeyboardAccessibleMessageList({
  messages,
  onDelete,
  onView,
  className = "",
}: KeyboardAccessibleMessageListProps) {
  const containerRef = useKeyboardNavigation({
    selector: '[role="listitem"]',
    onEnter: (element) => {
      const id = element.getAttribute("data-id")
      if (id && onView) {
        onView(id)
      }
    },
  })

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`space-y-0 divide-y ${className}`}
      role="list"
      aria-label="Message list"
    >
      {messages.map((message, i) => (
        <div
          key={message.id}
          data-id={message.id}
          role="listitem"
          tabIndex={0}
          className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors duration-200 group focus:outline-none focus:bg-muted/70 focus:ring-2 focus:ring-ring focus:ring-inset rounded-md"
          onClick={() => onView && onView(message.id)}
          onKeyDown={(e) => {
            if (e.key === "Delete") {
              e.preventDefault()
              onDelete(message.id)
            }
          }}
        >
          <Avatar>
            {message.sender.avatar ? (
              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            ) : (
              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i + 1}`} alt="Avatar" />
            )}
            <AvatarFallback>{message.sender.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-medium leading-none">{message.sender.name}</p>
              {!message.read && (
                <span className="ml-2 h-2 w-2 rounded-full bg-blue-500" aria-label="Unread message"></span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[15rem]">{message.content}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground whitespace-nowrap">{message.timestamp}</div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity hover:bg-muted active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(message.id)
              }}
              aria-label={`Delete message from ${message.sender.name}`}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

