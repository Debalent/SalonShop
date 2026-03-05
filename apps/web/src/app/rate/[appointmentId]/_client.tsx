'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StarPicker } from '@/components/ui/StarPicker'
import Logo from '@/components/ui/Logo'

type Stage = 'rate' | 'done'

export default function RatePageContent({ params }: { params: { appointmentId: string } }) {
  const [stars,          setStars]  = useState(0)
  const [body,           setBody]   = useState('')
  const [wouldBookAgain, setWBA]    = useState(true)
  const [submitting,     setSub]    = useState(false)
  const [stage,          setStage]  = useState<Stage>('rate')

  const canSubmit = stars > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSub(true)
    await new Promise(r => setTimeout(r, 1200))
    setStage('done')
    setSub(false)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-5">

      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="font-display font-bold text-lg text-white">Salon<span className="gradient-text">Shop</span></span>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'rate' ? (
          <motion.div
            key="rate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="glass-card p-8 space-y-7">
              {/* Provider */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  A
                </div>
                <h1 className="font-display font-bold text-2xl text-white mb-1">How was your experience?</h1>
                <p className="text-white/40 text-sm">Appointment with Alex Rivera · Balayage</p>
              </div>

              {/* Star Rating */}
              <div className="flex flex-col items-center">
                <StarPicker value={stars} onChange={setStars} size={44} />
              </div>

              {/* Written feedback */}
              <div>
                <label className="text-sm text-white/50 font-medium block mb-2">
                  Tell Alex (and future clients) more <span className="text-white/25">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  maxLength={500}
                  placeholder="What stood out? What could be better?"
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/25 rounded-xl p-4 text-white/70 placeholder:text-white/20 text-sm outline-none resize-none transition-all"
                />
                <p className="text-white/20 text-xs mt-1.5 text-right">{body.length}/500</p>
              </div>

              {/* Would book again toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div>
                  <p className="text-white font-semibold text-sm">Would you book with Alex again?</p>
                  <p className="text-white/35 text-xs mt-0.5">Helps Alex attract the right clients</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWBA(v => !v)}
                  className="flex-shrink-0 transition-all hover:scale-105"
                >
                  {wouldBookAgain
                    ? <ToggleRight size={36} className="text-brand-400" />
                    : <ToggleLeft  size={36} className="text-white/25" />}
                </button>
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all',
                  canSubmit && !submitting
                    ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-glow-teal hover:-translate-y-0.5'
                    : 'bg-white/[0.06] text-white/25 cursor-not-allowed'
                )}
              >
                {submitting ? 'Submitting…' : 'Submit review'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
              className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={36} className="text-green-400" />
            </motion.div>
            <h2 className="font-display font-black text-3xl text-white mb-3">Thank you!</h2>
            <p className="text-white/50 mb-6">Your review has been shared with Alex and will help other clients discover great service.</p>
            <Link href="/" className="btn-primary">
              Back to SalonShop
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
