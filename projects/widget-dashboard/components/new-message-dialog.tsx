"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { messageFormSchema } from "@/lib/schemas"

type Contact = {
  id: string
  name: string
  avatar?: string
  initials: string
  email: string
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Jane Miller",
    initials: "JM",
    email: "jane.miller@example.com",
  },
  {
    id: "2",
    name: "Robert Wilson",
    avatar: "/placeholder.svg?height=40&width=40&text=RW",
    initials: "RW",
    email: "robert.wilson@example.com",
  },
  {
    id: "3",
    name: "Anna Smith",
    initials: "AS",
    email: "anna.smith@example.com",
  },
  {
    id: "4",
    name: "Alex Johnson",
    initials: "AJ",
    email: "alex.johnson@example.com",
  },
  {
    id: "5",
    name: "Sarah Miller",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SM",
    email: "sarah.miller@example.com",
  },
]

export function NewMessageDialog({
  open,
  onOpenChange,
  onSend,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (message: z.infer<typeof messageFormSchema>) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showContacts, setShowContacts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  })

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectContact = (contact: Contact) => {
    form.setValue("recipient", contact, { shouldValidate: true })
    setShowContacts(false)
  }

  const onSubmit = async (data: z.infer<typeof messageFormSchema>) => {
    setIsSubmitting(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSend(data)
      form.reset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Compose a new message to send to your team.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <div className="flex items-center gap-2 border rounded-md p-2">
                      {field.value ? (
                        <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
                          <Avatar className="h-6 w-6">
                            {field.value.avatar ? (
                              <AvatarImage src={field.value.avatar} alt={field.value.name} />
                            ) : null}
                            <AvatarFallback>{field.value.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{field.value.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1 hover:bg-muted-foreground/20 rounded-full"
                            onClick={() => form.setValue("recipient", undefined as any)}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <FormControl>
                          <Input
                            placeholder="Search contacts..."
                            className="border-0 p-0 focus-visible:ring-0"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value)
                              setShowContacts(true)
                            }}
                            onFocus={() => setShowContacts(true)}
                          />
                        </FormControl>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showContacts && filteredContacts.length > 0 && !form.getValues("recipient") && (
                <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
                  <ScrollArea className="h-[200px]">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer transition-colors duration-200"
                        onClick={() => handleSelectContact(contact)}
                      >
                        <Avatar className="h-8 w-8">
                          {contact.avatar ? <AvatarImage src={contact.avatar} alt={contact.name} /> : null}
                          <AvatarFallback>{contact.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
              {showContacts && filteredContacts.length === 0 && searchQuery && (
                <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">No contacts found</p>
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Message subject" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Type your message here..." className="min-h-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="transition-colors hover:bg-muted active:scale-95"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="transition-transform active:scale-95">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

