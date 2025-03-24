"use client"

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, List, ListOrdered, Quote, Eye, Code, Image, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface PostEditorProps {
  value: string
  onChange: (value: string) => void
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInsertMarkdown = (markdownSymbol: string, surroundSelection = true) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let newText = ""

    if (surroundSelection) {
      // Surround selected text with markdown symbols
      newText =
        textarea.value.substring(0, start) +
        markdownSymbol +
        selectedText +
        markdownSymbol +
        textarea.value.substring(end)

      // Set cursor position after the inserted text
      const newCursorPos = end + markdownSymbol.length * 2

      onChange(newText)

      // Set focus back to textarea and restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    } else {
      // Insert markdown at cursor position (for lists, headers, etc.)
      newText = textarea.value.substring(0, start) + markdownSymbol + textarea.value.substring(end)

      // Set cursor position after the inserted markdown
      const newCursorPos = start + markdownSymbol.length

      onChange(newText)

      // Set focus back to textarea and restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const insertBold = () => handleInsertMarkdown("**")
  const insertItalic = () => handleInsertMarkdown("*")
  const insertCode = () => handleInsertMarkdown("`")
  const insertBulletList = () => handleInsertMarkdown("- ", false)
  const insertNumberedList = () => handleInsertMarkdown("1. ", false)
  const insertBlockquote = () => handleInsertMarkdown("> ", false)
  const insertImage = () => handleInsertMarkdown("![alt text](image-url)", false)
  const insertLink = () => handleInsertMarkdown("[link text](url)", false)

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-background/50">
        <Button variant="ghost" size="sm" onClick={insertBold} className="h-8 w-8 p-0 hover:bg-muted">
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertItalic} className="h-8 w-8 p-0 hover:bg-muted">
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertCode} className="h-8 w-8 p-0 hover:bg-muted">
          <Code className="h-4 w-4" />
          <span className="sr-only">Code</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertBulletList} className="h-8 w-8 p-0 hover:bg-muted">
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertNumberedList} className="h-8 w-8 p-0 hover:bg-muted">
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertBlockquote} className="h-8 w-8 p-0 hover:bg-muted">
          <Quote className="h-4 w-4" />
          <span className="sr-only">Quote</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertImage} className="h-8 w-8 p-0 hover:bg-muted">
          <Image className="h-4 w-4" />
          <span className="sr-only">Image</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={insertLink} className="h-8 w-8 p-0 hover:bg-muted">
          <Link className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <TabsList className="bg-background/50 border-b rounded-none p-0 h-auto">
          <TabsTrigger
            value="write"
            className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none py-2 px-4"
          >
            Write
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none py-2 px-4 flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="p-0 m-0">
          <div className="bg-background">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[400px] w-full resize-none border-0 bg-transparent p-4 font-mono text-sm focus:outline-none"
              placeholder="Start writing with Markdown..."
            />
          </div>
        </TabsContent>
        <TabsContent value="preview" className="p-0 m-0">
          <div className="min-h-[400px] p-4 prose prose-stone dark:prose-invert max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

