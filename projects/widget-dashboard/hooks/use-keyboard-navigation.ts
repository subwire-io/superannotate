"use client"

import { useEffect, useRef } from "react"

type KeyboardNavigationOptions = {
  selector: string
  onEnter?: (element: HTMLElement) => void
  onEscape?: () => void
  loop?: boolean
  active?: boolean
}

export function useKeyboardNavigation({
  selector,
  onEnter,
  onEscape,
  loop = true,
  active = true,
}: KeyboardNavigationOptions) {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const elements = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
      )

      if (!elements.length) return

      const currentIndex = elements.findIndex((el) => el === document.activeElement)

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          if (currentIndex === -1 || currentIndex === elements.length - 1) {
            if (loop) elements[0].focus()
          } else {
            elements[currentIndex + 1].focus()
          }
          break
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          if (currentIndex === -1 || currentIndex === 0) {
            if (loop) elements[elements.length - 1].focus()
          } else {
            elements[currentIndex - 1].focus()
          }
          break
        case "Home":
          e.preventDefault()
          elements[0].focus()
          break
        case "End":
          e.preventDefault()
          elements[elements.length - 1].focus()
          break
        case "Enter":
          if (currentIndex !== -1 && onEnter) {
            e.preventDefault()
            onEnter(elements[currentIndex])
          }
          break
        case "Escape":
          if (onEscape) {
            e.preventDefault()
            onEscape()
          }
          break
      }
    }

    container.addEventListener("keydown", handleKeyDown)
    return () => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  }, [selector, onEnter, onEscape, loop, active])

  return containerRef
}

