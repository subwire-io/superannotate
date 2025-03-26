"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { useMobile } from "@/hooks/use-mobile"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)

  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile)
  }, [isMobile])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors position="top-right" duration={3000} />
          <div className="flex min-h-screen overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex flex-col flex-1 w-full">
              <Header toggleSidebar={toggleSidebar} title="HR Dashboard" />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

