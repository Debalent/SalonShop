'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Check, ChevronLeft, ChevronRight, Clock, DollarSign, Star, MapPin, Shield, CreditCard, Loader2 } from 'lucide-react'
import { cn, formatCurrency, formatDuration } from '@/lib/utils'

type BookingStep = 'service' | 'datetime' | 'confirm'

interface BookingState {
  step: BookingStep
  serviceId: string | null
  addOnIds: string[]
  date: Date | null
  timeSlot: string | null
  payDeposit: boolean
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
  const days = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

const steps: { id: BookingStep; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'confirm', label: 'Confirm & Pay' },
]

export default function BookingPageContent({ params }: { params: { providerId: string } }) {
  const [state, setState] = useState<BookingState>({
    step: 'service',
    serviceId: null,
    addOnIds: [],
    date: null,
    timeSlot: null,
    payDeposit: true,
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  const selectedService = mockServices.find((s) => s.id === state.serviceId)
  const selectedAddOns = addOns.filter((a) => state.addOnIds.includes(a.id))

  const totalAmount = (selectedService?.price ?? 0) + selectedAddOns.reduce((sum, a) => sum + a.price, 0)
  const depositAmount = selectedService
    ? Math.round(totalAmount * (selectedService.depositPercent / 100))
    : 0
  const dueNow = state.payDeposit && depositAmount > 0 ? depositAmount : totalAmount

  const days = generateCalendarDays()
  const stepIndex = steps.findIndex((s) => s.id === state.step)

  const canProceed =
    (state.step === 'service' && state.serviceId) ||
    (state.step === 'datetime' && state.date && state.timeSlot)

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setBooked(true)
    setIsLoading(false)
  }

  if (booked) return <BookingSuccess service={selectedService?.name ?? ''} date={state.date} time={state.timeSlot ?? ''} amount={dueNow} />

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container py-8 max-w-3xl">
        {/* Provider Header */}
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
        <div className="flex items-center gap-2 mb-8">
          {steps.map(({ id, label }, i) => {
            const done = i < stepIndex
            const active = i === stepIndex
            return (
              <div key={id} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300',
                  done ? 'bg-brand-500 text-white' : active ? 'bg-brand-500/20 border-2 border-brand-500 text-brand-400' : 'bg-white/5 border border-white/15 text-white/30'
                )}>
                  {done ? <Check size={13} /> : i + 1}
                </div>
                <span className={cn('text-sm font-medium hidden sm:block', active ? 'text-white' : done ? 'text-white/70' : 'text-white/30')}>
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <div className={cn('flex-1 h-px', done ? 'bg-brand-500/50' : 'bg-white/10')} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {state.step === 'service' && (
            <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className="font-display font-bold text-xl text-white mb-4">Choose a service</h2>
              <div className="space-y-3 mb-6">
                {mockServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setState((p) => ({ ...p, serviceId: p.serviceId === svc.id ? null : svc.id }))}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200',
                      state.serviceId === svc.id
                        ? 'bg-brand-500/10 border-brand-500/40 shadow-glow-teal'
                        : 'glass-card hover:border-white/15 hover:bg-white/[0.04]'
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">{svc.name}</span>
                        {svc.popular && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 font-medium">Popular</span>
                        )}
                      </div>
                      <p className="text-white/45 text-xs mt-1">{svc.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-white/50 text-xs flex items-center gap-1"><Clock size={11} /> {formatDuration(svc.duration)}</span>
                        {svc.depositPercent > 0 && (
                          <span className="text-white/50 text-xs flex items-center gap-1"><DollarSign size={11} /> {svc.depositPercent}% deposit req.</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-base">{formatCurrency(svc.price)}</p>
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      state.serviceId === svc.id ? 'border-brand-500 bg-brand-500' : 'border-white/20'
                    )}>
                      {state.serviceId === svc.id && <Check size={11} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {state.serviceId && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                  <h3 className="text-white/70 font-medium text-sm mb-3">Add-ons (optional)</h3>
                  <div className="flex flex-wrap gap-2">
                    {addOns.map((addon) => {
                      const selected = state.addOnIds.includes(addon.id)
                      return (
                        <button
                          key={addon.id}
                          onClick={() => setState((p) => ({
                            ...p,
                            addOnIds: selected ? p.addOnIds.filter((id) => id !== addon.id) : [...p.addOnIds, addon.id]
                          }))}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-sm font-medium border transition-all',
                            selected ? 'bg-brand-500/15 border-brand-500/40 text-brand-400' : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
                          )}
                        >
                          + {addon.name} · {formatCurrency(addon.price)}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {state.step === 'datetime' && (
            <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className="font-display font-bold text-xl text-white mb-4">Pick a date</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
                {days.map((day) => {
                  const isSelected = state.date?.toDateString() === day.toDateString()
                  const dayName = day.toLocaleDateString('en-US', { weekday: 'short' })
                  const dayNum = day.getDate()
                  const isToday = new Date().toDateString() === day.toDateString()
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setState((p) => ({ ...p, date: day, timeSlot: null }))}
                      className={cn(
                        'flex flex-col items-center gap-1 px-3 py-3 rounded-xl border min-w-[58px] transition-all duration-200 flex-shrink-0',
                        isSelected ? 'bg-brand-500/15 border-brand-500/40 text-brand-400' : 'glass-card hover:border-white/15 text-white/60 hover:text-white'
                      )}
                    >
                      <span className="text-xs font-medium">{dayName}</span>
                      <span className={cn('text-lg font-bold leading-none', isSelected ? 'text-brand-400' : '')}>{dayNum}</span>
                      {isToday && <span className="text-[10px] text-brand-400">Today</span>}
                    </button>
                  )
                })}
              </div>

              {state.date && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-white font-medium mb-3">Available times</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = state.timeSlot === slot
                      const unavailable = ['9:30 AM', '10:30 AM', '2:30 PM'].includes(slot)
                      return (
                        <button
                          key={slot}
                          disabled={unavailable}
                          onClick={() => setState((p) => ({ ...p, timeSlot: slot }))}
                          className={cn(
                            'py-2.5 rounded-xl text-sm font-medium border transition-all duration-150',
                            isSelected ? 'bg-brand-500/15 border-brand-500/40 text-brand-400' : unavailable ? 'opacity-30 cursor-not-allowed bg-white/3 border-white/5 text-white/30' : 'glass-card hover:border-white/15 text-white/60 hover:text-white'
                          )}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {state.step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className="font-display font-bold text-xl text-white mb-6">Review & pay</h2>

              {/* Summary */}
              <div className="glass-card p-5 mb-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{selectedService?.name}</span>
                    <span className="text-white font-medium">{formatCurrency(selectedService?.price ?? 0)}</span>
                  </div>
                  {selectedAddOns.map((a) => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-white/60">+ {a.name}</span>
                      <span className="text-white font-medium">{formatCurrency(a.price)}</span>
                    </div>
                  ))}
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white font-semibold">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{state.date?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {state.timeSlot}</span>
                    <span className="text-white/50">{formatDuration((selectedService?.duration ?? 0) + selectedAddOns.reduce((s, a) => s + a.duration, 0))}</span>
                  </div>
                </div>
              </div>

              {/* Deposit option */}
              {depositAmount > 0 && (
                <div className="glass-card p-5 mb-5">
                  <p className="text-white font-semibold text-sm mb-3">Payment option</p>
                  <div className="space-y-2">
                    {[
                      { label: `Pay deposit now (${selectedService?.depositPercent}%)`, sublabel: `${formatCurrency(depositAmount)} today · ${formatCurrency(totalAmount - depositAmount)} at appointment`, value: true },
                      { label: 'Pay in full now', sublabel: formatCurrency(totalAmount), value: false },
                    ].map(({ label, sublabel, value }) => (
                      <button
                        key={String(value)}
                        onClick={() => setState((p) => ({ ...p, payDeposit: value }))}
                        className={cn(
                          'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all',
                          state.payDeposit === value ? 'bg-brand-500/10 border-brand-500/40' : 'bg-white/3 border-white/10 hover:border-white/15'
                        )}
                      >
                        <div className={cn('w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center', state.payDeposit === value ? 'border-brand-500 bg-brand-500' : 'border-white/20')}>
                          {state.payDeposit === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{label}</p>
                          <p className="text-white/40 text-xs">{sublabel}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mb-5">
                <label className="block text-white/60 text-sm font-medium mb-2">Notes for your stylist (optional)</label>
                <textarea
                  value={state.notes}
                  onChange={(e) => setState((p) => ({ ...p, notes: e.target.value }))}
                  className="input-field resize-none h-20 text-sm"
                  placeholder="Any allergies, preferences, or requests..."
                />
              </div>

              {/* Pay button */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold">Due now</span>
                  <span className="font-display font-black text-2xl gradient-text">{formatCurrency(dueNow)}</span>
                </div>

                {/* Mock card input */}
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                  <CreditCard size={16} className="text-white/40 flex-shrink-0" />
                  <span className="text-white/40 text-sm flex-1">•••• •••• •••• 4242 (Visa)</span>
                  <span className="text-brand-400 text-xs font-semibold cursor-pointer hover:underline">Change</span>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="btn-primary w-full justify-center !py-4 !text-base glow-teal"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      <Shield size={18} />
                      Book & Pay {formatCurrency(dueNow)} securely
                    </>
                  )}
                </button>
                <p className="text-center text-white/30 text-xs mt-3">
                  Secured by Stripe · 256-bit encrypted · PCI compliant
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => {
              const prev = steps[stepIndex - 1]
              if (prev) setState((p) => ({ ...p, step: prev.id }))
            }}
            disabled={stepIndex === 0}
            className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} /> Back
          </button>

          {state.step !== 'confirm' && (
            <button
              onClick={() => {
                const next = steps[stepIndex + 1]
                if (next && canProceed) setState((p) => ({ ...p, step: next.id }))
              }}
              disabled={!canProceed}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            >
              Continue <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function BookingSuccess({ service, date, time, amount }: { service: string; date: Date | null; time: string; amount: number }) {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card p-10 max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-brand-500/20 border-2 border-brand-500/40 flex items-center justify-center mx-auto mb-6 glow-teal"
        >
          <Check size={28} className="text-brand-400" />
        </motion.div>
        <h2 className="font-display font-black text-3xl text-white mb-2">You&apos;re booked!</h2>
        <p className="text-white/50 mb-6">Your appointment is confirmed. A confirmation has been sent to your email.</p>
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex justify-between py-2 border-b border-white/[0.06]">
            <span className="text-white/50">Service</span>
            <span className="text-white font-medium">{service}</span>
          </div>
          {date && (
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/50">Date & Time</span>
              <span className="text-white font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {time}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-white/50">Paid today</span>
            <span className="text-brand-400 font-bold">{formatCurrency(amount)}</span>
          </div>
        </div>
        <a href="/" className="btn-primary w-full justify-center">Back to home</a>
      </motion.div>
    </div>
  )
}
