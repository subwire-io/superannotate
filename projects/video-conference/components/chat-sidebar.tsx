"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, X, Send } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

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

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})

export function ChatSidebar({ messages, onSendMessage, onClose }: ChatSidebarProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSendMessage(values.message)
    form.reset()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <h2 className="font-medium text-lg">Chat</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className="space-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{message.sender}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
              </div>
              <p className="text-sm">{message.content}</p>
              <Separator className="mt-2" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      {...field}
                      aria-label="Chat message input"
                      className="transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              className="transition-all hover:bg-primary/90 active:scale-95"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

