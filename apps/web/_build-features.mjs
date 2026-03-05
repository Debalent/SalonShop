import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

const W = 'C:/sw/apps/web/src'
const mk = (p) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, files[p]) }

const files = {}

/* ══════════════════════════════════════════════════════════════
   1. TipSelector component
══════════════════════════════════════════════════════════════ */
files[`${W}/components/ui/TipSelector.tsx`] = `'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, DollarSign, Edit3, X } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

export type TipMode = 'pct10' | 'pct15' | 'pct20' | 'custom' | 'none'

interface TipSelectorProps {
  serviceTotal: number          // in cents
  onTipChange: (tipCents: number) => void
  className?: string
}

const PRESETS: { id: TipMode; label: string; pct?: number; desc?: string }[] = [
  { id: 'pct10', label: '10%', pct: 0.10 },
  { id: 'pct15', label: '15%', pct: 0.15 },
  { id: 'pct20', label: '20%', pct: 0.20 },
  { id: 'custom', label: 'Custom', desc: 'Enter amount' },
  { id: 'none',   label: 'No tip', desc: 'Skip' },
]

export function TipSelector({ serviceTotal, onTipChange, className }: TipSelectorProps) {
  const [mode, setMode]           = useState<TipMode>('pct15')
  const [customRaw, setCustomRaw] = useState('')

  const tipFor = useCallback((m: TipMode): number => {
    const pr = PRESETS.find(p => p.id === m)
    if (pr?.pct) return Math.round(serviceTotal * pr.pct)
    if (m === 'custom') {
      const v = parseFloat(customRaw.replace(/[^\\d.]/g, ''))
      return isNaN(v) ? 0 : Math.round(v * 100)
    }
    return 0
  }, [serviceTotal, customRaw])

  const select = (m: TipMode) => {
    setMode(m)
    if (m !== 'custom') onTipChange(tipFor(m))
  }

  const handleCustomInput = (val: string) => {
    setCustomRaw(val)
    const v = parseFloat(val.replace(/[^\\d.]/g, ''))
    onTipChange(isNaN(v) ? 0 : Math.round(v * 100))
  }

  const activeTip = tipFor(mode)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-rose-400" />
          <span className="text-sm font-semibold text-white">Add a tip</span>
        </div>
        {mode !== 'none' && activeTip > 0 && (
          <motion.span
            key={activeTip}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-green-400"
          >
            +{formatCurrency(activeTip)}
          </motion.span>
        )}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-5 gap-2">
        {PRESETS.map((preset) => {
          const isActive = mode === preset.id
          const tipAmt   = preset.pct ? Math.round(serviceTotal * preset.pct) : null
          return (
            <motion.button
              key={preset.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => select(preset.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-3 px-1 rounded-xl border text-center transition-all duration-200',
                preset.id === 'none'
                  ? isActive
                    ? 'bg-white/[0.08] border-white/20 text-white'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/65 hover:border-white/15'
                  : isActive
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-glow-teal'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/55 hover:bg-white/[0.06] hover:border-white/15 hover:text-white'
              )}
            >
              {isActive && preset.id !== 'none' && (
                <motion.div
                  layoutId="tip-active"
                  className="absolute inset-0 rounded-xl bg-brand-500/10 border border-brand-500/30"
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="font-bold text-sm leading-tight">
                {preset.id === 'custom' ? <Edit3 size={14} /> : preset.label}
              </span>
              {tipAmt !== null && (
                <span className={cn('text-[10px] mt-0.5', isActive ? 'text-brand-400' : 'text-white/30')}>
                  {formatCurrency(tipAmt)}
                </span>
              )}
              {preset.desc && preset.id !== 'custom' && (
                <span className="text-[10px] mt-0.5 text-white/30">{preset.desc}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Custom amount input */}
      <AnimatePresence>
        {mode === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative mt-1">
              <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="number"
                placeholder="0.00"
                value={customRaw}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="w-full pl-9 pr-10 py-3 bg-white/[0.05] border border-white/10 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 rounded-xl text-white placeholder:text-white/25 text-sm outline-none transition-all"
              />
              {customRaw && (
                <button
                  type="button"
                  onClick={() => { setCustomRaw(''); onTipChange(0) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No-tip note */}
      {mode === 'none' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/30 text-xs text-center"
        >
          No tip — that&apos;s totally fine. You can always tip in person.
        </motion.p>
      )}

      {/* Explainer */}
      {mode !== 'none' && (
        <p className="text-white/25 text-xs text-center flex items-center justify-center gap-1">
          <Heart size={10} className="text-rose-400" />
          100% goes directly to your stylist
        </p>
      )}
    </div>
  )
}
`

/* ══════════════════════════════════════════════════════════════
   2. StarPicker component
══════════════════════════════════════════════════════════════ */
files[`${W}/components/ui/StarPicker.tsx`] = `'use client'
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
`

