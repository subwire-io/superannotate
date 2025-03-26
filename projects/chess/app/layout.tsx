import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chess App',
  description: 'Chess app made in React and next.js',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
