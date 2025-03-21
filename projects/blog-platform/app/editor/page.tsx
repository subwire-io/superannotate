import { BlogHeader } from "@/components/blog-header"
import { PostEditor } from "@/components/post-editor"
import { CategorySelector } from "@/components/category-selector"
import { PublishControls } from "@/components/publish-controls"

export default function EditorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Post title"
              className="w-full border-none bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CategorySelector />
            <PublishControls />
          </div>
          <PostEditor />
        </div>
      </main>
    </div>
  )
}

