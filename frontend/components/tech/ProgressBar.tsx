'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  className?: string
  showPercentage?: boolean
}

export default function ProgressBar({
  progress,
  className,
  showPercentage = true
}: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-3 bg-cyber-dark rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute top-0 h-full w-full bg-gradient-primary opacity-50"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      {showPercentage && (
        <div className="text-center mt-2 text-cyber-cyan font-bold">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}
