"use client"

import { useState } from "react"
import { Save, Eye, Upload, Calendar, Trash2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SimpleInput } from "./ui/simple-input"
import { TagSelector } from "./tag-selector"
import type { Post } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

const publishSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Excerpt is too long"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  schedulePublish: z.boolean().default(false),
  scheduledDate: z.date().optional(),
})

type PublishFormValues = z.infer<typeof publishSchema>

interface PublishControlsProps {
  form: UseFormReturn<any>
  isEdit: boolean
  isPublished: boolean
  postId?: string
  onClose?: () => void
  onSave?: (post: Post) => void
  onView?: (post: Post) => void
}

export function PublishControls({
  form: postForm,
  isEdit,
  isPublished,
  postId,
  onClose,
  onSave,
  onView,
}: PublishControlsProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const publishForm = useForm<PublishFormValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      slug: isEdit && postId ? `post-${postId}` : `post-${Date.now()}`,
      excerpt: "",
      featured: false,
      tags: [],
      schedulePublish: false,
      scheduledDate: new Date(),
    },
  })

  const handleSaveDraft = async () => {
    const isValid = await postForm.trigger(["title", "content", "category"])
    if (!isValid) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSaving(true)

    // Get the current form values
    const formValues = postForm.getValues()

    // Create a draft post
    const draftPost: Post = {
      id: postId || String(Date.now()),
      title: formValues.title || "Untitled Post",
      content: formValues.content || "",
      category: formValues.category || "",
      tags: formValues.tags || [],
      excerpt: "Draft post",
      slug: `post-${Date.now()}`,
      published: false,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage for persistence
    const existingDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")

    // Check if we're updating an existing draft
    const draftIndex = existingDrafts.findIndex((draft: Post) => draft.id === draftPost.id)

    if (draftIndex >= 0) {
      // Update existing draft
      existingDrafts[draftIndex] = draftPost
    } else {
      // Add new draft
      existingDrafts.push(draftPost)
    }

    localStorage.setItem("draftPosts", JSON.stringify(existingDrafts))

    // If this was a published post being saved as draft, remove from published
    if (isPublished) {
      const existingPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
      const updatedPublished = existingPublished.filter((post: Post) => post.id !== draftPost.id)
      localStorage.setItem("publishedPosts", JSON.stringify(updatedPublished))
    }

    setIsSaving(false)

    // Keep this toast as it's related to saving a post
    toast.success("Draft saved", {
      description: "Your post has been saved as a draft.",
    })

    // Call onSave to update the parent component state
    if (onSave) {
      onSave(draftPost)
    }

    if (onClose) {
      onClose()
    }

    // Force a refresh to show the new draft
    router.refresh()
  }

  const handleUnpublish = async () => {
    if (!isPublished || !postId) return

    setIsUnpublishing(true)

    // Get the current form values
    const formValues = postForm.getValues()

    // Create a draft post from the published post
    const draftPost: Post = {
      id: postId,
      title: formValues.title || "Untitled Post",
      content: formValues.content || "",
      category: formValues.category || "",
      tags: formValues.tags || [],
      excerpt: formValues.excerpt || "Draft post",
      slug: formValues.slug || `post-${Date.now()}`,
      published: false,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Remove from published posts
    const existingPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
    const updatedPublished = existingPublished.filter((post: Post) => post.id !== postId)
    localStorage.setItem("publishedPosts", JSON.stringify(updatedPublished))

    // Add to drafts
    const existingDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
    const draftIndex = existingDrafts.findIndex((draft: Post) => draft.id === postId)

    if (draftIndex >= 0) {
      existingDrafts[draftIndex] = draftPost
    } else {
      existingDrafts.push(draftPost)
    }

    localStorage.setItem("draftPosts", JSON.stringify(existingDrafts))

    setIsUnpublishing(false)

    // Keep this toast as it's related to unpublishing a post
    toast.success("Post unpublished", {
      description: "Your post has been moved to drafts.",
    })

    // Call onSave to update the parent component state
    if (onSave) {
      onSave(draftPost)
    }

    if (onClose) {
      onClose()
    }

    // Force a refresh
    router.refresh()
  }

  const handlePublish = async (data: PublishFormValues) => {
    const isValid = await postForm.trigger(["title", "content", "category"])
    if (!isValid) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsPublishing(true)

    // Get the current form values
    const formValues = postForm.getValues()

    // Create a published post
    const publishedPost: Post = {
      id: postId || String(Date.now()),
      title: formValues.title || "Untitled Post",
      content: formValues.content || "",
      category: formValues.category || "",
      tags: data.tags || [],
      excerpt: data.excerpt,
      slug: data.slug,
      published: !data.schedulePublish, // If scheduled, it's not published yet
      featured: data.featured,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: data.schedulePublish ? data.scheduledDate : new Date(),
      scheduledToPublish: data.schedulePublish ? true : undefined,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage for persistence
    if (data.schedulePublish) {
      // If scheduled, save to a special "scheduled" collection
      const scheduledPosts = JSON.parse(localStorage.getItem("scheduledPosts") || "[]")
      const scheduledIndex = scheduledPosts.findIndex((p: Post) => p.id === publishedPost.id)

      if (scheduledIndex >= 0) {
        scheduledPosts[scheduledIndex] = publishedPost
      } else {
        scheduledPosts.push(publishedPost)
      }

      localStorage.setItem("scheduledPosts", JSON.stringify(scheduledPosts))

      // Remove from drafts if it was there
      const existingDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
      const updatedDrafts = existingDrafts.filter((p: Post) => p.id !== publishedPost.id)
      localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts))

      toast.success("Post scheduled", {
        description: `Your post will be published on ${format(data.scheduledDate || new Date(), "PPP")}`,
      })
    } else {
      // Regular publish flow
      const existingPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
      const publishedIndex = existingPublished.findIndex((post: Post) => post.id === publishedPost.id)

      if (publishedIndex >= 0) {
        // Update existing published post
        existingPublished[publishedIndex] = publishedPost
      } else {
        // Add new published post
        existingPublished.push(publishedPost)

        // If this was a draft being published, remove it from drafts
        const existingDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
        const updatedDrafts = existingDrafts.filter((draft: Post) => draft.id !== publishedPost.id)
        localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts))
      }

      localStorage.setItem("publishedPosts", JSON.stringify(existingPublished))

      toast.success(isEdit ? "Post updated" : "Post published", {
        description: isEdit ? "Your post has been updated successfully." : "Your post has been published successfully.",
      })
    }

    setIsPublishing(false)
    setOpenDialog(false)

    // Call onSave to update the parent component state
    if (onSave) {
      onSave(publishedPost)
    }

    if (onClose) {
      onClose()
    }

    // Force a refresh to show the new published post
    router.refresh()
  }

  const handleViewPost = () => {
    if (!postId) return

    const formValues = postForm.getValues()
    const post: Post = {
      id: postId,
      title: formValues.title || "Untitled Post",
      content: formValues.content || "",
      category: formValues.category || "",
      tags: formValues.tags || [],
      excerpt: formValues.excerpt || "",
      slug: formValues.slug || `post-${postId}`,
      published: isPublished,
      featured: formValues.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: isPublished ? new Date() : undefined,
    }

    if (onView) {
      onView(post)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isPublished ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnpublish}
            disabled={isUnpublishing}
            className="hover:bg-yellow-100 hover:text-yellow-800 dark:hover:bg-yellow-900 dark:hover:text-yellow-200 transition-colors"
          >
            {isUnpublishing ? <>Unpublishing...</> : <>Unpublish</>}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewPost}
            className="hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 transition-colors"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </>
          )}
        </Button>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="sm" className="hover:bg-primary/90 transition-colors">
            {isPublished ? (
              <>Update</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update Post" : "Publish Post"}</DialogTitle>
            <DialogDescription>
              Configure your post settings before {isEdit ? "updating" : "publishing"}.
            </DialogDescription>
          </DialogHeader>
          <Form {...publishForm}>
            <form onSubmit={publishForm.handleSubmit(handlePublish)} className="space-y-4 py-4">
              <FormField
                control={publishForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Slug</FormLabel>
                    <div className="col-span-3">
                      <SimpleInput placeholder="how-to-build-a-blog" {...field} />
                    </div>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={publishForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Excerpt</FormLabel>
                    <div className="col-span-3">
                      <SimpleInput placeholder="A short description of your post" {...field} />
                    </div>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={publishForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right pt-2">Tags</FormLabel>
                    <div className="col-span-3">
                      <TagSelector tags={field.value || []} onChange={field.onChange} />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={publishForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Featured</FormLabel>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <Label>Show on homepage</Label>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={publishForm.control}
                name="schedulePublish"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Schedule</FormLabel>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <Label>Schedule for later</Label>
                    </div>
                  </FormItem>
                )}
              />
              {publishForm.watch("schedulePublish") && (
                <FormField
                  control={publishForm.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Date</FormLabel>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isPublishing} className="hover:bg-primary/90 transition-colors">
                  {isPublishing
                    ? publishForm.watch("schedulePublish")
                      ? "Scheduling..."
                      : isEdit
                        ? "Updating..."
                        : "Publishing..."
                    : publishForm.watch("schedulePublish")
                      ? "Schedule"
                      : isEdit
                        ? "Update Now"
                        : "Publish Now"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {!isPublished && (
        <Button variant="outline" size="sm" className="p-2" onClick={handleViewPost}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </div>
  )
}

