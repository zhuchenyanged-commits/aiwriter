import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'AI Writer - 智能写作系统 | 个人作品展示',
  description: '基于 Claude 和 Gemini 的下一代 AI 写作系统，支持多源调研和 KAFKA 风格配图生成',
  keywords: ['AI写作', 'Claude', 'Gemini', 'Next.js', '作品展示'],
  authors: [{ name: 'AI Writer', url: 'https://aiwriter.tech' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#0a0a0f',
  openGraph: {
    title: 'AI Writer - 智能写作系统',
    description: '基于 AI 的智能写作系统',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-cyber-black">
          {/* 背景效果 */}
          <div className="fixed inset-0 animated-grid -z-10" />
          <div className="fixed inset-0 bg-gradient-glow -z-20" />

          <Navbar />
          <main className="relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
