'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ParticleBackground from '@/components/tech/ParticleBackground'
import NeonCard from '@/components/tech/NeonCard'
import NeonButton from '@/components/tech/NeonButton'

export default function Home() {
  const [stats, setStats] = useState({ articles: 127, users: 89, rate: 99.9 })

  useEffect(() => {
    // 数字动画
    const interval = setInterval(() => {
      setStats(prev => ({
        articles: prev.articles + Math.floor(Math.random() * 3),
        users: prev.users + Math.floor(Math.random() * 2),
        rate: 99.9
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: '🔍',
      title: '多源智能调研',
      description: 'Web 搜索、微信公众号、小红书、学术论文，全网智能调研'
    },
    {
      icon: '🤖',
      title: 'Claude 驱动生成',
      description: '基于 Claude 3.5 的强大能力，生成高质量深度内容'
    },
    {
      icon: '🎨',
      title: 'KAFKA 风格配图',
      description: 'Gemini 驱动，生成独特的 KAFKA 极简风格配图'
    },
    {
      icon: '📦',
      title: '多格式智能导出',
      description: '支持 PDF、HTML、Markdown、小红书等多种格式导出'
    }
  ]

  return (
    <>
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-6">
              <span className="gradient-text">AI WRITER</span>
            </h1>
            <p className="text-2xl md:text-3xl text-cyber-cyan mb-4 glow-text">
              智能写作系统 v1.0
            </p>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              基于 AI 的下一代内容生成平台
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link href="/generate">
              <NeonButton variant="primary" size="large">
                开始使用
              </NeonButton>
            </Link>
            <Link href="/gallery">
              <NeonButton variant="secondary" size="large">
                查看作品
              </NeonButton>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <NeonCard key={index} className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-cyber-cyan">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </NeonCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: '已生成文章', value: stats.articles, unit: '篇' },
              { label: '服务用户', value: stats.users, unit: '人' },
              { label: '好评率', value: stats.rate, unit: '%' }
            ].map((stat, index) => (
              <NeonCard key={index} className="p-8 text-center neon-border">
                <div className="text-5xl font-bold mb-2 gradient-text">
                  {stat.value}
                  <span className="text-2xl text-gray-400 ml-2">{stat.unit}</span>
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </NeonCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">技术栈</h2>
            <p className="text-gray-400">Built with cutting-edge technologies</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
          >
            {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Claude API', 'Gemini API', 'Vercel', 'Railway'].map((tech) => (
              <NeonCard key={tech} className="px-6 py-3 text-cyber-cyan hover:text-cyber-purple transition-colors">
                {tech}
              </NeonCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p className="mb-4">
            Made with ❤️ by <span className="text-cyber-cyan">Your Name</span>
          </p>
          <p className="text-sm">
            © 2024 AI Writer. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
