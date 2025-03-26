"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpDown, ChevronDown, Pencil, Trash, Check, Filter, Search, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SimpleInput } from "./ui/simple-input"
import { formatDate, sortPosts } from "@/lib/utils"
import type { Post, SortField, SortDirection, PostFilter } from "@/types"
import { toast } from "sonner"

interface PostTableProps {
  posts: Post[]
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
  categories: string[]
  onFilterChange?: (filter: Partial<PostFilter>) => void
  currentFilter?: PostFilter
  onSearch?: (query: string) => void
  searchQuery?: string
}

export function PostTable({
  posts,
  onEdit,
  onDelete,
  categories,
  onFilterChange,
  currentFilter = { status: "all" },
  onSearch,
  searchQuery = "",
}: PostTableProps) {
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const router = useRouter()

  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleFilterCategory = (category: string | undefined) => {
    if (onFilterChange) {
      onFilterChange({ category })
    }
  }

  const handleFilterStatus = (status: "all" | "published" | "draft") => {
    if (onFilterChange) {
      onFilterChange({ status })
    }
  }

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      onDelete(postToDelete)
      setPostToDelete(null)
    }
  }

  const handleRowClick = (post: Post, e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest(".action-buttons")) {
      return
    }

    // Navigate to post page - use window.location for a full page navigation
    // This avoids potential router-related re-render issues
    window.location.href = `/posts/${post.id}`
  }

  const handleShare = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation()

    // Create the post URL
    const postUrl = `${window.location.origin}/posts/${post.id}`

    // Copy to clipboard
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success("Link copied to clipboard", {
          description: "Share this link with others to view this post.",
        })
      })
      .catch(() => {
        toast.error("Failed to copy link", {
          description: "Please try again or copy the URL manually.",
        })
      })
  }

  const sortedPosts = sortPosts(posts, sortField, sortDirection)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SimpleInput
              placeholder="Search posts..."
              value={localSearchQuery}
              onChange={handleSearch}
              className="w-full pl-8 pr-4"
            />
            {localSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearchQuery("")
                  if (onSearch) onSearch("")
                }}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Category
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleFilterCategory(undefined)}>
                <Check className={`h-4 w-4 mr-2 ${!currentFilter.category ? "opacity-100" : "opacity-0"}`} />
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => handleFilterCategory(category)}>
                  <Check
                    className={`h-4 w-4 mr-2 ${currentFilter.category === category ? "opacity-100" : "opacity-0"}`}
                  />
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Status
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleFilterStatus("all")}>
                <Check className={`h-4 w-4 mr-2 ${currentFilter.status === "all" ? "opacity-100" : "opacity-0"}`} />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterStatus("published")}>
                <Check
                  className={`h-4 w-4 mr-2 ${currentFilter.status === "published" ? "opacity-100" : "opacity-0"}`}
                />
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterStatus("draft")}>
                <Check className={`h-4 w-4 mr-2 ${currentFilter.status === "draft" ? "opacity-100" : "opacity-0"}`} />
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-8 border rounded-md">No posts found.</div>
        ) : (
          sortedPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-md p-4 space-y-3 cursor-pointer hover:border-primary transition-colors"
              onClick={(e) => handleRowClick(post, e)}
            >
              <div>
                <h3 className="font-medium line-clamp-1">{post.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">{post.category}</Badge>
                {post.published ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Published</Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </div>

              <div className="text-xs text-muted-foreground">Updated: {formatDate(post.updatedAt)}</div>

              <div className="flex gap-2 pt-2 action-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-1/3"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(post)
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="w-1/3" onClick={(e) => handleShare(post, e)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-1/3 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPostToDelete(post)
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 font-medium"
                >
                  Title
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-1 font-medium"
                >
                  Category
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="flex items-center gap-1 font-medium"
                >
                  Last Updated
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              sortedPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(e) => handleRowClick(post, e)}
                >
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(post.updatedAt)}</TableCell>
                  <TableCell className="text-right action-buttons">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(post)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => handleShare(post, e)}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPostToDelete(post)
                        }}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post "{postToDelete?.title}" and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-muted transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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

