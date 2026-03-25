import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Auronway',
  description: 'Nền tảng giúp sinh viên tích lũy kỹ năng mềm thông qua các hoạt động, sự kiện, workshop. Quản lý điểm rèn luyện và xuất CV chuyên nghiệp dễ dàng.',
  generator: 'auronway',
  openGraph: {
    title: 'Auronway',
    description: 'Nền tảng tích lũy kỹ năng cho sinh viên đại học',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/Auronway_logo-removebg-preview.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/Auronway_logo-removebg-preview.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'Auronway_logo-removebg-preview.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
