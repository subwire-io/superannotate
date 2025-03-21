"use client"

import { useState } from "react"
import { Save, Trash } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const publishSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Excerpt is too long"),
  featured: z.boolean().default(false),
})

type PublishFormValues = z.infer<typeof publishSchema>

interface PublishControlsProps {
  form: UseFormReturn<any>
}

export function PublishControls({ form: postForm }: PublishControlsProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()

  const publishForm = useForm<PublishFormValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      slug: "",
      excerpt: "",
      featured: false,
    },
  })

  const handleSaveDraft = async () => {
    const isValid = await postForm.trigger()
    if (!isValid) return

    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)

    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft.",
    })
  }

  const handlePublish = async (data: PublishFormValues) => {
    const isValid = await postForm.trigger()
    if (!isValid) return

    setIsPublishing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsPublishing(false)
    setOpenDialog(false)

    toast({
      title: "Post published",
      description: "Your post has been published successfully.",
    })
  }

  const handleDelete = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const deletedPost = {
      id: "123",
      title: postForm.getValues().title || "Untitled Post",
    }

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
            Publish
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Publish Post</DialogTitle>
            <DialogDescription>Configure your post settings before publishing.</DialogDescription>
          </DialogHeader>
          <Form {...publishForm}>
            <form onSubmit={publishForm.handleSubmit(handlePublish)} className="space-y-4 py-4">
              <FormField
                control={publishForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="how-to-build-a-blog" className="col-span-3" />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} placeholder="A short description of your post" className="col-span-3" />
                    </FormControl>
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
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <Label>Show on homepage</Label>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isPublishing} className="hover:bg-primary/90 transition-colors">
                  {isPublishing ? "Publishing..." : "Publish Now"}
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

