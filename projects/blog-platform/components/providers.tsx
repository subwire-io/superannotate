"use client"

import type React from "react"
import { SonnerProvider } from "./sonner-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SonnerProvider />
    </>
  )
}

