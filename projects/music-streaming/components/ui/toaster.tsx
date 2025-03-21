"use client"

import { useToast } from "./use-toast"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: { id: string; title?: string; description?: string; duration?: number }
  onDismiss: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300) // Wait for animation to complete
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [onDismiss, toast.duration])

  return (
    <div
      className={`bg-background border rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex justify-between items-start">
        {toast.title && <div className="font-medium">{toast.title}</div>}
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onDismiss, 300)
          }}
          className="ml-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      {toast.description && <div className="text-sm text-muted-foreground mt-1">{toast.description}</div>}
    </div>
  )
}

