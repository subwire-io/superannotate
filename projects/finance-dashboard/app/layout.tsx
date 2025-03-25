import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FinanceProvider } from "@/lib/data-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Financial Management Application",
  description: "Track expenses, plan budgets, monitor investments, and set financial goals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <FinanceProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">{children}</main>
              <footer className="py-6 border-t">
                <div className="container mx-auto px-4">
                  <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Financial Management Application. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </FinanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'