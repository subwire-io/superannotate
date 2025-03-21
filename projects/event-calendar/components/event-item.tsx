"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/types/event"
import { colorMap } from "@/types/event"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const { toast } = useToast()

  const handleDelete = () => {
    setShowDeleteDialog(false)

    // Store the event for potential undo
    const deletedEvent = { ...event }

    // Delete the event
    onDelete(event.id)

    // Show toast with undo option
    toast({
      title: "Event deleted",
      description: "The event has been removed from your calendar",
      action: (
        <Button variant="outline" size="sm" onClick={() => onUndoDelete(deletedEvent)} className="ml-2">
          Undo
        </Button>
      ),
    })
  }

  const handleEventClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the calendar day
    e.stopPropagation()
    // Show event details
    setShowEventDetails(true)
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
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-[425px]">
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
            <Button
              variant="outline"
              onClick={() => {
                setShowEventDetails(false)
                onEdit(event)
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowEventDetails(false)
                setShowDeleteDialog(true)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will remove "{event.title}" from your calendar.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

