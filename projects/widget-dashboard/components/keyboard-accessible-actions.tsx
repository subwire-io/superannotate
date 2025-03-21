"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

type Action = {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

type KeyboardAccessibleActionsProps = {
  actions: Action[]
  columns?: number
  className?: string
}

export function KeyboardAccessibleActions({ actions, columns = 2, className = "" }: KeyboardAccessibleActionsProps) {
  const containerRef = useKeyboardNavigation({
    selector: '[role="button"]:not([disabled])',
    onEnter: (element) => {
      element.click()
    },
  })

  // Focus the first button when the component mounts
  useEffect(() => {
    const firstButton = containerRef.current?.querySelector<HTMLElement>('[role="button"]:not([disabled])')
    if (firstButton) {
      firstButton.focus()
    }
  }, [])

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`grid grid-cols-${columns} gap-4 ${className}`}
      role="group"
      aria-label="Quick actions"
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={action.onClick}
          disabled={action.disabled}
          aria-label={action.label}
        >
          {action.icon}
          <span className="text-xs font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}

