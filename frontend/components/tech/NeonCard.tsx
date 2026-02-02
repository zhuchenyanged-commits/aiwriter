import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeonCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function NeonCard({ children, className, hover = true }: NeonCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)' } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'glass rounded-lg p-6',
        'border border-white/10',
        'hover:border-cyber-cyan/50',
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
