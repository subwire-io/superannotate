"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered, Quote } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

interface PostEditorProps {
  value: string
  onChange: (value: string) => void
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[500px] prose prose-stone dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return <div className="h-[500px] w-full animate-pulse rounded-md bg-muted"></div>
  }

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          className="hover:bg-muted data-[state=on]:bg-muted"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          className="hover:bg-muted data-[state=on]:bg-muted"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
          className="hover:bg-muted data-[state=on]:bg-muted"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
          className="hover:bg-muted data-[state=on]:bg-muted"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
          className="hover:bg-muted data-[state=on]:bg-muted"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {editor.getText().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  )
}

