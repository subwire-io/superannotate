import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogHeader } from "@/components/blog-header"
import { EmptyState } from "@/components/empty-state"

export default function Dashboard() {
  const publishedPosts = [
    {
      id: "1",
      title: "How to Build a Blog with Next.js",
      date: "May 8, 2023",
      excerpt:
        "Learn how to build a blog platform using Next.js, React, and Tailwind CSS with this step-by-step guide.",
      category: "Tutorial",
    },
    {
      id: "2",
      title: "Mastering Tailwind CSS",
      date: "June 15, 2023",
      excerpt: "Discover advanced techniques and best practices for using Tailwind CSS in your projects.",
      category: "Tutorial",
    },
    {
      id: "3",
      title: "Server Components in Next.js",
      date: "July 22, 2023",
      excerpt: "An in-depth look at React Server Components and how they improve performance in Next.js applications.",
      category: "Guide",
    },
  ]

  const draftPosts = [
    {
      id: "4",
      title: "Getting Started with TypeScript",
      date: "June 12, 2023",
      excerpt: "A comprehensive guide to TypeScript for JavaScript developers looking to level up their skills.",
      category: "Guide",
    },
    {
      id: "5",
      title: "The Future of Web Development",
      date: "August 3, 2023",
      excerpt: "Exploring emerging trends and technologies that will shape the future of web development.",
      category: "Opinion",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link href="/editor">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Link>
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
                      <CardDescription>Published on {post.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Link href={`/editor/${post.id}`}>Edit</Link>
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
                  <Button asChild>
                    <Link href="/editor">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
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
                      <CardDescription>Last edited on {post.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Link href={`/editor/${post.id}`}>Edit</Link>
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
                  <Button asChild>
                    <Link href="/editor">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

