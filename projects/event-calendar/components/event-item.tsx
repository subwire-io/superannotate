"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/types/event"
import { colorMap } from "@/types/event"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"

interface EventItemProps {
  event: Event
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
  onUndoDelete: (event: Event) => void
}

export function EventItem({ event, onEdit, onDelete, onUndoDelete }: EventItemProps) {
  const [showEventDetails, setShowEventDetails] = useState(false)
  const { toast } = useToast()

  // Simplified delete handler - no confirmation dialog
  const handleDelete = (e: React.MouseEvent) => {
    // Stop propagation to prevent day selection
    e.stopPropagation()

    // Close the details dialog first
    setShowEventDetails(false)

    // Store the event for potential undo
    const deletedEvent = { ...event }

    // Delete the event after dialog closes
    setTimeout(() => {
      onDelete(event.id)

      // Show toast with undo option
      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onUndoDelete(deletedEvent)
            }}
            className="ml-2"
          >
            Undo
          </Button>
        ),
      })
    }, 100)
  }

  const handleEventClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the calendar day
    e.stopPropagation()
    // Show event details
    setShowEventDetails(true)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEventDetails(false)

    // Use setTimeout to ensure the dialog is fully closed before opening the edit form
    setTimeout(() => {
      onEdit(event)
    }, 100)
  }

  return (
    <>
      <div
        className={`relative px-1.5 py-0.5 rounded-sm ${colorMap[event.category]} transition-all cursor-pointer hover:brightness-110`}
        onClick={handleEventClick}
      >
        <span className="truncate block">
          {event.time} {event.title}
        </span>
      </div>

      {/* Event details dialog */}
      <Dialog
        open={showEventDetails}
        onOpenChange={(open) => {
          // Only allow the dialog to be closed by clicking close button or outside
          if (!open) {
            setShowEventDetails(false)
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => {
            // Prevent clicks outside the dialog from triggering day selection
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription>
              {format(parseISO(event.date), "PPPP")} at {event.time}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${colorMap[event.category].split(" ")[0]}`}></div>
              <span className="capitalize">{event.category}</span>
            </div>
            {event.description && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