/* ══════════════════════════════════════════════════════════════
   3. ReviewCard component
══════════════════════════════════════════════════════════════ */
files[`${W}/components/ui/ReviewCard.tsx`] = `'use client'
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
`

/* ══════════════════════════════════════════════════════════════
   4. EarningsBreakdown component
══════════════════════════════════════════════════════════════ */
files[`${W}/components/ui/EarningsBreakdown.tsx`] = `'use client'
import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, Heart, Minus, TrendingUp } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

export interface EarningsData {
  grossService:  number   // cents — service total before fee
  tips:          number   // cents — 100% provider
  platformFee:   number   // cents — 2% of grossService
  net:           number   // cents — grossService - platformFee + tips
  period:        string
}

interface EarningsBreakdownProps {
  data: EarningsData
  className?: string
}

const row = (label: string, value: number, color: string, icon: React.ReactNode, sub?: string) => ({
  label, value, color, icon, sub,
})

export function EarningsBreakdown({ data, className }: EarningsBreakdownProps) {
  const rows = [
    row('Gross service revenue', data.grossService, 'text-white',      <DollarSign size={14} />, data.period),
    row('Tips earned',           data.tips,          'text-green-400',  <Heart size={14} />,       '100% yours'),
    row('Platform fee (2%)',     -data.platformFee,  'text-red-400',    <Minus size={14} />,       'SalonShop keeps'),
  ]

  return (
    <div className={cn('rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6', className)}>
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-brand-400" />
        <h3 className="font-display font-semibold text-white text-sm">Earnings Breakdown</h3>
        <span className="ml-auto text-xs text-white/30">{data.period}</span>
      </div>

      <div className="space-y-3 mb-5">
        {rows.map(({ label, value, color, icon, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/40 flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm">{label}</p>
              {sub && <p className="text-white/25 text-[11px]">{sub}</p>}
            </div>
            <span className={cn('font-bold text-sm tabular-nums', color)}>
              {value < 0 ? '-' : '+'}{formatCurrency(Math.abs(value))}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] mb-4" />

      {/* Net payout */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 rounded-xl bg-brand-500/10 border border-brand-500/25"
      >
        <div className="flex items-center gap-2">
          <ArrowRight size={16} className="text-brand-400" />
          <div>
            <p className="text-brand-300 font-bold text-sm">Net Payout</p>
            <p className="text-white/30 text-xs">After fee, including tips</p>
          </div>
        </div>
        <span className="font-display font-black text-2xl text-white tabular-nums">
          {formatCurrency(data.net)}
        </span>
      </motion.div>
    </div>
  )
}
`

/* ══════════════════════════════════════════════════════════════
   5. OrderSummary component
══════════════════════════════════════════════════════════════ */
files[`${W}/components/ui/OrderSummary.tsx`] = `'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2 } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

export interface OrderLine {
  label: string
  amount: number        // cents; negative = deduction
  variant?: 'normal' | 'tip' | 'fee-hidden' | 'total'
  sub?: string
}

interface OrderSummaryProps {
  lines: OrderLine[]
  showFee?: boolean   // stylist/admin only
  className?: string
}

export function OrderSummary({ lines, showFee = false, className }: OrderSummaryProps) {
  const visible = lines.filter(l => l.variant !== 'fee-hidden' || showFee)
  const total   = visible.find(l => l.variant === 'total')
  const rest    = visible.filter(l => l.variant !== 'total')

  return (
    <div className={cn('rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden', className)}>
      <div className="p-5 space-y-3">
        {rest.map(({ label, amount, variant, sub }) => (
          <div key={label} className="flex items-start gap-2">
            <div className="flex-1">
              <span className={cn('text-sm', variant === 'tip' ? 'text-green-400 font-semibold' : variant === 'fee-hidden' ? 'text-red-400' : 'text-white/65')}>
                {label}
              </span>
              {sub && <p className="text-white/25 text-xs mt-0.5">{sub}</p>}
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={amount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={cn(
                  'font-semibold text-sm tabular-nums',
                  variant === 'tip' ? 'text-green-400' : variant === 'fee-hidden' ? 'text-red-400' : 'text-white'
                )}
              >
                {amount < 0 ? '-' : ''}{formatCurrency(Math.abs(amount))}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {total && (
        <div className="border-t border-white/[0.07] px-5 py-4 flex items-center justify-between bg-white/[0.015]">
          <div>
            <p className="text-white font-bold">Total due today</p>
            {total.sub && <p className="text-white/30 text-xs">{total.sub}</p>}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={total.amount}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-display font-black text-2xl text-white tabular-nums"
            >
              {formatCurrency(total.amount)}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      <div className="px-5 py-3 bg-brand-500/5 border-t border-brand-500/10 flex items-center gap-2">
        <Shield size={13} className="text-brand-400 flex-shrink-0" />
        <p className="text-white/40 text-xs">Payments secured by Stripe · Tips go 100% to your stylist</p>
      </div>
    </div>
  )
}
`

