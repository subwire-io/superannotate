"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { SimpleInput } from "@/components/ui/simple-input"
import { PostEditor } from "@/components/post-editor"
import { CategorySelector } from "@/components/category-selector"
import { TagSelector } from "@/components/tag-selector"
import { PublishControls } from "@/components/publish-controls"
import type { Post } from "@/types"

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post
  onSave?: (post: Post) => void
  onView?: (post: Post) => void
}

export function PostEditorModal({ open, onOpenChange, post, onSave, onView }: PostEditorModalProps) {
  const isEdit = !!post

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content:
        post?.content ||
        "# Welcome to the Blog Editor\n\nThis is a simple editor for your blog posts. You can use Markdown to format your content.\n\n## Getting Started\n\n- Use **bold** or *italic* for emphasis\n- Create lists with - or 1.\n- Add [links](https://example.com)\n\nStart typing to create your content...",
      category: post?.category || "",
      tags: post?.tags || [],
    },
  })

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
      })
    } else {
      form.reset({
        title: "",
        content:
          "# Welcome to the Blog Editor\n\nThis is a simple editor for your blog posts. You can use Markdown to format your content.\n\n## Getting Started\n\n- Use **bold** or *italic* for emphasis\n- Create lists with - or 1.\n- Add [links](https://example.com)\n\nStart typing to create your content...",
        category: "",
        tags: [],
      })
    }
  }, [post, form, open])

  function onSubmit(data: PostFormValues) {
    const updatedPost = {
      id: post?.id || String(Date.now()),
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
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

    toast.success(isEdit ? "Post updated" : "Post saved", {
      description: isEdit ? "Your post has been updated successfully." : "Your post has been saved as a draft.",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[80vw] max-h-[90vh] overflow-y-auto p-0 mx-auto">
        <DialogHeader className="p-5 sm:p-6 border-b">
          <DialogTitle className="text-xl">{isEdit ? "Edit Post" : "Create New Post"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-5 sm:p-6 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <SimpleInput
                      placeholder="Post title"
                      className="w-full border bg-background/50 text-lg font-medium outline-none placeholder:text-muted-foreground p-4 rounded-md"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <CategorySelector
                          value={field.value}
                          onValueChange={field.onChange}
                          required={true}
                          error={form.formState.errors.category?.message}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <TagSelector tags={field.value || []} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <PublishControls
                    form={form}
                    isEdit={isEdit}
                    isPublished={post?.published || false}
                    postId={post?.id}
                    onClose={() => onOpenChange(false)}
                    onSave={onSave}
                    onView={onView}
                  />
                </div>
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
            </div>

            <div className="hidden">
              {/* Hidden submit button for form validation */}
              <button type="submit" aria-hidden="true" />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

