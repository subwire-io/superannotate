"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, TagIcon, Eye, Share2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types"
import { toast } from "sonner"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = () => {
      // Fetch post data from localStorage
      const postId = params.id as string
      if (!postId) {
        router.push("/")
        return
      }

      // Try to find the post in published posts
      const storedPublished = localStorage.getItem("publishedPosts")
      const publishedPosts = storedPublished ? JSON.parse(storedPublished) : []
      let foundPost = publishedPosts.find((p: any) => p.id === postId)

      // If not found in published, try drafts
      if (!foundPost) {
        const storedDrafts = localStorage.getItem("draftPosts")
        const draftPosts = storedDrafts ? JSON.parse(storedDrafts) : []
        foundPost = draftPosts.find((p: any) => p.id === postId)
      }

      if (foundPost) {
        // Format dates
        setPost({
          ...foundPost,
          createdAt: new Date(foundPost.createdAt),
          updatedAt: new Date(foundPost.updatedAt),
          publishedAt: foundPost.publishedAt ? new Date(foundPost.publishedAt) : undefined,
        })
      } else {
        toast.error("Post not found")
        router.push("/")
      }

      setLoading(false)
    }

    fetchPost()
    // Only depend on params.id, not router which might change
  }, [params.id])

  const handleShare = () => {
    // In a real app, this would copy a shareable URL to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post?.id}`).then(() => {
      toast.success("Link copied to clipboard", {
        description: "Share this link with others to view this post.",
      })
    })
  }

  const handleEdit = () => {
    // Store the post in sessionStorage to be picked up by the editor
    if (post) {
      sessionStorage.setItem("editPost", JSON.stringify(post))
      router.push("/?edit=true")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6 md:p-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/4 bg-muted rounded"></div>
            <div className="h-12 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6 md:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <p className="mt-2 text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <article className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {post.published ? (
                  <span>Published {formatDate(post.publishedAt)}</span>
                ) : (
                  <span>Last updated {formatDate(post.updatedAt)}</span>
                )}
              </div>

              <Badge variant="outline" className="ml-2">
                {post.category}
              </Badge>

              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <TagIcon className="h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {post.viewCount !== undefined && (
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {post.viewCount} views
                </div>
              )}
            </div>

            {post.excerpt && (
              <div className="mt-4 italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2">
                {post.excerpt}
              </div>
            )}
          </div>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {post.published && (
            <div className="mt-12 pt-6 border-t">
              <h3 className="text-lg font-semibold">Share this post</h3>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}