/* ══════════════════════════════════════════════════════════════
   6. Updated booking flow with tip step
══════════════════════════════════════════════════════════════ */
files[`${W}/app/book/[providerId]/_client.tsx`] = `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Clock, DollarSign, Star, MapPin, Shield, CreditCard, Loader2, CheckCircle2, Heart } from 'lucide-react'
import { cn, formatCurrency, formatDuration, platformFeeFromAmount, providerPayoutAmount } from '@/lib/utils'
import { TipSelector }  from '@/components/ui/TipSelector'
import { OrderSummary } from '@/components/ui/OrderSummary'

type BookingStep = 'service' | 'datetime' | 'tip' | 'confirm'

interface BookingState {
  step: BookingStep
  serviceId: string | null
  addOnIds: string[]
  date: Date | null
  timeSlot: string | null
  tipCents: number
  notes: string
}

const mockServices = [
  { id: '1', name: 'Balayage', description: 'Hand-painted highlights for a sun-kissed look', price: 22000, duration: 180, category: 'Color', popular: true, depositPercent: 30 },
  { id: '2', name: "Women's Cut & Style", description: 'Precision cut + blowdry styling', price: 8500, duration: 60, category: 'Cut', popular: false, depositPercent: 0 },
  { id: '3', name: 'Keratin Treatment', description: 'Frizz-free, smooth and silky for up to 3 months', price: 18000, duration: 120, category: 'Treatment', popular: true, depositPercent: 50 },
  { id: '4', name: "Men's Fade", description: 'Clean fade with skin or scissor finish', price: 4500, duration: 45, category: 'Cut', popular: false, depositPercent: 0 },
  { id: '5', name: 'Full Highlights', description: 'Full-head highlights with toner', price: 17500, duration: 150, category: 'Color', popular: false, depositPercent: 30 },
]

const addOns = [
  { id: 'a1', name: 'Deep Conditioning', price: 2500, duration: 15 },
  { id: 'a2', name: 'Toner', price: 3500, duration: 20 },
  { id: 'a3', name: 'Scalp Treatment', price: 2000, duration: 10 },
]

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
]

function generateCalendarDays() {
  const today = new Date()
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })
}

const steps: { id: BookingStep; label: string }[] = [
  { id: 'service',  label: 'Service' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'tip',      label: 'Tip' },
  { id: 'confirm',  label: 'Confirm & Pay' },
]

function BookingSuccess({ service, date, time, amount, tip }: { service: string; date: Date | null; time: string; amount: number; tip: number }) {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={36} className="text-green-400" />
        </motion.div>
        <h2 className="font-display font-black text-3xl text-white mb-2">You&apos;re booked!</h2>
        <p className="text-white/50 mb-6">{service} · {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {time}</p>
        <div className="glass-card p-5 space-y-3 text-left mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Service</span>
            <span className="text-white font-semibold">{formatCurrency(amount - tip)}</span>
          </div>
          {tip > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-400 flex items-center gap-1"><Heart size={12} /> Tip</span>
              <span className="text-green-400 font-semibold">+{formatCurrency(tip)}</span>
            </div>
          )}
          <div className="border-t border-white/[0.06] pt-3 flex justify-between">
            <span className="text-white font-bold">Total paid</span>
            <span className="text-white font-black">{formatCurrency(amount)}</span>
          </div>
        </div>
        <p className="text-white/30 text-sm">Confirmation sent to your email. 📧</p>
      </motion.div>
    </div>
  )
}

export default function BookingPageContent({ params }: { params: { providerId: string } }) {
  const [state, setState] = useState<BookingState>({
    step: 'service',
    serviceId: null,
    addOnIds: [],
    date: null,
    timeSlot: null,
    tipCents: 0,
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [booked, setBooked]       = useState(false)

  const selectedService = mockServices.find(s => s.id === state.serviceId)
  const selectedAddOns  = addOns.filter(a => state.addOnIds.includes(a.id))
  const serviceTotal    = (selectedService?.price ?? 0) + selectedAddOns.reduce((s, a) => s + a.price, 0)
  const totalWithTip    = serviceTotal + state.tipCents

  const days       = generateCalendarDays()
  const stepIndex  = steps.findIndex(s => s.id === state.step)

  const canProceed =
    (state.step === 'service'  && state.serviceId !== null) ||
    (state.step === 'datetime' && state.date !== null && state.timeSlot !== null) ||
    (state.step === 'tip') ||
    (state.step === 'confirm')

  const go = (step: BookingStep) => setState(s => ({ ...s, step }))

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setBooked(true)
    setIsLoading(false)
  }

  if (booked) return <BookingSuccess service={selectedService?.name ?? ''} date={state.date} time={state.timeSlot ?? ''} amount={totalWithTip} tip={state.tipCents} />

  // Build order lines
  const orderLines = [
    { label: selectedService?.name ?? 'Service', amount: selectedService?.price ?? 0 },
    ...selectedAddOns.map(a => ({ label: a.name, amount: a.price })),
    ...(state.tipCents > 0 ? [{ label: 'Tip for stylist', amount: state.tipCents, variant: 'tip' as const, sub: '100% to Alex' }] : []),
    { label: 'Total', amount: totalWithTip, variant: 'total' as const, sub: 'Charged now' },
  ]

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container py-8 max-w-3xl">

        {/* Provider header */}
        <div className="flex items-center gap-4 mb-8 p-5 glass-card">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">A</div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl text-white">Alex Rivera</h1>
            <div className="flex items-center gap-3 text-sm text-white/50 mt-0.5">
              <span className="flex items-center gap-1"><Star size={13} className="fill-yellow-400 text-yellow-400" /> 4.97</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> Atlanta, GA</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
            <Shield size={13} className="text-brand-400" />
            <span className="text-brand-400 text-xs font-semibold">Verified Pro</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {steps.map(({ id, label }, i) => {
            const done   = i < stepIndex
            const active = i === stepIndex
            return (
              <div key={id} className="flex items-center gap-1 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    done   ? 'bg-green-500 text-white'      :
                    active ? 'bg-brand-500 text-white shadow-glow-teal' :
                             'bg-white/10 text-white/30'
                  )}>
                    {done ? <Check size={13} /> : i + 1}
                  </div>
                  <span className={cn('text-[10px] font-medium whitespace-nowrap', active ? 'text-brand-400' : done ? 'text-white/50' : 'text-white/25')}>
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn('flex-1 h-px transition-all', done ? 'bg-green-500/50' : 'bg-white/[0.07]')} />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Main content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >

              {/* STEP: Service */}
              {state.step === 'service' && (
                <div className="space-y-3">
                  <h2 className="font-display font-bold text-xl text-white mb-4">Choose a service</h2>
                  {mockServices.map(svc => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setState(s => ({ ...s, serviceId: svc.id }))}
                      className={cn(
                        'w-full text-left p-4 rounded-2xl border transition-all duration-200',
                        state.serviceId === svc.id
                          ? 'bg-brand-500/12 border-brand-500/40 shadow-glow-teal'
                          : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white text-sm">{svc.name}</span>
                            {svc.popular && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 font-bold">Popular</span>}
                          </div>
                          <p className="text-white/45 text-xs">{svc.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                            <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(svc.duration)}</span>
                            {svc.depositPercent > 0 && <span className="flex items-center gap-1"><CreditCard size={11} />{svc.depositPercent}% deposit</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                          <span className="font-bold text-white">{formatCurrency(svc.price)}</span>
                          {state.serviceId === svc.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                              <Check size={11} className="text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Add-ons */}
                  {state.serviceId && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Add-ons</p>
                      <div className="space-y-2">
                        {addOns.map(a => {
                          const on = state.addOnIds.includes(a.id)
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => setState(s => ({
                                ...s,
                                addOnIds: on ? s.addOnIds.filter(x => x !== a.id) : [...s.addOnIds, a.id],
                              }))}
                              className={cn(
                                'w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all',
                                on ? 'bg-brand-500/10 border-brand-500/30 text-white' : 'bg-white/[0.02] border-white/[0.06] text-white/55 hover:text-white hover:bg-white/[0.05]'
                              )}
                            >
                              <span>{a.name}</span>
                              <div className="flex items-center gap-3">
                                <span className={cn(on ? 'text-brand-300' : 'text-white/35')}>+{formatCurrency(a.price)}</span>
                                <div className={cn('w-4 h-4 rounded-full border flex items-center justify-center', on ? 'bg-brand-500 border-brand-500' : 'border-white/20')}>
                                  {on && <Check size={9} className="text-white" />}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP: Date & Time */}
              {state.step === 'datetime' && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-xl text-white">Pick a date & time</h2>
                  {/* Calendar */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-2 min-w-max">
                      {days.map(d => {
                        const sel = state.date?.toDateString() === d.toDateString()
                        return (
                          <button
                            key={d.toISOString()}
                            type="button"
                            onClick={() => setState(s => ({ ...s, date: d, timeSlot: null }))}
                            className={cn(
                              'flex flex-col items-center px-3 py-3 rounded-xl border min-w-[58px] transition-all',
                              sel ? 'bg-brand-500/15 border-brand-500/40 text-brand-300' : 'bg-white/[0.03] border-white/[0.07] text-white/55 hover:text-white hover:border-white/20'
                            )}
                          >
                            <span className="text-[10px] font-medium">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="font-bold text-lg leading-tight">{d.getDate()}</span>
                            <span className="text-[10px]">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {/* Time slots */}
                  {state.date && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Available times</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {TIME_SLOTS.map(t => {
                          const sel = state.timeSlot === t
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setState(s => ({ ...s, timeSlot: t }))}
                              className={cn(
                                'py-2.5 rounded-xl border text-sm font-medium transition-all',
                                sel ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-glow-teal' : 'bg-white/[0.03] border-white/[0.08] text-white/55 hover:text-white hover:border-white/20'
                              )}
                            >
                              {t}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP: Tip */}
              {state.step === 'tip' && selectedService && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-xl text-white mb-1">Add a tip</h2>
                    <p className="text-white/45 text-sm">Tips go directly to Alex — 100%, no platform cut.</p>
                  </div>

                  <TipSelector
                    serviceTotal={serviceTotal}
                    onTipChange={tip => setState(s => ({ ...s, tipCents: tip }))}
                  />

                  {/* Mini earnings preview for transparency */}
                  <div className="p-4 rounded-xl bg-green-500/8 border border-green-500/15 text-green-300 text-sm">
                    <p className="font-semibold mb-1">Stylist receives</p>
                    <p className="text-white/60 text-xs">
                      Service ({formatCurrency(serviceTotal)}) minus 2% platform fee ({formatCurrency(platformFeeFromAmount(serviceTotal))}), plus your tip
                      {state.tipCents > 0 ? \` (\${formatCurrency(state.tipCents)})\` : ''} = <span className="text-green-400 font-bold">\${((providerPayoutAmount(serviceTotal, state.tipCents)) / 100).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* STEP: Confirm & Pay */}
              {state.step === 'confirm' && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-xl text-white">Review & confirm</h2>

                  {/* Booking summary */}
                  <div className="glass-card p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Service</span>
                      <span className="text-white font-semibold">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Date & Time</span>
                      <span className="text-white font-semibold">
                        {state.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {state.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Duration</span>
                      <span className="text-white font-semibold">{formatDuration(selectedService?.duration ?? 0)}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm text-white/50 font-medium block mb-2">Notes for Alex (optional)</label>
                    <textarea
                      rows={3}
                      value={state.notes}
                      onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
                      placeholder="Any special requests or info Alex should know?"
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/25 rounded-xl p-3.5 text-white/70 placeholder:text-white/20 text-sm outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sidebar: Order summary */}
          <div className="space-y-4">
            {selectedService && (
              <OrderSummary lines={orderLines} />
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.07]">
          <button
            type="button"
            onClick={() => {
              const prev = steps[stepIndex - 1]
              if (prev) go(prev.id)
            }}
            disabled={stepIndex === 0}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all',
              stepIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.04] border-white/10 text-white/65 hover:bg-white/[0.08] hover:text-white'
            )}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {state.step !== 'confirm' ? (
            <button
              type="button"
              disabled={!canProceed}
              onClick={() => {
                const next = steps[stepIndex + 1]
                if (next) go(next.id)
              }}
              className={cn(
                'flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all',
                canProceed
                  ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-glow-teal hover:-translate-y-0.5'
                  : 'bg-white/[0.06] text-white/25 cursor-not-allowed'
              )}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all shadow-glow-teal hover:-translate-y-0.5 disabled:opacity-60 min-w-[160px] justify-center"
            >
              {isLoading ? <><Loader2 size={15} className="animate-spin" /> Processing…</> : <><Shield size={15} /> Pay & confirm</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
`

