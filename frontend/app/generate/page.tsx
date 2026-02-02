'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import NeonCard from '@/components/tech/NeonCard'
import NeonButton from '@/components/tech/NeonButton'
import { articleApi } from '@/lib/api'

const TIERS = [
  { id: 'A', label: 'A 档', desc: '2000-3000 字', words: '2-3k字' },
  { id: 'B', label: 'B 档', desc: '3000-5000 字', words: '3-5k字' },
  { id: 'C', label: 'C 档', desc: '5000-8000 字', words: '5-8k字' },
  { id: 'D', label: 'D 档', desc: '8000-12000 字', words: '8-12k字' }
]

const FORMATS = [
  { id: 'markdown', label: 'Markdown' },
  { id: 'pdf', label: 'PDF' },
  { id: 'html', label: 'HTML' },
  { id: 'xiaohongshu', label: '小红书' }
]

export default function GeneratePage() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [tier, setTier] = useState('B')
  const [formats, setFormats] = useState(['markdown', 'pdf'])
  const [loading, setLoading] = useState(false)

  const toggleFormat = (formatId: string) => {
    setFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('请输入文章主题')
      return
    }

    if (formats.length === 0) {
      toast.error('请至少选择一种输出格式')
      return
    }

    setLoading(true)

    try {
      const response = await articleApi.generate({
        topic: topic.trim(),
        tier,
        formats
      })

      const { article_id } = response.data

      toast.success('文章生成任务已创建！')

      // 跳转到状态页面
      router.push(`/article/${article_id}`)
    } catch (error: any) {
      console.error('Generate error:', error)
      toast.error(error.response?.data?.detail || '生成失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-2 gradient-text">创建新文章</h1>
          <p className="text-gray-400 mb-12">基于 AI 的智能内容生成</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NeonCard className="p-8">
            {/* 主题输入 */}
            <div className="mb-8">
              <label className="block text-cyber-cyan mb-3 text-lg font-semibold">
                📝 文章主题
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：大语言模型的发展趋势"
                className="w-full px-6 py-4 bg-cyber-dark/50 border border-white/10 rounded-lg
                         text-white placeholder-gray-500
                         focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20
                         transition-all"
                disabled={loading}
              />
            </div>

            {/* 字数档位 */}
            <div className="mb-8">
              <label className="block text-cyber-cyan mb-3 text-lg font-semibold">
                📊 字数档位
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TIERS.map((t) => (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !loading && setTier(t.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      tier === t.id
                        ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-neon-cyan'
                        : 'border-white/10 hover:border-cyber-cyan/50'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-bold text-lg mb-1">{t.label}</div>
                    <div className="text-sm text-gray-400">{t.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 输出格式 */}
            <div className="mb-8">
              <label className="block text-cyber-cyan mb-3 text-lg font-semibold">
                📦 输出格式
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {FORMATS.map((format) => (
                  <motion.button
                    key={format.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !loading && toggleFormat(format.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formats.includes(format.id)
                        ? 'border-cyber-purple bg-cyber-purple/10 shadow-neon-purple'
                        : 'border-white/10 hover:border-cyber-purple/50'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-semibold">{format.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 提示信息 */}
            <div className="mb-8 p-4 rounded-lg bg-cyber-dark/50 border border-white/10">
              <div className="text-cyber-cyan mb-2">💡 提示</div>
              <div className="text-gray-400 text-sm space-y-1">
                <div>• 生成过程约需要 2-5 分钟</div>
                <div>• 会进行多源调研，生成配图</div>
                <div>• 完成后会自动保存到作品画廊</div>
              </div>
            </div>

            {/* 生成按钮 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NeonButton
                variant="primary"
                size="large"
                className="w-full"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? '正在创建任务...' : '🚀 开始生成'}
              </NeonButton>
            </motion.div>
          </NeonCard>
        </motion.div>
      </div>
    </div>
  )
}
