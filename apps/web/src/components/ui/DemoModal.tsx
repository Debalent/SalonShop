'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronRight, ChevronLeft, Calendar, CreditCard,
  BarChart3, Bell, CheckCircle2, Clock, Star, Zap, Shield,
  ArrowRight, Smartphone, Heart,
} from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrency, providerPayoutAmount } from '@/lib/utils'
import { TipSelector } from '@/components/ui/TipSelector'

/* ─── Step definitions ───────────────────────────────────────────────── */
const steps = [
  { id: 'booking',    label: 'Smart Booking',  icon: Calendar   },
  { id: 'payment',   label: 'Secure Payment', icon: CreditCard  },
  { id: 'tipping',   label: 'Tip Stylist',    icon: Heart       },
  { id: 'dashboard', label: 'Dashboard',      icon: BarChart3   },
  { id: 'automated', label: 'Automation',     icon: Bell        },
]

/* ─── Screen: Booking flow ───────────────────────────────────────────── */
function BookingScreen() {
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const slots = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM']

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
          <Calendar size={16} className="text-brand-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Book an Appointment</h3>
          <p className="text-white/40 text-xs">Destiny Williams · Full Color &amp; Cut · $120</p>
        </div>
      </div>

      {/* Service badge */}
      <div className="flex flex-wrap gap-2">
        {['Full Color + Cut', 'Silk Press', 'Braids', 'Highlights'].map((s, i) => (
          <span
            key={s}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer',
              i === 0
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                : 'bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white/70'
            )}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Calendar row */}
      <div>
        <p className="text-white/40 text-xs mb-2.5 font-medium">Select a date</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { day: 'Mon', date: '3', active: false },
            { day: 'Tue', date: '4', active: false },
            { day: 'Wed', date: '5', active: true  },
            { day: 'Thu', date: '6', active: false },
            { day: 'Fri', date: '7', active: false },
          ].map(({ day, date, active }) => (
            <div
              key={date}
              className={cn(
                'flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer',
                active
                  ? 'bg-brand-500/20 border-brand-500/35 text-brand-300'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/60'
              )}
            >
              <span>{day}</span>
              <span className={cn('text-base font-bold mt-0.5', active ? 'text-white' : '')}>{date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <p className="text-white/40 text-xs mb-2.5 font-medium">Available times — Wednesday, Mar 5</p>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => { setSelected(slot); setConfirmed(false) }}
              className={cn(
                'py-2 rounded-lg border text-xs font-semibold transition-all',
                selected === slot
                  ? 'bg-brand-500/25 border-brand-500/45 text-brand-200'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/50 hover:text-white/80 hover:border-white/15'
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <AnimatePresence>
        {selected && !confirmed && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            onClick={() => setConfirmed(true)}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Confirm {selected} — pay $40 deposit
            <ArrowRight size={14} />
          </motion.button>
        )}
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={15} />
            Booked! Confirmation sent via SMS &amp; email
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 text-white/25 text-xs">
        <Shield size={11} />
        PCI-encrypted · No card stored on our servers
      </div>
    </div>
  )
}

/* ─── Screen: Payment ────────────────────────────────────────────────── */
function PaymentScreen() {
  const [paid, setPaid] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
          <CreditCard size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Secure Checkout</h3>
          <p className="text-white/40 text-xs">Powered by Stripe · End-to-end encrypted</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Full Color + Cut</span>
          <span className="text-white font-medium">$120.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Deposit (required to hold)</span>
          <span className="text-brand-300 font-semibold">$40.00</span>
        </div>
        <div className="h-px bg-white/[0.06]" />
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Due at appointment</span>
          <span className="text-white font-semibold">$80.00</span>
        </div>
      </div>

      {/* Payment method */}
      <div>
        <p className="text-white/40 text-xs mb-2.5 font-medium">Pay deposit with</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: '💳  Card', active: true  },
            { label: '  Apple Pay', active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={cn(
                'py-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all',
                active
                  ? 'bg-brand-500/20 border-brand-500/35 text-brand-300'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/45 hover:text-white/70'
              )}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Card mockup */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 space-y-2.5">
          <div className="h-8 bg-white/[0.05] rounded-lg flex items-center px-3 text-white/25 text-xs">
            •••• •••• •••• 4242
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-white/[0.05] rounded-lg flex items-center px-3 text-white/25 text-xs">12/28</div>
            <div className="h-8 bg-white/[0.05] rounded-lg flex items-center px-3 text-white/25 text-xs">•••</div>
          </div>
        </div>
      </div>

      {/* No-show protection callout */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
        <Shield size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-amber-200/70 text-xs leading-relaxed">
          No-show protection enabled. Your deposit is non-refundable within 24 hours of the appointment.
        </p>
      </div>

      <AnimatePresence>
        {!paid ? (
          <motion.button
            key="pay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPaid(true)}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} />
            Pay $40 deposit now
          </motion.button>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <div className="w-full py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={15} />
              Payment successful — see you Wednesday!
            </div>
            <p className="text-center text-white/30 text-xs">Receipt + calendar invite sent to your phone</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Screen: Tipping ───────────────────────────────────────────────── */
const SERVICE_TOTAL_CENTS = 12000   // $120 Full Color + Cut

function TipScreen() {
  const [tipCents, setTipCents] = useState(1800)  // default 15%
  const [confirmed, setConfirmed] = useState(false)
  const stylistNet = providerPayoutAmount(SERVICE_TOTAL_CENTS, tipCents)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
          <Heart size={16} className="text-rose-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Tip Your Stylist</h3>
          <p className="text-white/40 text-xs">100% goes directly to Destiny — no platform cut</p>
        </div>
      </div>

      {/* Appointment recap */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <div>
          <p className="text-white text-sm font-semibold">Full Color + Cut</p>
          <p className="text-white/35 text-xs">with Destiny Williams · Wed Mar 5</p>
        </div>
        <span className="text-white font-bold">{formatCurrency(SERVICE_TOTAL_CENTS)}</span>
      </div>

      {/* Interactive tip selector */}
      <TipSelector
        serviceTotal={SERVICE_TOTAL_CENTS}
        onTipChange={cents => { setTipCents(cents); setConfirmed(false) }}
      />

      {/* Stylist take-home transparency */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tipCents}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-500/8 border border-green-500/15"
        >
          <div className="flex items-center gap-2">
            <Heart size={13} className="text-green-400" />
            <div>
              <p className="text-green-300 text-xs font-semibold">Destiny receives</p>
              <p className="text-white/35 text-[10px]">Service minus 2% fee{tipCents > 0 ? ` + ${formatCurrency(tipCents)} tip` : ''}</p>
            </div>
          </div>
          <span className="font-display font-black text-xl text-white">{formatCurrency(stylistNet)}</span>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {!confirmed ? (
          <motion.button
            key="pay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmed(true)}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} />
            {tipCents > 0
              ? `Pay balance + ${formatCurrency(tipCents)} tip — ${formatCurrency(8000 + tipCents)}`
              : 'Pay $80.00 balance (no tip)'}
          </motion.button>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <div className="w-full py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={15} />
              {tipCents > 0 ? `Tip sent! Destiny gets ${formatCurrency(stylistNet)} total 💚` : 'Payment complete!'}
            </div>
            {tipCents > 0 && (
              <p className="text-center text-white/30 text-xs">
                Your {formatCurrency(tipCents)} tip was added to Destiny's next payout
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Screen: Dashboard ──────────────────────────────────────────────── */
function DashboardScreen() {
  const kpis = [
    { label: 'This Month',  value: '$8,240', delta: '+18%', color: 'text-brand-300',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20' },
    { label: 'Bookings',    value: '147',    delta: '+12%', color: 'text-blue-300',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
    { label: 'Avg Ticket',  value: '$56',    delta: '+5%',  color: 'text-purple-300',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
    { label: 'No-shows',    value: '2.1%',   delta: '-40%', color: 'text-green-300',   bg: 'bg-green-500/10',   border: 'border-green-500/20' },
  ]
  const upcoming = [
    { name: 'Aaliyah M.',  service: 'Full Color + Cut',  time: '9:00 AM',  amount: '$120', dot: 'bg-brand-500' },
    { name: 'Brianna T.',  service: 'Silk Press',         time: '11:30 AM', amount: '$80',  dot: 'bg-purple-500' },
    { name: 'Carlos V.',   service: 'Fade + Design',      time: '2:00 PM',  amount: '$55',  dot: 'bg-emerald-500' },
  ]
  const bars = [40, 58, 45, 72, 50, 88, 65, 95, 70, 100, 75, 88]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div>
          <h3 className="text-white font-semibold text-sm">Your Dashboard</h3>
          <p className="text-white/40 text-xs">Wednesday, March 5 · 3 appointments today</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map(({ label, value, delta, color, bg, border }) => (
          <div key={label} className={`p-3 rounded-xl ${bg} border ${border}`}>
            <p className="text-white/40 text-[10px] mb-1.5">{label}</p>
            <p className={`font-display font-bold text-xl ${color}`}>{value}</p>
            <p className="text-green-400 text-[10px] font-semibold mt-0.5">{delta} vs last month</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/40 text-xs">Monthly Revenue</span>
          <span className="text-brand-300 text-xs font-semibold">$8,240</span>
        </div>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{ height: `${h}%`, background: `rgba(26,80,224,${0.18 + (h / 100) * 0.6})` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map(m => (
            <span key={m} className="text-white/20 text-[9px]">{m}</span>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <p className="text-white/40 text-xs mb-2 font-medium">Today's Appointments</p>
        <div className="space-y-1.5">
          {upcoming.map(({ name, service, time, amount, dot }) => (
            <div key={name} className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className={`w-1 h-6 rounded-full ${dot} flex-shrink-0`} />
                <div>
                  <p className="text-white text-xs font-semibold">{name}</p>
                  <p className="text-white/30 text-[10px]">{service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px]">{time}</p>
                <p className="text-brand-300 text-xs font-bold">{amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Screen: Automation ─────────────────────────────────────────────── */
function AutomationScreen() {
  const [triggered, setTriggered] = useState(false)
  const notifications = [
    { icon: '📅', title: 'Booking confirmed',          body: 'Your 9:00 AM with Destiny is confirmed for Wed Mar 5.', time: 'Just now',    color: 'bg-brand-500/10 border-brand-500/20' },
    { icon: '💳', title: 'Deposit collected',           body: '$40 deposit received. Balance due: $80 at appointment.',  time: '1 min ago',  color: 'bg-purple-500/10 border-purple-500/20' },
    { icon: '⏰', title: '24-hour reminder',            body: 'Reminder: You have an appointment tomorrow at 9:00 AM.',  time: '1 day ago',  color: 'bg-amber-500/10 border-amber-500/20' },
    { icon: '⭐', title: 'Leave a review',              body: 'How was your visit with Destiny? Share your experience.', time: '2 hrs after', color: 'bg-yellow-500/10 border-yellow-500/20' },
    { icon: '🔄', title: 'Time to rebook!',             body: "It's been 6 weeks. Ready to book your next appointment?",  time: '6 wks later', color: 'bg-emerald-500/10 border-emerald-500/20' },
  ]

  const rules = [
    { label: 'Booking confirmation',    status: 'active',   trigger: 'On booking',   channels: ['SMS', 'Email'] },
    { label: 'Deposit receipt',         status: 'active',   trigger: 'On payment',   channels: ['Email'] },
    { label: '24h appointment reminder',status: 'active',   trigger: '24h before',   channels: ['SMS', 'Push'] },
    { label: 'Post-visit review nudge', status: 'active',   trigger: '2h after',     channels: ['SMS'] },
    { label: 'Rebooking reminder',      status: triggered ? 'active' : 'paused', trigger: '6 weeks', channels: ['Push', 'Email'] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
          <Bell size={16} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Smart Automations</h3>
          <p className="text-white/40 text-xs">Save 2+ hours daily on manual follow-ups</p>
        </div>
      </div>

      {/* Automation rules */}
      <div className="space-y-2">
        {rules.map(({ label, status, trigger, channels }) => (
          <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                status === 'active' ? 'bg-green-400' : 'bg-white/20'
              )} />
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{label}</p>
                <p className="text-white/30 text-[10px]">{trigger} · {channels.join(', ')}</p>
              </div>
            </div>
            {label.includes('Rebooking') && (
              <button
                onClick={() => setTriggered(true)}
                className={cn(
                  'ml-2 px-2 py-1 rounded-md text-[10px] font-bold transition-all flex-shrink-0',
                  triggered
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/[0.06] text-white/40 border border-white/10 hover:text-white/70'
                )}
              >
                {triggered ? 'Active ✓' : 'Enable'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Notification preview */}
      <div>
        <p className="text-white/40 text-xs mb-2 font-medium flex items-center gap-1.5">
          <Smartphone size={11} />
          Client notification timeline
        </p>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {notifications.map(({ icon, title, body, time, color }) => (
            <div key={title} className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${color}`}>
              <span className="text-base leading-none mt-0.5 flex-shrink-0">{icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white text-xs font-semibold truncate">{title}</p>
                  <span className="text-white/25 text-[9px] flex-shrink-0">{time}</span>
                </div>
                <p className="text-white/45 text-[10px] leading-relaxed mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main Modal ─────────────────────────────────────────────────────── */
const screens = [BookingScreen, PaymentScreen, TipScreen, DashboardScreen, AutomationScreen]

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  const [step, setStep] = useState(0)

  // Reset to step 0 whenever modal is opened
  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const Screen = screens[step]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg bg-surface-900 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: '92vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0">
                <div>
                  <h2 className="text-white font-display font-bold text-base">
                    SalonShop <span className="text-brand-400">Product Tour</span>
                  </h2>
                  <p className="text-white/35 text-xs mt-0.5">
                    Step {step + 1} of {steps.length} — {steps[step].label}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Step tabs */}
              <div className="flex gap-1 px-5 pt-4 pb-0 flex-shrink-0">
                {steps.map(({ id, label, icon: Icon }, i) => (
                  <button
                    key={id}
                    onClick={() => setStep(i)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-[10px] font-semibold transition-all',
                      i === step
                        ? 'bg-brand-500/15 border-brand-500/25 text-brand-300'
                        : i < step
                        ? 'bg-green-500/8 border-green-500/20 text-green-500/70'
                        : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/55'
                    )}
                  >
                    <Icon size={14} />
                    <span className="hidden sm:block leading-tight text-center">{label}</span>
                    {i < step && <CheckCircle2 size={10} className="text-green-400" />}
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mx-5 mt-3 h-0.5 bg-white/[0.06] rounded-full overflow-hidden flex-shrink-0">
                <motion.div
                  className="h-full bg-brand-500 rounded-full"
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>

              {/* Screen content */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Screen />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer nav */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.07] flex-shrink-0">
                <button
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-white/5"
                >
                  <ChevronLeft size={15} />
                  Back
                </button>

                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-all',
                        i === step ? 'bg-brand-400 w-4' : 'bg-white/20'
                      )}
                    />
                  ))}
                </div>

                {step < steps.length - 1 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all"
                  >
                    Start free
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