/* ══════════════════════════════════════════════════════════════
   7. Post-appointment rating page (client-facing)
══════════════════════════════════════════════════════════════ */
files[`${W}/app/rate/[appointmentId]/page.tsx`] = `import RatePageContent from './_client'

export function generateStaticParams() {
  return [{ appointmentId: 'appt_demo' }]
}

export default function RatePage({ params }: { params: { appointmentId: string } }) {
  return <RatePageContent params={params} />
}
`

files[`${W}/app/rate/[appointmentId]/_client.tsx`] = `'use client'
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
`

/* ══════════════════════════════════════════════════════════════
   8. Updated stylist payments page (with earnings breakdown)
══════════════════════════════════════════════════════════════ */
files[`${W}/app/(dashboard)/dashboard/payments/page.tsx`] = `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowDownLeft, Clock, Download, ExternalLink, Heart, Minus, TrendingUp, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { EarningsBreakdown } from '@/components/ui/EarningsBreakdown'

const transactions = [
  { id: '1', client: 'Aria Johnson',  service: 'Balayage',          amount: 22000,  tip: 3300,  status: 'paid',     date: '2026-02-28' },
  { id: '2', client: 'Marcus Lee',    service: "Men's Fade",         amount: 4500,   tip: 675,   status: 'paid',     date: '2026-02-27' },
  { id: '3', client: 'Sofia Reyes',   service: 'Keratin Treatment',  amount: 18000,  tip: 0,     status: 'paid',     date: '2026-02-26' },
  { id: '4', client: 'Dani Park',     service: 'Cut & Style',        amount: 8500,   tip: 1275,  status: 'paid',     date: '2026-02-25' },
  { id: '5', client: 'Tyler Brooks',  service: 'Balayage',           amount: 22000,  tip: 0,     status: 'refunded', date: '2026-02-24' },
]

const payouts = [
  { id: 'po_1', amount: 154200, arrivalDate: '2026-03-06', status: 'pending', period: 'Feb 28 – Mar 5' },
  { id: 'po_2', amount: 248500, arrivalDate: '2026-02-28', status: 'paid',    period: 'Feb 21 – Feb 27' },
  { id: 'po_3', amount: 189000, arrivalDate: '2026-02-21', status: 'paid',    period: 'Feb 14 – Feb 20' },
]

// Feb earnings — compute from transactions
const FEB_GROSS  = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)
const FEB_TIPS   = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.tip,    0)
const FEB_FEE    = Math.round(FEB_GROSS * 0.02)
const FEB_NET    = FEB_GROSS - FEB_FEE + FEB_TIPS

export default function PaymentsPage() {
  const [tab, setTab] = useState<'transactions' | 'payouts'>('transactions')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Payments</h1>
          <p className="text-white/45 text-sm mt-0.5">Earnings, tips, payouts, and transaction history</p>
        </div>
        <button className="btn-secondary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Download size={15} /> Export 1099
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Net this month',  value: formatCurrency(FEB_NET),   sub: '+18% vs last',     color: 'text-green-400',  bg: 'bg-green-500/10',  icon: TrendingUp },
          { label: 'Tips earned',     value: formatCurrency(FEB_TIPS),  sub: '100% yours',        color: 'text-green-400',  bg: 'bg-green-500/10',  icon: Heart },
          { label: 'Pending payout',  value: '$1,542',                   sub: 'Arrives Mar 6',    color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
          { label: 'Platform fees',   value: formatCurrency(FEB_FEE),   sub: '2% of service',    color: 'text-red-400',    bg: 'bg-red-500/10',    icon: Minus },
        ].map(({ label, value, sub, color, bg, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={\`w-8 h-8 rounded-lg \${bg} flex items-center justify-center mb-3\`}>
              <Icon size={15} className={color} />
            </div>
            <p className="text-white/50 text-sm mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-1">{value}</p>
            <p className={\`text-xs \${color}\`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Earnings breakdown */}
      <EarningsBreakdown
        data={{ grossService: FEB_GROSS, tips: FEB_TIPS, platformFee: FEB_FEE, net: FEB_NET, period: 'February 2026' }}
      />

      {/* Stripe banner */}
      <div className="glass-card p-5 border-brand-500/20 bg-brand-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <DollarSign size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Stripe Connect linked</p>
            <p className="text-white/45 text-xs">acct_•••• 3892 · Express account</p>
          </div>
        </div>
        <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-brand-400 text-sm font-semibold hover:text-brand-300 transition-colors">
          Stripe Dashboard <ExternalLink size={14} />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {(['transactions', 'payouts'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all',
              tab === t ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/65'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="card overflow-hidden !p-0">
          <div className="p-5 border-b border-white/[0.06]">
            <h2 className="font-display font-semibold text-white">Transaction history</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {transactions.map(tx => {
              const fee    = Math.round(tx.amount * 0.02)
              const payout = tx.amount - fee + tx.tip
              return (
                <div key={tx.id} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    tx.status === 'paid' ? 'bg-green-500/10' : 'bg-red-500/10'
                  )}>
                    {tx.status === 'paid' ? <CheckCircle size={16} className="text-green-400" /> : <Minus size={16} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{tx.client}</p>
                    <p className="text-white/35 text-xs">{tx.service} · {formatDate(tx.date)}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-white/30 text-xs">Service</p>
                    <p className="text-white text-sm font-semibold">{formatCurrency(tx.amount)}</p>
                  </div>
                  {tx.tip > 0 && (
                    <div className="text-right hidden md:block">
                      <p className="text-white/30 text-xs">Tip</p>
                      <p className="text-green-400 text-sm font-semibold">+{formatCurrency(tx.tip)}</p>
                    </div>
                  )}
                  <div className="text-right hidden md:block">
                    <p className="text-white/30 text-xs">Fee</p>
                    <p className="text-red-400 text-sm font-semibold">-{formatCurrency(fee)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/30 text-xs">Your payout</p>
                    <p className={cn('font-bold', tx.status === 'refunded' ? 'text-red-400 line-through' : 'text-white')}>
                      {formatCurrency(payout)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Payouts */}
      {tab === 'payouts' && (
        <div className="card">
          <h2 className="font-display font-semibold text-white text-sm mb-4">Stripe payouts</h2>
          <div className="space-y-3">
            {payouts.map(({ id, amount, arrivalDate, status, period }) => (
              <div key={id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                  status === 'paid' ? 'bg-green-500/10' : 'bg-yellow-500/10')}>
                  {status === 'paid' ? <ArrowDownLeft size={16} className="text-green-400" /> : <Clock size={16} className="text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{formatCurrency(amount)}</p>
                  <p className="text-white/40 text-xs">{period}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-xs font-semibold capitalize', status === 'paid' ? 'text-green-400' : 'text-yellow-400')}>{status}</p>
                  <p className="text-white/30 text-xs">{formatDate(arrivalDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
`

