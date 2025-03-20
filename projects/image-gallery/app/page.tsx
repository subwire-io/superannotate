import GalleryDemo from "@/components/gallery-demo"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">Image Gallery Demo</h1>
        <p className="mb-8 text-muted-foreground">
          A responsive image gallery with thumbnail navigation and main image display
        </p>
        <GalleryDemo />
      </div>
    </main>
  )
}

