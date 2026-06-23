import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AskAIPersistent from '@/components/AskAIPersistent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Accountrix AI CPA - Enterprise Accounting Platform',
  description: 'Professional AI-powered accounting platform with GAAP compliance, advanced job costing, and 96.8% automation accuracy. Enterprise-ready with comprehensive audit trails.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AskAIPersistent />
      </body>
    </html>
  )
}