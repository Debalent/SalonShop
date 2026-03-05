'use client'
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
                      {state.tipCents > 0 ? ` (${formatCurrency(state.tipCents)})` : ''} = <span className="text-green-400 font-bold">${((providerPayoutAmount(serviceTotal, state.tipCents)) / 100).toFixed(2)}</span>
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
