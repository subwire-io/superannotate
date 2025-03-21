"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event, EventCategory } from "@/types/event"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddEventFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddEvent: (event: Omit<Event, "id">) => void
  selectedDate?: Date | null
}

export function AddEventForm({ isOpen, onOpenChange, onAddEvent, selectedDate }: AddEventFormProps) {
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    time: "12:00",
    description: "",
    category: "other",
  })

  // Update the date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setNewEvent((prev) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd"),
      }))
    }
  }, [selectedDate])

  const handleSubmit = () => {
    onAddEvent(newEvent)
    setNewEvent({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "12:00",
      description: "",
      category: "other",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Create a new event for your calendar. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Enter event title"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newEvent.category}
              onValueChange={(value: EventCategory) => setNewEvent({ ...newEvent, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event details..."
              className="h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!newEvent.title || !newEvent.date}>
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

