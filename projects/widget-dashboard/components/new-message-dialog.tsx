"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  onSend: (message: { recipient: Contact; subject: string; content: string }) => void
}) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showContacts, setShowContacts] = useState(false)

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSend = () => {
    if (selectedContact && subject && content) {
      onSend({
        recipient: selectedContact,
        subject,
        content,
      })
      setSelectedContact(null)
      setSubject("")
      setContent("")
      onOpenChange(false)
    }
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    setShowContacts(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Compose a new message to send to your team.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Label htmlFor="recipient" className="mb-2 block">
              To
            </Label>
            <div className="flex items-center gap-2 border rounded-md p-2">
              {selectedContact ? (
                <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
                  <Avatar className="h-6 w-6">
                    {selectedContact.avatar ? (
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    ) : null}
                    <AvatarFallback>{selectedContact.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{selectedContact.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => setSelectedContact(null)}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <Input
                  id="recipient"
                  placeholder="Search contacts..."
                  className="border-0 p-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowContacts(true)
                  }}
                  onFocus={() => setShowContacts(true)}
                />
              )}
            </div>
            {showContacts && filteredContacts.length > 0 && !selectedContact && (
              <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
                <ScrollArea className="h-[200px]">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
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
          </div>
          <div>
            <Label htmlFor="subject" className="mb-2 block">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
            />
          </div>
          <div>
            <Label htmlFor="message" className="mb-2 block">
              Message
            </Label>
            <Textarea
              id="message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!selectedContact || !subject || !content}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

