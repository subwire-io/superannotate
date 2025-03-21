"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

interface EventItemProps {
  event: Event
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
  onUndoDelete: (event: Event) => void
}

export function EventItem({ event, onEdit, onDelete, onUndoDelete }: EventItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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

  return (
    <>
      <div
        className={`px-1.5 py-0.5 rounded-sm truncate ${colorMap[event.category]} relative transition-all cursor-pointer group`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        title={`${event.title} - ${event.time} - ${event.description}`}
      >
        <span>
          {event.time} {event.title}
        </span>

        {/* Action buttons that appear on hover */}
        <div
          className={`absolute right-0.5 top-0.5 flex gap-1 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 bg-white/20 hover:bg-white/40 rounded-sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(event)
            }}
          >
            <Edit className="h-2.5 w-2.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 bg-white/20 hover:bg-white/40 rounded-sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
          >
            <Trash2 className="h-2.5 w-2.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

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

