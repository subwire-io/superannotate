import type React from "react"
import { Toaster } from "sonner"
import "@/app/globals.css"

export const metadata = {
  title: "Musicify - Music Streaming Interface",
  description: "A responsive music streaming interface with playlist management and recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          closeButton
          richColors
          toastOptions={{
            duration: 5000,
          }}
        />
      </body>
    </html>
  )
}



import './globals.css'