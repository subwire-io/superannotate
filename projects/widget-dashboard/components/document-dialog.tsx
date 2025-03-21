"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import { useState } from "react"

export function DocumentDialog({
  open,
  onOpenChange,
  onCreateDocument,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateDocument: (document: { title: string; content: string }) => void
}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleCreate = () => {
    if (title && content) {
      onCreateDocument({ title, content })
      setTitle("")
      setContent("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Document</DialogTitle>
          <DialogDescription>Create a new document to share with your team.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <FileText className="h-16 w-16 text-primary" aria-hidden="true" />
          </div>
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Document Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>
          <div>
            <Label htmlFor="content" className="mb-2 block">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your document content..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title || !content}>
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

