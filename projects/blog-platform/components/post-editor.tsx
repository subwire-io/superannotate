"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CharacterCount from "@tiptap/extension-character-count"
import { Bold, Italic, List, ListOrdered, Quote } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export function PostEditor() {
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount],
    content: `
      <h2>Welcome to the Blog Editor</h2>
      <p>This is a simple editor for your blog posts. You can format text, add headings, and more.</p>
      <p>Start typing to create your content...</p>
    `,
    editorProps: {
      attributes: {
        class:
          "min-h-[500px] prose prose-stone dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-4",
      },
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
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
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

