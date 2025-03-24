"use client"

import { useEffect } from "react"
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

// Mock data for demonstration
const mockPosts = {
  "1": {
    id: "1",
    title: "How to Build a Blog with Next.js",
    content:
      "<h2>Building a Blog with Next.js</h2><p>Next.js is a powerful framework for building React applications. In this tutorial, we'll explore how to create a blog platform using Next.js, React, and Tailwind CSS.</p>",
    category: "tutorial",
    published: true,
  },
  "2": {
    id: "2",
    title: "Mastering Tailwind CSS",
    content:
      "<h2>Mastering Tailwind CSS</h2><p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. In this guide, we'll explore advanced techniques and best practices.</p>",
    category: "tutorial",
    published: true,
  },
  "3": {
    id: "3",
    title: "Server Components in Next.js",
    content:
      "<h2>Understanding Server Components</h2><p>Server Components are a new feature in React that allows components to be rendered on the server. This can significantly improve performance and user experience.</p>",
    category: "guide",
    published: true,
  },
  "4": {
    id: "4",
    title: "Getting Started with TypeScript",
    content:
      "<h2>TypeScript Fundamentals</h2><p>TypeScript is a strongly typed programming language that builds on JavaScript. In this guide, we'll cover the basics and help you get started with TypeScript in your projects.</p>",
    category: "guide",
    published: false,
  },
  "5": {
    id: "5",
    title: "The Future of Web Development",
    content:
      "<h2>Web Development Trends</h2><p>The web development landscape is constantly evolving. In this article, we'll explore emerging trends and technologies that will shape the future of web development.</p>",
    category: "opinion",
    published: false,
  },
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const postId = params.id
  const post = mockPosts[postId as keyof typeof mockPosts]

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content:
        "<h2>Welcome to the Blog Editor</h2><p>This is a simple editor for your blog posts. You can format text, add headings, and more.</p><p>Start typing to create your content...</p>",
      category: "",
    },
  })

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        category: post.category,
      })
    }
  }, [post, form])

  function onSubmit(data: PostFormValues) {
    toast({
      title: "Post updated",
      description: "Your post has been updated successfully.",
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
                <PublishControls form={form} isEdit={true} postId={postId} />
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

