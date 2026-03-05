'use client'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReviewData {
  id: string
  reviewer_name: string
  avatar: string            // initials or url
  rating: number
  service: string
  created_at: string        // ISO
  body: string
  would_book_again: boolean
  provider_reply?: string | null
  highlighted?: boolean
}

function Stars({ n, size = 13 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={cn(s <= n ? 'fill-amber-400 text-amber-400' : 'text-white/10')} />
      ))}
    </span>
  )
}

interface ReviewCardProps {
  review: ReviewData
  variant?: 'default' | 'compact'
  className?: string
}

export function ReviewCard({ review, variant = 'default', className }: ReviewCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-2xl border p-5 transition-all duration-300 hover:shadow-card',
        review.highlighted
          ? 'bg-brand-500/8 border-brand-500/20'
          : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.14]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {review.avatar.length <= 2 ? review.avatar : review.avatar[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{review.reviewer_name}</p>
            <p className="text-white/35 text-xs">{review.service}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Stars n={review.rating} />
          <span className="text-white/25 text-[11px]">
            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Body */}
      {variant === 'default' && (
        <p className="text-white/60 text-sm leading-relaxed mb-4">&ldquo;{review.body}&rdquo;</p>
      )}

      {/* Footer chips */}
      <div className="flex flex-wrap items-center gap-2">
        {review.would_book_again && (
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">
            <RefreshCcw size={10} />
            Books again
          </span>
        )}
        {review.rating === 5 && (
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
            <CheckCircle2 size={10} />
            5-star
          </span>
        )}
      </div>

      {/* Provider reply */}
      {review.provider_reply && (
        <div className="mt-4 pl-4 border-l-2 border-brand-500/25">
          <p className="text-[11px] font-bold text-brand-400 mb-1">Your reply</p>
          <p className="text-white/45 text-xs leading-relaxed">{review.provider_reply}</p>
        </div>
      )}
    </motion.div>
  )
}
