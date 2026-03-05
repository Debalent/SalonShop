'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquare, Flag, ThumbsUp, TrendingUp } from 'lucide-react'

type Review = {
  id: string
  reviewer_name: string
  avatar_initials: string
  rating: number
  service: string
  created_at: string
  body: string
  provider_reply: string | null
}

const REVIEWS: Review[] = [
  { id: 'r1', reviewer_name: 'Maya T.',    avatar_initials: 'MT', rating: 5, service: 'Balayage + Gloss',  created_at: '2024-11-10', body: 'Alex completely transformed my hair. The balayage is exactly what I had in mind — natural and sun-kissed. Booking again next month!',         provider_reply: 'Thank you so much Maya! It was such a pleasure working with you. See you next month! 🌟' },
  { id: 'r2', reviewer_name: 'Jasmine R.', avatar_initials: 'JR', rating: 5, service: 'Precision Haircut', created_at: '2024-11-02', body: 'Best precision cut I have ever had. She really listened to what I wanted and the result was perfect. 10/10.',                                    provider_reply: null },
  { id: 'r3', reviewer_name: 'Nadia W.',   avatar_initials: 'NW', rating: 5, service: 'Curly Cut (Dry)',   created_at: '2024-10-21', body: 'Finally found someone who truly understands curly hair. My curls have never looked this defined and healthy.',                                provider_reply: null },
  { id: 'r4', reviewer_name: 'Priya L.',   avatar_initials: 'PL', rating: 4, service: 'Root Touch-up',     created_at: '2024-10-10', body: 'Great experience overall. Communication was quick and the salon space feels very elevated. Will definitely return.',                          provider_reply: 'So glad you had a great experience, Priya! Looking forward to seeing you again.' },
  { id: 'r5', reviewer_name: 'Aisha C.',   avatar_initials: 'AC', rating: 5, service: 'Style & Blow-dry', created_at: '2024-10-05', body: 'Incredible blow-dry. My hair was so shiny and bouncy. Worth every penny!',                                                                   provider_reply: null },
  { id: 'r6', reviewer_name: 'Bianca T.',  avatar_initials: 'BT', rating: 3, service: 'Balayage + Gloss',  created_at: '2024-09-28', body: 'The result was nice but it took a bit longer than expected. Would still recommend.',                                                         provider_reply: null },
]

const AVG_RATING = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
const DIST = [5,4,3,2,1].map(n => ({ stars: n, count: REVIEWS.filter(r => r.rating === n).length }))

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS)
  const [replyId, setReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [filterRating, setFilterRating] = useState(0)

  const submitReply = (id: string) => {
    if (!replyText.trim()) return
    setReviews(prev => prev.map(r => r.id === id ? { ...r, provider_reply: replyText, provider_replied_at: new Date().toISOString() } : r))
    setReplyId(null)
    setReplyText('')
  }

  const filtered = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reviews</h1>
        <p className="text-surface-400 text-sm mt-0.5">{reviews.length} total reviews</p>
      </div>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex flex-col sm:flex-row gap-6 items-center"
      >
        <div className="text-center flex-shrink-0">
          <div className="text-5xl font-bold text-white mb-1">{AVG_RATING.toFixed(1)}</div>
          <StarRating rating={AVG_RATING} size={18} />
          <div className="text-surface-500 text-sm mt-1">{reviews.length} reviews</div>
        </div>
        <div className="flex-1 w-full sm:w-auto space-y-2">
          {DIST.map(({ stars, count }) => (
            <button
              key={stars}
              onClick={() => setFilterRating(filterRating === stars ? 0 : stars)}
              className={`flex items-center gap-2 w-full group transition-all ${filterRating === stars ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <span className="text-xs text-surface-400 w-3">{stars}</span>
              <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <div className="flex-1 bg-surface-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-amber-400 rounded-full transition-all"
                  style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-surface-500 w-4 text-right">{count}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          {[
            { icon: TrendingUp, label: 'Response Rate', value: `${Math.round((reviews.filter(r => r.provider_reply).length / reviews.length) * 100)}%` },
            { icon: ThumbsUp,   label: '5-Star Rate',   value: `${Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-surface-800/50">
              <Icon size={14} className="text-brand-400 mx-auto mb-1" />
              <div className="font-bold text-white text-sm">{value}</div>
              <div className="text-surface-600 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Review List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                    {review.avatar_initials}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{review.reviewer_name}</div>
                    <div className="text-surface-500 text-xs">{review.service} · {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} size={14} />
                  <button className="text-surface-600 hover:text-surface-400 transition-colors"><Flag size={13} /></button>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-surface-300 text-sm leading-relaxed">{review.body}</p>

              {/* Provider Reply */}
              {review.provider_reply && (
                <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-3">
                  <div className="text-xs font-semibold text-brand-400 mb-1">Your Reply</div>
                  <p className="text-surface-300 text-sm">{review.provider_reply}</p>
                </div>
              )}

              {/* Reply Form */}
              <AnimatePresence>
                {replyId === review.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      placeholder="Write a thoughtful reply…"
                      className="input-field w-full resize-none text-sm"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setReplyId(null)} className="btn-secondary text-sm px-3 py-1.5">Cancel</button>
                      <button onClick={() => submitReply(review.id)} className="btn-primary text-sm px-3 py-1.5">Post Reply</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action */}
              {!review.provider_reply && replyId !== review.id && (
                <button onClick={() => { setReplyId(review.id); setReplyText('') }} className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors text-sm">
                  <MessageSquare size={14} /> Reply
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
