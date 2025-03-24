"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogHeader } from "@/components/blog-header"
import { EmptyState } from "@/components/empty-state"
import { PostEditorModal } from "@/components/post-editor-modal"
import type { Post } from "@/types"

export default function Dashboard() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined)

  // State for posts
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([])
  const [draftPosts, setDraftPosts] = useState<Post[]>([])

  // Load posts from localStorage on initial render
  useEffect(() => {
    loadPosts()
  }, [])

  // Function to load posts from localStorage
  const loadPosts = () => {
    // Load published posts
    const storedPublished = localStorage.getItem("publishedPosts")
    if (storedPublished) {
      try {
        const parsedPublished = JSON.parse(storedPublished)
        // Convert string dates back to Date objects
        const formattedPublished = parsedPublished.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        }))
        setPublishedPosts(formattedPublished)
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    } else {
      // Set default published posts if none exist
      const defaultPublished = [
        {
          id: "1",
          title: "How to Build a Blog with Next.js",
          content:
            "<h2>Building a Blog with Next.js</h2><p>Next.js is a powerful framework for building React applications. In this tutorial, we'll explore how to create a blog platform using Next.js, React, and Tailwind CSS.</p>",
          excerpt:
            "Learn how to build a blog platform using Next.js, React, and Tailwind CSS with this step-by-step guide.",
          slug: "how-to-build-a-blog-with-nextjs",
          category: "Tutorial",
          published: true,
          featured: true,
          createdAt: new Date("2023-05-08"),
          updatedAt: new Date("2023-05-08"),
          publishedAt: new Date("2023-05-08"),
        },
        {
          id: "2",
          title: "Mastering Tailwind CSS",
          content:
            "<h2>Mastering Tailwind CSS</h2><p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. In this guide, we'll explore advanced techniques and best practices.</p>",
          excerpt: "Discover advanced techniques and best practices for using Tailwind CSS in your projects.",
          slug: "mastering-tailwind-css",
          category: "Tutorial",
          published: true,
          featured: false,
          createdAt: new Date("2023-06-15"),
          updatedAt: new Date("2023-06-15"),
          publishedAt: new Date("2023-06-15"),
        },
        {
          id: "3",
          title: "Server Components in Next.js",
          content:
            "<h2>Understanding Server Components</h2><p>Server Components are a new feature in React that allows components to be rendered on the server. This can significantly improve performance and user experience.</p>",
          excerpt:
            "An in-depth look at React Server Components and how they improve performance in Next.js applications.",
          slug: "server-components-in-nextjs",
          category: "Guide",
          published: true,
          featured: true,
          createdAt: new Date("2023-07-22"),
          updatedAt: new Date("2023-07-22"),
          publishedAt: new Date("2023-07-22"),
        },
      ]
      setPublishedPosts(defaultPublished)
      localStorage.setItem("publishedPosts", JSON.stringify(defaultPublished))
    }

    // Load draft posts
    const storedDrafts = localStorage.getItem("draftPosts")
    if (storedDrafts) {
      try {
        const parsedDrafts = JSON.parse(storedDrafts)
        // Convert string dates back to Date objects
        const formattedDrafts = parsedDrafts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        }))
        setDraftPosts(formattedDrafts)
      } catch (error) {
        console.error("Error parsing draft posts:", error)
      }
    } else {
      // Set default draft posts if none exist
      const defaultDrafts = [
        {
          id: "4",
          title: "Getting Started with TypeScript",
          content:
            "<h2>TypeScript Fundamentals</h2><p>TypeScript is a strongly typed programming language that builds on JavaScript. In this guide, we'll cover the basics and help you get started with TypeScript in your projects.</p>",
          excerpt: "A comprehensive guide to TypeScript for JavaScript developers looking to level up their skills.",
          slug: "getting-started-with-typescript",
          category: "Guide",
          published: false,
          featured: false,
          createdAt: new Date("2023-06-12"),
          updatedAt: new Date("2023-06-12"),
        },
        {
          id: "5",
          title: "The Future of Web Development",
          content:
            "<h2>Web Development Trends</h2><p>The web development landscape is constantly evolving. In this article, we'll explore emerging trends and technologies that will shape the future of web development.</p>",
          excerpt: "Exploring emerging trends and technologies that will shape the future of web development.",
          slug: "future-of-web-development",
          category: "Opinion",
          published: false,
          featured: false,
          createdAt: new Date("2023-08-03"),
          updatedAt: new Date("2023-08-03"),
        },
      ]
      setDraftPosts(defaultDrafts)
      localStorage.setItem("draftPosts", JSON.stringify(defaultDrafts))
    }
  }

  // Create a custom event to trigger reloading posts
  useEffect(() => {
    // Create a custom event for post updates
    const handlePostUpdate = () => {
      loadPosts()
    }

    // Add event listener
    window.addEventListener("post-updated", handlePostUpdate)

    // Clean up
    return () => {
      window.removeEventListener("post-updated", handlePostUpdate)
    }
  }, [])

  const handleCreatePost = () => {
    setCurrentPost(undefined)
    setEditorOpen(true)
  }

  const handleEditPost = (post: Post) => {
    setCurrentPost(post)
    setEditorOpen(true)
  }

  const handleSavePost = (updatedPost: Post) => {
    if (updatedPost.published) {
      // Update published posts in localStorage
      const storedPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
      const publishedIndex = storedPublished.findIndex((p: Post) => p.id === updatedPost.id)

      if (publishedIndex >= 0) {
        storedPublished[publishedIndex] = updatedPost
      } else {
        storedPublished.push(updatedPost)
      }

      localStorage.setItem("publishedPosts", JSON.stringify(storedPublished))

      // Remove from drafts if it was there
      const storedDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
      const updatedDrafts = storedDrafts.filter((p: Post) => p.id !== updatedPost.id)
      localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts))
    } else {
      // Update draft posts in localStorage
      const storedDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
      const draftIndex = storedDrafts.findIndex((p: Post) => p.id === updatedPost.id)

      if (draftIndex >= 0) {
        storedDrafts[draftIndex] = updatedPost
      } else {
        storedDrafts.push(updatedPost)
      }

      localStorage.setItem("draftPosts", JSON.stringify(storedDrafts))

      // Remove from published if it was there
      const storedPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
      const updatedPublished = storedPublished.filter((p: Post) => p.id !== updatedPost.id)
      localStorage.setItem("publishedPosts", JSON.stringify(updatedPublished))
    }

    // Reload posts from localStorage
    loadPosts()

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event("post-updated"))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader onEditPost={handleEditPost} />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={handleCreatePost}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <Tabs defaultValue="published" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="published">
            {publishedPosts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publishedPosts.map((post) => (
                  <Card key={post.id} className="transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                      <CardDescription>Published on {formatDate(post.publishedAt || post.createdAt)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        Edit
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No published posts"
                description="You haven't published any posts yet. Create a new post to get started."
                action={
                  <Button onClick={handleCreatePost}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                }
              />
            )}
          </TabsContent>
          <TabsContent value="drafts">
            {draftPosts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {draftPosts.map((post) => (
                  <Card key={post.id} className="transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                      <CardDescription>Last edited on {formatDate(post.updatedAt)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        Edit
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No draft posts"
                description="You don't have any drafts. Create a new post to get started."
                action={
                  <Button onClick={handleCreatePost}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>

        <PostEditorModal open={editorOpen} onOpenChange={setEditorOpen} post={currentPost} onSave={handleSavePost} />
      </main>
    </div>
  )
}

