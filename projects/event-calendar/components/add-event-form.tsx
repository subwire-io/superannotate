"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Event, EventCategory } from "@/types/event"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  category: z.enum(["personal", "work", "meeting", "social", "other"] as const),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddEventFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddEvent: (event: Omit<Event, "id">) => void
  onUpdateEvent: (event: Event) => void
  selectedDate?: Date | null
  editingEvent: Event | null
}

export function AddEventForm({
  isOpen,
  onOpenChange,
  onAddEvent,
  onUpdateEvent,
  selectedDate,
  editingEvent,
}: AddEventFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: "12:00",
      category: "other" as EventCategory,
      description: "",
    },
  })

  // Update form when editing an event
  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        date: editingEvent.date,
        time: editingEvent.time,
        category: editingEvent.category,
        description: editingEvent.description,
      })
    } else if (selectedDate) {
      form.reset({
        ...form.getValues(),
        date: format(selectedDate, "yyyy-MM-dd"),
      })
    }
  }, [editingEvent, selectedDate, form])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to avoid visual glitches
      const timer = setTimeout(() => {
        if (!editingEvent) {
          form.reset({
            title: "",
            date: format(new Date(), "yyyy-MM-dd"),
            time: "12:00",
            category: "other",
            description: "",
          })
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, form, editingEvent])

  // Form submission handler
  function onSubmit(data: FormValues) {
    if (editingEvent) {
      onUpdateEvent({
        ...data,
        id: editingEvent.id,
      })
    } else {
      onAddEvent(data)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            {editingEvent
              ? "Update the details of your event."
              : "Create a new event for your calendar. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event details..." className="h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{editingEvent ? "Update Event" : "Save Event"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

