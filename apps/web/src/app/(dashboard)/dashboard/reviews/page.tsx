'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquare, TrendingUp, RefreshCcw, Send, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReviewCard, ReviewData } from '@/components/ui/ReviewCard'

const REVIEWS: ReviewData[] = [
  { id: 'r1', reviewer_name: 'Maya T.',    avatar: 'MT', rating: 5, service: 'Balayage + Gloss',  created_at: '2026-02-10', body: 'Alex completely transformed my hair. The balayage is exactly what I had in mind — natural and sun-kissed. Booking again next month!', would_book_again: true,  provider_reply: 'Thank you so much Maya! It was such a pleasure working with you. See you next month! 🌟' },
  { id: 'r2', reviewer_name: 'Jasmine R.', avatar: 'JR', rating: 5, service: 'Precision Haircut', created_at: '2026-02-02', body: 'Best precision cut I have ever had. She really listened to what I wanted and the result was perfect. 10/10.',                       would_book_again: true,  provider_reply: null },
  { id: 'r3', reviewer_name: 'Nadia W.',   avatar: 'NW', rating: 5, service: 'Curly Cut (Dry)',   created_at: '2026-01-21', body: 'Finally found someone who truly understands curly hair. My curls have never looked this defined and healthy.',                     would_book_again: true,  provider_reply: null },
  { id: 'r4', reviewer_name: 'Priya L.',   avatar: 'PL', rating: 4, service: 'Root Touch-up',     created_at: '2026-01-10', body: 'Great experience overall. Communication was quick and the salon space feels very elevated. Will definitely return.',                  would_book_again: true,  provider_reply: 'So glad you had a great experience, Priya! Looking forward to seeing you again.' },
  { id: 'r5', reviewer_name: 'Aisha C.',   avatar: 'AC', rating: 5, service: 'Style & Blow-dry',  created_at: '2026-01-05', body: 'Incredible blow-dry. My hair was so shiny and bouncy. Worth every penny!',                                                          would_book_again: true,  provider_reply: null },
  { id: 'r6', reviewer_name: 'Bianca T.',  avatar: 'BT', rating: 3, service: 'Balayage + Gloss',  created_at: '2025-12-28', body: 'The result was nice but it took a bit longer than expected. Would still recommend.',                                                   would_book_again: false, provider_reply: null },
]

const AVG  = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
const WBA  = Math.round((REVIEWS.filter(r => r.would_book_again).length / REVIEWS.length) * 100)
const DIST = [5,4,3,2,1].map(n => ({ stars: n, count: REVIEWS.filter(r => r.rating === n).length }))

export default function ReviewsPage() {
  const [reviews,      setReviews]     = useState<ReviewData[]>(REVIEWS)
  const [replyId,      setReplyId]     = useState<string | null>(null)
  const [replyText,    setReplyText]   = useState('')
  const [filterRating, setFilter]      = useState(0)

  const submitReply = (id: string) => {
    if (!replyText.trim()) return
    setReviews(prev => prev.map(r => r.id === id ? { ...r, provider_reply: replyText } : r))
    setReplyId(null); setReplyText('')
  }

  const filtered = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Reviews</h1>
        <p className="text-white/45 text-sm mt-0.5">{reviews.length} total reviews</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg rating',      value: AVG.toFixed(2),       sub: 'out of 5', icon: Star,        color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Total reviews',   value: reviews.length,        sub: 'verified', icon: MessageSquare, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Would book again', value: `${WBA}%`,            sub: 'of clients', icon: RefreshCcw, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: '5-star reviews',  value: DIST[0].count,          sub: `of ${reviews.length}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={15} className={color} />
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-0.5">{value}</p>
            <p className={`text-xs ${color}`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Rating distribution */}
      <div className="card">
        <h2 className="font-display font-semibold text-white text-sm mb-4">Rating breakdown</h2>
        <div className="space-y-2.5">
          {DIST.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 w-20 flex-shrink-0">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={11} className={cn(s <= stars ? 'fill-amber-400 text-amber-400' : 'text-white/10')} />
                ))}
              </div>
              <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / reviews.length) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
              <span className="text-xs text-white/35 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-white/30" />
        {[0,5,4,3,2,1].map(n => (
          <button
            key={n}
            onClick={() => setFilter(n)}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all',
              filterRating === n
                ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                : 'bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/65'
            )}
          >
            {n === 0 ? 'All' : `${n} stars`}
          </button>
        ))}
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id}>
            <ReviewCard review={review} />
            {/* Reply UI */}
            {!review.provider_reply && (
              <div className="mt-2 ml-2">
                {replyId === review.id ? (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex gap-2 mt-2"
                    >
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write a public reply…"
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/40 rounded-xl p-3 text-white/70 placeholder:text-white/20 text-sm outline-none resize-none"
                      />
                      <div className="flex flex-col gap-1.5">
                        <button onClick={() => submitReply(review.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-semibold">
                          <Send size={12} /> Send
                        </button>
                        <button onClick={() => { setReplyId(null); setReplyText('') }} className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/35 text-xs">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <button onClick={() => setReplyId(review.id)} className="text-xs text-white/30 hover:text-brand-400 transition-colors flex items-center gap-1 mt-1.5">
                    <MessageSquare size={11} /> Reply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
