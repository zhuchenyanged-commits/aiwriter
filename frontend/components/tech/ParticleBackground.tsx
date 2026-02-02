'use client'

import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // TypeScript 非 null 断言
    const context = ctx
    const canvasEl = canvas

    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    // 创建粒子
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvasEl.width,
        y: Math.random() * canvasEl.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    function animate() {
      context.clearRect(0, 0, canvasEl.width, canvasEl.height)

      particles.forEach((particle, i) => {
        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy

        // 边界检查
        if (particle.x < 0 || particle.x > canvasEl.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvasEl.height) particle.vy *= -1

        // 绘制粒子
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(0, 245, 255, ${particle.opacity})`
        context.fill()

        // 绘制连线
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(otherParticle.x, otherParticle.y)
            context.strokeStyle = `rgba(0, 245, 255, ${0.1 * (1 - distance / 150)})`
            context.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ opacity: 0.3 }}
    />
  )
}
