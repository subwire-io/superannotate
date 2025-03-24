"use client"

import { useState } from "react"
import { Save, Trash } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useRouter } from "next/navigation"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SimpleInput } from "./ui/simple-input"
import type { Post } from "@/types"

const publishSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Excerpt is too long"),
  featured: z.boolean().default(false),
})

type PublishFormValues = z.infer<typeof publishSchema>

interface PublishControlsProps {
  form: UseFormReturn<any>
  isEdit: boolean
  postId?: string
  onClose?: () => void
  onSave?: (post: Post) => void
}

export function PublishControls({ form: postForm, isEdit, postId, onClose, onSave }: PublishControlsProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const publishForm = useForm<PublishFormValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      slug: isEdit && postId ? `post-${postId}` : `post-${Date.now()}`,
      excerpt: "",
      featured: false,
    },
  })

  const handleSaveDraft = async () => {
    const isValid = await postForm.trigger()
    if (!isValid) return

    setIsSaving(true)

    // Get the current form values
    const formValues = postForm.getValues()

    // Create a draft post
    const draftPost: Post = {
      id: postId || String(Date.now()),
      title: formValues.title || "Untitled Post",
      content: formValues.content || "",
      category: formValues.category || "",
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

    setIsSaving(false)

    toast({
      title: "Draft saved",
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

  const handlePublish = async (data: PublishFormValues) => {
    const isValid = await postForm.trigger()
    if (!isValid) return

    setIsPublishing(true)

    // Get the current form values
    const formValues = postForm.getValues()

    // Create a published post
    const publishedPost: Post = {
      id: postId || String(Date.now()),
      title: formValues.title || "Untitled Post",
      content: formValues.content || "",
      category: formValues.category || "",
      excerpt: data.excerpt,
      slug: data.slug,
      published: true,
      featured: data.featured,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage for persistence
    const existingPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")

    // Check if we're updating an existing published post
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

    setIsPublishing(false)
    setOpenDialog(false)

    toast({
      title: isEdit ? "Post updated" : "Post published",
      description: isEdit ? "Your post has been updated successfully." : "Your post has been published successfully.",
    })

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

  const handleDelete = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const deletedPost = {
      id: postId || "123",
      title: postForm.getValues().title || "Untitled Post",
    }

    // Remove from localStorage
    const existingDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
    const updatedDrafts = existingDrafts.filter((draft: Post) => draft.id !== deletedPost.id)
    localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts))

    const existingPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
    const updatedPublished = existingPublished.filter((post: Post) => post.id !== deletedPost.id)
    localStorage.setItem("publishedPosts", JSON.stringify(updatedPublished))

    toast({
      title: "Post deleted",
      description: "Your post has been deleted.",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast({
              title: "Undo successful",
              description: `Post "${deletedPost.title}" has been restored.`,
            })
          }}
        >
          Undo
        </Button>
      ),
    })

    if (onClose) {
      onClose()
    }

    // Force a refresh to update the UI
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
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
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="sm" className="hover:bg-primary/90 transition-colors">
            {isEdit ? "Update" : "Publish"}
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
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isPublishing} className="hover:bg-primary/90 transition-colors">
                  {isPublishing ? (isEdit ? "Updating..." : "Publishing...") : isEdit ? "Update Now" : "Publish Now"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-muted transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

