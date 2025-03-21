"use client"

import ImageGallery from "@/components/image-gallery"
import { galleryData } from "@/lib/gallery-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "@/components/ui/icons"

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

        <Tabs defaultValue="nature" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger
                value="nature"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted"
              >
                Nature
              </TabsTrigger>
              <TabsTrigger
                value="cities"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted"
              >
                Cities
              </TabsTrigger>
              <TabsTrigger
                value="abstract"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted"
              >
                Abstract
              </TabsTrigger>
              <TabsTrigger
                value="empty"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted"
              >
                Empty
              </TabsTrigger>
            </TabsList>

            <ThemeToggle />
          </div>

          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <TabsContent value="nature">
              <ImageGallery images={galleryData.nature} />
            </TabsContent>
            <TabsContent value="cities">
              <ImageGallery images={galleryData.city} />
            </TabsContent>
            <TabsContent value="abstract">
              <ImageGallery images={galleryData.abstract} />
            </TabsContent>
            <TabsContent value="empty">
              <ImageGallery images={[]} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}

function ThemeToggle() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full transition-all hover:scale-105 hover:bg-muted touch-target"
      onClick={() => {
        document.documentElement.classList.toggle("dark")
      }}
      aria-label="Toggle theme"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

