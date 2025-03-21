"use client"

import { useEffect, useRef } from "react"

// Throttle hook to limit function call frequency
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastCall = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastArgs = useRef<Parameters<T> | null>(null)

  const throttledCallback = (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall.current

    // Store the latest args
    lastArgs.current = args

    // If we haven't called recently, call immediately
    if (timeSinceLastCall >= delay) {
      lastCall.current = now
      callback(...args)
      return
    }

    // Otherwise, set a timeout to call with the latest args
    if (timeoutRef.current === null) {
      timeoutRef.current = setTimeout(() => {
        if (lastArgs.current) {
          callback(...lastArgs.current)
          lastCall.current = Date.now()
          timeoutRef.current = null
        }
      }, delay - timeSinceLastCall)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return throttledCallback
}

