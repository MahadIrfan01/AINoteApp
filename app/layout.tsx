import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Note Taker',
  description: 'A simple yet elegant note-taking app with AI-powered quiz generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
