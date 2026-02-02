'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import NeonCard from '@/components/tech/NeonCard'
import { articleApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Article {
  id: string
  topic: string
  tier: string
  status: string
  progress: number
  created_at: string
  completed_at?: string
  content?: {
    title: string
    images?: string[]
  }
}

export default function GalleryPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await articleApi.getList()
      setArticles(response.data.articles || [])
    } catch (error) {
      console.error('Fetch articles error:', error)
      toast.error('获取文章列表失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true
    if (filter === 'completed') return article.status === 'completed'
    if (filter === 'pending') return article.status !== 'completed'
    return true
  })

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">作品画廊</h1>
          <p className="text-gray-400">AI 生成的智能内容</p>
        </motion.div>

        {/* 筛选按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-4 mb-12"
        >
          {[
            { key: 'all', label: '全部' },
            { key: 'completed', label: '已完成' },
            { key: 'pending', label: '生成中' }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-6 py-2 rounded-lg transition-all ${
                filter === f.key
                  ? 'bg-gradient-primary text-white shadow-neon-cyan'
                  : 'bg-cyber-dark/50 text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* 文章列表 */}
        {loading ? (
          <div className="text-center text-cyber-cyan">加载中...</div>
        ) : filteredArticles.length === 0 ? (
          <NeonCard className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-xl text-gray-400 mb-4">暂无文章</div>
            <Link href="/generate">
              <button className="text-cyber-cyan hover:underline">
                立即创建第一篇文章 →
              </button>
            </Link>
          </NeonCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/article/${article.id}`}>
                  <NeonCard className="p-6 h-full hover:scale-105 transition-transform cursor-pointer">
                    {/* 状态标签 */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        article.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : article.status === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-cyber-cyan/20 text-cyber-cyan'
                      }`}>
                        {article.status === 'completed' ? '已完成' :
                         article.status === 'failed' ? '失败' : '生成中'}
                      </span>
                      <span className="text-xs text-gray-500">{article.tier} 档</span>
                    </div>

                    {/* 标题 */}
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {article.content?.title || article.topic}
                    </h3>

                    {/* 进度条（生成中） */}
                    {article.status !== 'completed' && article.status !== 'failed' && (
                      <div className="mb-4">
                        <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary transition-all duration-500"
                            style={{ width: `${article.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 时间 */}
                    <div className="text-sm text-gray-400">
                      {article.completed_at
                        ? `完成于 ${formatDate(article.completed_at)}`
                        : `创建于 ${formatDate(article.created_at)}`
                      }
                    </div>

                    {/* 查看按钮 */}
                    <div className="mt-4 text-cyber-cyan text-sm font-semibold">
                      {article.status === 'completed' ? '查看详情 →' : '查看进度 →'}
                    </div>
                  </NeonCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
