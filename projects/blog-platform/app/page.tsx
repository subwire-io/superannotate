"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { BlogHeader } from "@/components/blog-header"
import { EmptyState } from "@/components/empty-state"
import { PostEditorModal } from "@/components/post-editor-modal"
import { PostTable } from "@/components/post-table"
import { filterPosts } from "@/lib/utils"
import type { Post, PostFilter } from "@/types"

export default function Dashboard() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<PostFilter>({ status: "all" })

  // State for posts
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  // Load posts from localStorage on initial render
  useEffect(() => {
    loadPosts()
  }, []) // Run only once on mount

  useEffect(() => {
    // Check if we should open the editor with a post from session storage
    const editParam = searchParams.get("edit")
    if (editParam === "true") {
      const storedPost = sessionStorage.getItem("editPost")
      if (storedPost) {
        try {
          const post = JSON.parse(storedPost)
          setCurrentPost({
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
            publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
          })
          setEditorOpen(true)
          // Clear the stored post
          sessionStorage.removeItem("editPost")
        } catch (error) {
          console.error("Error parsing stored post:", error)
        }
      }
    }
  }, [searchParams]) // Only run when searchParams changes

  // Update filtered posts when filter or posts change
  useEffect(() => {
    setFilteredPosts(filterPosts(posts, { ...filter, search: searchQuery }))
  }, [posts, filter, searchQuery])

  // Function to load posts from localStorage
  const loadPosts = () => {
    let allPosts: Post[] = []

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
          tags: post.tags || [],
        }))
        allPosts = [...allPosts, ...formattedPublished]
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
            "# Building a Blog with Next.js\n\nNext.js is a powerful framework for building React applications. In this tutorial, we'll explore how to create a blog platform using Next.js, React, and Tailwind CSS.",
          excerpt:
            "Learn how to build a blog platform using Next.js, React, and Tailwind CSS with this step-by-step guide.",
          slug: "how-to-build-a-blog-with-nextjs",
          category: "Tutorial",
          tags: ["nextjs", "react", "tailwind"],
          published: true,
          featured: true,
          createdAt: new Date("2023-05-08"),
          updatedAt: new Date("2023-05-08"),
          publishedAt: new Date("2023-05-08"),
          viewCount: 1250,
        },
        {
          id: "2",
          title: "Mastering Tailwind CSS",
          content:
            "# Mastering Tailwind CSS\n\nTailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. In this guide, we'll explore advanced techniques and best practices.",
          excerpt: "Discover advanced techniques and best practices for using Tailwind CSS in your projects.",
          slug: "mastering-tailwind-css",
          category: "Tutorial",
          tags: ["tailwind", "css", "design"],
          published: true,
          featured: false,
          createdAt: new Date("2023-06-15"),
          updatedAt: new Date("2023-06-15"),
          publishedAt: new Date("2023-06-15"),
          viewCount: 843,
        },
        {
          id: "3",
          title: "Server Components in Next.js",
          content:
            "# Understanding Server Components\n\nServer Components are a new feature in React that allows components to be rendered on the server. This can significantly improve performance and user experience.",
          excerpt:
            "An in-depth look at React Server Components and how they improve performance in Next.js applications.",
          slug: "server-components-in-nextjs",
          category: "Guide",
          tags: ["nextjs", "react", "performance"],
          published: true,
          featured: true,
          createdAt: new Date("2023-07-22"),
          updatedAt: new Date("2023-07-22"),
          publishedAt: new Date("2023-07-22"),
          viewCount: 967,
        },
      ]
      allPosts = [...allPosts, ...defaultPublished]
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
          tags: post.tags || [],
        }))
        allPosts = [...allPosts, ...formattedDrafts]
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
            "# TypeScript Fundamentals\n\nTypeScript is a strongly typed programming language that builds on JavaScript. In this guide, we'll cover the basics and help you get started with TypeScript in your projects.",
          excerpt: "A comprehensive guide to TypeScript for JavaScript developers looking to level up their skills.",
          slug: "getting-started-with-typescript",
          category: "Guide",
          tags: ["typescript", "javascript"],
          published: false,
          featured: false,
          createdAt: new Date("2023-06-12"),
          updatedAt: new Date("2023-06-12"),
        },
        {
          id: "5",
          title: "The Future of Web Development",
          content:
            "# Web Development Trends\n\nThe web development landscape is constantly evolving. In this article, we'll explore emerging trends and technologies that will shape the future of web development.",
          excerpt: "Exploring emerging trends and technologies that will shape the future of web development.",
          slug: "future-of-web-development",
          category: "Opinion",
          tags: ["webdev", "trends", "future"],
          published: false,
          featured: false,
          createdAt: new Date("2023-08-03"),
          updatedAt: new Date("2023-08-03"),
        },
      ]
      allPosts = [...allPosts, ...defaultDrafts]
      localStorage.setItem("draftPosts", JSON.stringify(defaultDrafts))
    }

    setPosts(allPosts)
    setFilteredPosts(allPosts)
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

  const handleDeletePost = (postId: string) => {
    // Find the post to get its title for the toast message
    const postToDelete = posts.find((post) => post.id === postId)
    if (!postToDelete) return

    // Remove from localStorage
    const storedDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
    const updatedDrafts = storedDrafts.filter((p: Post) => p.id !== postId)
    localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts))

    const storedPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
    const updatedPublished = storedPublished.filter((p: Post) => p.id !== postId)
    localStorage.setItem("publishedPosts", JSON.stringify(updatedPublished))

    // Update the UI by removing the post from the state
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))

    // Close the editor if it was open
    if (currentPost?.id === postId) {
      setEditorOpen(false)
    }

    toast.success("Post deleted", {
      description: `"${postToDelete.title}" has been permanently removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Restore the post
          if (postToDelete.published) {
            const storedPublished = JSON.parse(localStorage.getItem("publishedPosts") || "[]")
            storedPublished.push(postToDelete)
            localStorage.setItem("publishedPosts", JSON.stringify(storedPublished))
          } else {
            const storedDrafts = JSON.parse(localStorage.getItem("draftPosts") || "[]")
            storedDrafts.push(postToDelete)
            localStorage.setItem("draftPosts", JSON.stringify(storedDrafts))
          }

          // Update the UI
          setPosts((prevPosts) => [...prevPosts, postToDelete])

          toast.success("Post restored", {
            description: `"${postToDelete.title}" has been restored.`,
          })
        },
      },
    })

    // Force a refresh to update the UI
    router.refresh()
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilter: Partial<PostFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }))
  }

  // Get unique categories for filtering
  const categories = Array.from(new Set(posts.map((post) => post.category))).filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader onEditPost={handleEditPost} posts={posts} />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={handleCreatePost}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {posts.length > 0 ? (
          <PostTable
            posts={filteredPosts}
            onEdit={handleEditPost}
            onDelete={(post) => handleDeletePost(post.id)}
            categories={categories as string[]}
            onFilterChange={handleFilterChange}
            currentFilter={filter}
            onSearch={handleSearchChange}
            searchQuery={searchQuery}
          />
        ) : (
          <EmptyState
            title="No posts found"
            description="You haven't created any posts yet. Create a new post to get started."
            action={
              <Button onClick={handleCreatePost}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            }
          />
        )}

        <PostEditorModal open={editorOpen} onOpenChange={setEditorOpen} post={currentPost} onSave={handleSavePost} />
      </main>
    </div>
  )
}