/* ══════════════════════════════════════════════════════════════
   9. Updated reviews page (with "would book again" + reply)
══════════════════════════════════════════════════════════════ */
files[`${W}/app/(dashboard)/dashboard/reviews/page.tsx`] = `'use client'
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
          { label: 'Would book again', value: \`\${WBA}%\`,            sub: 'of clients', icon: RefreshCcw, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: '5-star reviews',  value: DIST[0].count,          sub: \`of \${reviews.length}\`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={\`w-8 h-8 rounded-lg \${bg} flex items-center justify-center mb-3\`}>
              <Icon size={15} className={color} />
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-0.5">{value}</p>
            <p className={\`text-xs \${color}\`}>{sub}</p>
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
                  animate={{ width: \`\${(count / reviews.length) * 100}%\` }}
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
            {n === 0 ? 'All' : \`\${n} stars\`}
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
`

/* ══════════════════════════════════════════════════════════════
   10. Admin dashboard page
══════════════════════════════════════════════════════════════ */
files[`${W}/app/(dashboard)/dashboard/admin/page.tsx`] = `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  DollarSign, Users, Star, TrendingUp, AlertTriangle,
  Shield, CheckCircle, XCircle, Eye, Heart, Minus,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

/* ── Mock data ── */
const revenueByMonth = [
  { month: 'Sep', gmv: 48200,  fees: 964,  tips: 7200  },
  { month: 'Oct', gmv: 69000,  fees: 1380, tips: 10500 },
  { month: 'Nov', gmv: 62400,  fees: 1248, tips: 9400  },
  { month: 'Dec', gmv: 91200,  fees: 1824, tips: 13700 },
  { month: 'Jan', gmv: 81600,  fees: 1632, tips: 12200 },
  { month: 'Feb', gmv: 98800,  fees: 1976, tips: 14800 },
]

const providerFees = [
  { name: 'Alex Rivera',    gmv: 22400, fee: 448,  tips: 3360, net: 25312 },
  { name: 'Jordan Okafor',  gmv: 18600, fee: 372,  tips: 2790, net: 21018 },
  { name: 'Sofia Ramirez',  gmv: 15200, fee: 304,  tips: 2280, net: 17176 },
  { name: 'Destiny Williams',gmv: 14800, fee: 296,  tips: 2220, net: 16724 },
  { name: 'Marcus Chen',    gmv: 12900, fee: 258,  tips: 1935, net: 14577 },
  { name: 'Priya Nair',     gmv: 14900, fee: 298,  tips: 2235, net: 16837 },
]

const pendingReviews = [
  { id: 'pr1', reviewer: 'James K.',  provider: 'Destiny W.', rating: 2, body: 'Appointment ran 45 minutes late with no communication. Not great.', flagged: false },
  { id: 'pr2', reviewer: 'Amy L.',    provider: 'Alex R.',    rating: 5, body: 'Absolutely amazing as always, my hair has never looked better!',     flagged: false },
  { id: 'pr3', reviewer: 'Deleted1',  provider: 'Marcus C.',  rating: 1, body: 'Spam link <<<click here for free gift>>>',                           flagged: true },
]

const TOTAL_GMV   = revenueByMonth.reduce((s, r) => s + r.gmv,  0)
const TOTAL_FEES  = revenueByMonth.reduce((s, r) => s + r.fees, 0)
const TOTAL_TIPS  = revenueByMonth.reduce((s, r) => s + r.tips, 0)
const TOTAL_PROS  = providerFees.length

type ModAction = 'approve' | 'remove'

export default function AdminPage() {
  const [reviews,  setReviews]  = useState(pendingReviews)
  const [modDone,  setModDone]  = useState<Record<string, ModAction>>({})
  const [activeTab, setTab]     = useState<'overview' | 'fees' | 'reviews'>('overview')

  const moderate = (id: string, action: ModAction) => {
    setModDone(m => ({ ...m, [id]: action }))
    setTimeout(() => setReviews(r => r.filter(x => x.id !== id)), 600)
  }

  const tabs = [
    { key: 'overview', label: 'Platform Overview' },
    { key: 'fees',     label: 'Fee Breakdown' },
    { key: 'reviews',  label: 'Review Moderation' },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <Shield size={13} className="text-red-400" />
            </div>
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Platform Analytics</h1>
          <p className="text-white/45 text-sm mt-0.5">Revenue, fees, tips, and review moderation</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total GMV',       value: formatCurrency(TOTAL_GMV  * 100), sub: '6-month total',    color: 'text-white',      bg: 'bg-white/5',        icon: DollarSign  },
          { label: 'Platform revenue', value: formatCurrency(TOTAL_FEES * 100), sub: '2% of GMV',        color: 'text-brand-400',  bg: 'bg-brand-500/10',   icon: TrendingUp  },
          { label: 'Total tips paid',  value: formatCurrency(TOTAL_TIPS * 100), sub: '100% to providers', color: 'text-green-400',  bg: 'bg-green-500/10',   icon: Heart       },
          { label: 'Active providers', value: TOTAL_PROS,                        sub: 'paid tier',         color: 'text-purple-400', bg: 'bg-purple-500/10',  icon: Users       },
        ].map(({ label, value, sub, color, bg, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={\`w-8 h-8 rounded-lg \${bg} flex items-center justify-center mb-3\`}>
              <Icon size={15} className={color} />
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-0.5">{value}</p>
            <p className={\`text-xs \${color}\`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all',
              activeTab === t.key ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/65'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue chart */}
          <div className="card">
            <h2 className="font-display font-semibold text-white text-sm mb-6">GMV vs Platform Revenue (6 mo)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a50e0" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a50e0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => \`$\${(v/1000).toFixed(0)}k\`} />
                <Tooltip
                  contentStyle={{ background: '#04091e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v: number, name: string) => [\`$\${v.toLocaleString()}\`, name === 'gmv' ? 'GMV' : name === 'fees' ? 'Platform rev' : 'Tips']}
                />
                <Area type="monotone" dataKey="gmv"  stroke="#1a50e0" strokeWidth={2} fill="url(#gmv)" name="gmv" />
                <Area type="monotone" dataKey="fees" stroke="#22c55e" strokeWidth={2} fill="url(#fee)" name="fees" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-3 justify-center">
              {[['#1a50e0','GMV'], ['#22c55e','Platform revenue'], ['#f59e0b','Tips']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-white/40">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color as string }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Tips chart */}
          <div className="card">
            <h2 className="font-display font-semibold text-white text-sm mb-4">Tips volume (not platform revenue)</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={revenueByMonth} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => \`$\${(v/1000).toFixed(0)}k\`} />
                <Tooltip contentStyle={{ background: '#04091e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={(v: number) => [\`$\${v.toLocaleString()}\`, 'Tips']} />
                <Bar dataKey="tips" fill="#22c55e" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fee breakdown tab */}
      {activeTab === 'fees' && (
        <div className="card overflow-hidden !p-0">
          <div className="p-5 border-b border-white/[0.06]">
            <h2 className="font-display font-semibold text-white">Fee breakdown by provider</h2>
            <p className="text-white/35 text-xs mt-0.5">February 2026 · 2% of gross service revenue</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {providerFees.map(p => (
              <div key={p.name} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{p.name}</p>
                </div>
                <div className="hidden sm:flex items-center gap-8 text-right">
                  <div>
                    <p className="text-white/25 text-[10px]">GMV</p>
                    <p className="text-white text-sm font-semibold">{formatCurrency(p.gmv * 100)}</p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px]">Tips</p>
                    <p className="text-green-400 text-sm font-semibold">+{formatCurrency(p.tips * 100)}</p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px]">Platform fee</p>
                    <p className="text-red-400 text-sm font-semibold">-{formatCurrency(p.fee * 100)}</p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px]">Net payout</p>
                    <p className="text-white font-bold text-sm">{formatCurrency(p.net * 100)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between">
            <span className="text-white/30 text-xs">Total platform revenue this month</span>
            <span className="font-display font-black text-xl text-brand-400">{formatCurrency(providerFees.reduce((s, p) => s + p.fee, 0) * 100)}</span>
          </div>
        </div>
      )}

      {/* Review moderation tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-yellow-400" />
            <p className="text-white/50 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''} pending moderation</p>
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-16 text-white/25">
              <CheckCircle size={32} className="mx-auto mb-3 text-green-400/50" />
              <p>All reviews cleared — nice work!</p>
            </div>
          )}

          {reviews.map(r => (
            <motion.div
              key={r.id}
              layout
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'card p-5',
                r.flagged ? 'border-red-500/25 bg-red-500/5' : 'border-white/[0.08]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={cn(s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10')} />
                      ))}
                    </div>
                    <span className="text-white text-sm font-semibold">{r.reviewer}</span>
                    <span className="text-white/30 text-xs">→ {r.provider}</span>
                    {r.flagged && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 font-bold">Flagged</span>
                    )}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">&ldquo;{r.body}&rdquo;</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => moderate(r.id, 'approve')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all"
                  >
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button
                    onClick={() => moderate(r.id, 'remove')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
                  >
                    <XCircle size={13} /> Remove
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/35 text-xs hover:text-white/55 transition-all">
                    <Eye size={13} /> Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
`

/* write all files */
for (const [path, content] of Object.entries(files)) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}
console.log(`Written ${Object.keys(files).length} files successfully.`)
