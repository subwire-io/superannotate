"use client"
import { ArrowLeft, Calendar, TagIcon, Eye, ExternalLink, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types"
import { useState } from "react"
import { toast } from "sonner"

interface PostViewProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (post: Post) => void
}

export function PostView({ post, open, onOpenChange, onEdit }: PostViewProps) {
  const [viewMode, setViewMode] = useState<"default" | "fullscreen">("default")

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post)
      onOpenChange(false)
    }
  }

  const handleShare = () => {
    // In a real app, this would copy a shareable URL to clipboard
    navigator.clipboard.writeText(`https://yourblog.com/posts/${post.slug}`).then(() => {
      toast.success("Link copied to clipboard", {
        description: "Share this link with others to view this post.",
      })
    })
  }

  const handleOpenInNewTab = () => {
    // In a real app, this would open the post in a new tab
    // For now, we'll just show a toast
    toast.info("In a production app, this would open the post in a new tab")
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "default" ? "fullscreen" : "default")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${viewMode === "fullscreen" ? "max-w-full h-screen max-h-screen m-0 rounded-none" : "sm:max-w-4xl max-h-[90vh]"} overflow-y-auto`}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleViewMode}>
              {viewMode === "fullscreen" ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <article
          className={`prose prose-stone dark:prose-invert max-w-none ${viewMode === "fullscreen" ? "px-8 py-6" : ""}`}
        >
          <div className="bg-muted/30 p-6 rounded-lg mb-8">
            <h1 className="mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
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
                  <Eye className="h-4 w-4 mr-1" />
                  {post.viewCount} views
                </div>
              )}
            </div>

            {post.excerpt && (
              <div className="italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2">{post.excerpt}</div>
            )}
          </div>

          <div className="mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {post.published && (
            <div className="mt-12 pt-6 border-t">
              <h3>Share this post</h3>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </article>
      </DialogContent>
    </Dialog>
  )
}

