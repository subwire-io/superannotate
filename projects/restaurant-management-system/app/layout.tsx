import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeProvider } from "@/components/theme-provider"

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col md:flex-row">
            <div className="hidden md:block">
              <Sidebar className="hidden md:block" />
            </div>
            <div className="flex flex-col flex-1 w-full overflow-hidden">
              <Header />
              <main className="flex-1 p-0 pb-16 md:pb-0 md:p-6 overflow-auto">{children}</main>
              <MobileNav />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'