import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant Management System",
  description: "Complete solution for restaurant operations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col md:flex-row">
            <div className="hidden md:block sticky top-0 h-screen">
              <Sidebar className="hidden md:block h-full" />
            </div>
            <div className="flex flex-col flex-1 w-full overflow-hidden">
              <main className="flex-1 p-4 sm:p-5 pb-20 md:pb-0 md:p-8 overflow-x-hidden">{children}</main>
              <MobileNav />
            </div>
          </div>
          <Toaster closeButton={true} richColors={true} position="top-right" duration={4000} />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'