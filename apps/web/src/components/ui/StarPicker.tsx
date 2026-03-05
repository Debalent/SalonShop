'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarPickerProps {
  value: number
  onChange: (v: number) => void
  size?: number
  readonly?: boolean
  className?: string
}

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing!']

export function StarPicker({ value, onChange, size = 36, readonly = false, className }: StarPickerProps) {
  const [hover, setHover] = useState(0)
  const effective = hover || value

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className="flex items-center gap-1.5"
        onMouseLeave={() => !readonly && setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((s) => {
          const filled = s <= effective
          return (
            <motion.button
              key={s}
              type="button"
              disabled={readonly}
              whileTap={!readonly ? { scale: 0.85 } : {}}
              whileHover={!readonly ? { scale: 1.15 } : {}}
              onClick={() => !readonly && onChange(s)}
              onMouseEnter={() => !readonly && setHover(s)}
              className={cn('transition-all duration-100', readonly ? 'cursor-default' : 'cursor-pointer')}
            >
              <Star
                size={size}
                className={cn(
                  'transition-all duration-150',
                  filled ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'text-white/15'
                )}
              />
            </motion.button>
          )
        })}
      </div>
      {!readonly && (
        <motion.p
          key={effective}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-sm font-semibold h-5',
            effective >= 4 ? 'text-amber-400' : effective >= 3 ? 'text-white/60' : 'text-white/40'
          )}
        >
          {LABELS[effective] || ''}
        </motion.p>
      )}
    </div>
  )
}
