"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { BlogHeader } from "@/components/blog-header"
import { PostEditor } from "@/components/post-editor"
import { CategorySelector } from "@/components/category-selector"
import { PublishControls } from "@/components/publish-controls"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

export default function EditorPage() {
  const { toast } = useToast()

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content:
        "<h2>Welcome to the Blog Editor</h2><p>This is a simple editor for your blog posts. You can format text, add headings, and more.</p><p>Start typing to create your content...</p>",
      category: "",
    },
  })

  function onSubmit(data: PostFormValues) {
    toast({
      title: "Post saved",
      description: "Your post has been saved as a draft.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="Post title"
                        className="w-full border-none bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground"
                      />
                    </FormControl>
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
                      <FormControl>
                        <CategorySelector value={field.value || ""} onValueChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PublishControls form={form} />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PostEditor value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}

