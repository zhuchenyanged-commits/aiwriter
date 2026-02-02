'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import NeonCard from '@/components/tech/NeonCard'
import ProgressBar from '@/components/tech/ProgressBar'
import { articleApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism'

interface Article {
  id: string
  topic: string
  tier: string
  status: 'pending' | 'researching' | 'writing' | 'generating_images' | 'integrating' | 'completed' | 'failed'
  progress: number
  created_at: string
  completed_at?: string
  content?: {
    title: string
    markdown: string
    html: string
    images: string[]
  }
  error?: string
}

const STATUS_MAP = {
  pending: '等待开始',
  researching: '正在调研...',
  writing: 'AI 生成内容中...',
  generating_images: '生成配图中...',
  integrating: '整合内容...',
  completed: '已完成',
  failed: '生成失败'
}

const STATUS_STEPS = [
  { key: 'researching', label: '完成多源调研' },
  { key: 'writing', label: '完成 AI 内容生成' },
  { key: 'generating_images', label: '生成 KAFKA 风格配图' },
  { key: 'integrating', label: '整合和导出' }
]

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return

    const fetchArticle = async () => {
      try {
        const response = await articleApi.getDetail(params.id as string)
        setArticle(response.data)
      } catch (error: any) {
        console.error('Fetch article error:', error)
        toast.error('获取文章信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()

    // 如果未完成，轮询状态
    const interval = setInterval(async () => {
      try {
        const response = await articleApi.getDetail(params.id as string)
        const data = response.data as Article

        setArticle(data)

        // 如果完成或失败，停止轮询
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Poll error:', error)
      }
    }, 3000) // 每 3 秒轮询一次

    return () => clearInterval(interval)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-cyan">加载中...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">文章不存在</div>
      </div>
    )
  }

  // 如果失败
  if (article.status === 'failed') {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <NeonCard className="p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">生成失败</h2>
            <p className="text-gray-400 mb-6">{article.error || '未知错误'}</p>
            <button
              onClick={() => router.push('/generate')}
              className="text-cyber-cyan hover:underline"
            >
              返回重新生成
            </button>
          </NeonCard>
        </div>
      </div>
    )
  }

  // 如果已完成
  if (article.status === 'completed' && article.content) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* 返回按钮 */}
          <button
            onClick={() => router.push('/gallery')}
            className="text-cyber-cyan hover:text-cyber-purple mb-8 transition-colors"
          >
            ← 返回作品画廊
          </button>

          {/* 文章内容 */}
          <NeonCard className="p-8">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              {article.content.title}
            </h1>

            <div className="flex gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-white/10">
              <span>生成时间: {formatDate(article.completed_at!)}</span>
              <span>字数档位: {article.tier}</span>
            </div>

            {/* Markdown 内容 */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypePrism]}
              >
                {article.content.markdown}
              </ReactMarkdown>
            </div>

            {/* 下载按钮 */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex gap-4 flex-wrap">
                <a
                  href={`/api/articles/${article.id}/download/pdf`}
                  className="px-6 py-3 bg-gradient-primary rounded-lg font-semibold text-white"
                  download
                >
                  下载 PDF
                </a>
                <a
                  href={`/api/articles/${article.id}/download/markdown`}
                  className="px-6 py-3 bg-gradient-secondary rounded-lg font-semibold text-white"
                  download
                >
                  下载 Markdown
                </a>
              </div>
            </div>
          </NeonCard>
        </div>
      </div>
    )
  }

  // 生成中状态
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-8 gradient-text">
            正在生成文章...
          </h1>

          <NeonCard className="p-8">
            {/* 主题 */}
            <div className="mb-8">
              <div className="text-gray-400 mb-2">文章主题</div>
              <div className="text-2xl font-semibold text-white">
                {article.topic}
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-8">
              <ProgressBar progress={article.progress} />
            </div>

            {/* 当前状态 */}
            <div className="mb-8 text-center">
              <div className="text-lg text-cyber-cyan">
                {STATUS_MAP[article.status]}
              </div>
            </div>

            {/* 步骤列表 */}
            <div className="space-y-4">
              {STATUS_STEPS.map((step, index) => {
                const stepIndex = STATUS_STEPS.findIndex(s => s.key === article.status)
                const isCompleted = index < stepIndex
                const isCurrent = index === stepIndex
                const isPending = index > stepIndex

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isCurrent ? 'bg-cyber-cyan/10 border border-cyber-cyan' :
                      isCompleted ? 'opacity-60' :
                      'opacity-30'
                    }`}
                  >
                    <div className={`text-2xl ${
                      isCompleted ? 'text-green-400' :
                      isCurrent ? 'text-cyber-cyan animate-pulse' :
                      'text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : isCurrent ? '⟳' : '⏳'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{step.label}</div>
                      {isCurrent && (
                        <div className="text-sm text-gray-400">处理中...</div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* 提示 */}
            <div className="mt-8 p-4 rounded-lg bg-cyber-dark/50 border border-white/10">
              <div className="text-sm text-gray-400">
                生成过程约需要 2-5 分钟，您可以关闭此页面，稍后回来查看结果
              </div>
            </div>
          </NeonCard>
        </motion.div>
      </div>
    </div>
  )
}
