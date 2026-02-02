import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeonButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  onClick,
  disabled = false
}: NeonButtonProps) {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    primary: 'bg-gradient-primary text-white shadow-neon-cyan',
    secondary: 'bg-gradient-secondary text-white shadow-neon-pink'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'rounded-lg font-semibold',
        'transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
