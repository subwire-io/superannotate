import ImageGallery from "@/components/image-gallery"
import { galleryData } from "@/lib/gallery-data"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Image Gallery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A responsive image gallery with thumbnail navigation and main image display. Click on thumbnails to view
            different images or use the navigation arrows.
          </p>
        </header>

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <ImageGallery images={galleryData.nature} />
        </div>
      </div>
    </main>
  )
}

