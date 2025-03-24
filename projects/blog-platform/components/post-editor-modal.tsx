"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { SimpleInput } from "@/components/ui/simple-input"
import { PostEditor } from "@/components/post-editor"
import { CategorySelector } from "@/components/category-selector"
import { PublishControls } from "@/components/publish-controls"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/types"

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post
  onSave?: (post: Post) => void
}

export function PostEditorModal({ open, onOpenChange, post, onSave }: PostEditorModalProps) {
  const { toast } = useToast()
  const isEdit = !!post

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content:
        post?.content ||
        "<h2>Welcome to the Blog Editor</h2><p>This is a simple editor for your blog posts. You can format text, add headings, and more.</p><p>Start typing to create your content...</p>",
      category: post?.category || "",
    },
  })

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        category: post.category,
      })
    } else {
      form.reset({
        title: "",
        content:
          "<h2>Welcome to the Blog Editor</h2><p>This is a simple editor for your blog posts. You can format text, add headings, and more.</p><p>Start typing to create your content...</p>",
        category: "",
      })
    }
  }, [post, form, open])

  function onSubmit(data: PostFormValues) {
    const updatedPost = {
      id: post?.id || String(Date.now()),
      title: data.title,
      content: data.content,
      category: data.category || "",
      excerpt: post?.excerpt || "A brief excerpt of the post content.",
      slug: post?.slug || `post-${Date.now()}`,
      published: post?.published || false,
      featured: post?.featured || false,
      createdAt: post?.createdAt || new Date(),
      updatedAt: new Date(),
      publishedAt: post?.publishedAt,
    }

    if (onSave) {
      onSave(updatedPost)
    }

    toast({
      title: isEdit ? "Post updated" : "Post saved",
      description: isEdit ? "Your post has been updated successfully." : "Your post has been saved as a draft.",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Post" : "Create New Post"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <SimpleInput
                    placeholder="Post title"
                    className="w-full border-none bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-auto">
                    <CategorySelector value={field.value || ""} onValueChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PublishControls
                form={form}
                isEdit={isEdit}
                postId={post?.id}
                onClose={() => onOpenChange(false)}
                onSave={onSave}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <PostEditor value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

