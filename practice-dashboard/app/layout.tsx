import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Practice Dashboard',
  description: 'Personal practice and milestone tracking dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
