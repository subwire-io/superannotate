"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function PublishControls() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const handleSaveDraft = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsPublishing(false)
    setOpenDialog(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSaving}>
        {isSaving ? (
          <>Saving...</>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </>
        )}
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="sm">Publish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Publish Post</DialogTitle>
            <DialogDescription>Configure your post settings before publishing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input id="slug" defaultValue="how-to-build-a-blog" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="excerpt" className="text-right">
                Excerpt
              </Label>
              <Input id="excerpt" defaultValue="A short description of your post" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featured" className="text-right">
                Featured
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Show on homepage</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

