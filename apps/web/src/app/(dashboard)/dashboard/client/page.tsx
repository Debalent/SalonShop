'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CalendarCheck, Heart, Star, CreditCard, Clock, RefreshCcw,
  Search, Sparkles, MapPin, TrendingUp, Gift, Users,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

const upcomingBookings = [
  { id: 'b1', worker: 'Alex Rivera', service: 'Balayage + Gloss', date: '2026-03-07', time: '10:00 AM', amount: 22000, status: 'CONFIRMED', avatar: 'AR', grad: 'from-brand-400 to-brand-600' },
  { id: 'b2', worker: 'Sofia Ramirez', service: 'Full Set Gel Nails', date: '2026-03-14', time: '2:00 PM', amount: 7500, status: 'CONFIRMED', avatar: 'SR', grad: 'from-rose-400 to-pink-600' },
]

const pastBookings = [
  { id: 'b3', worker: 'Alex Rivera', service: "Women's Cut & Style", date: '2026-02-10', amount: 8500, rating: 5 },
  { id: 'b4', worker: 'Jordan Okafor', service: "Men's Fade", date: '2026-01-28', amount: 4500, rating: 5 },
  { id: 'b5', worker: 'Destiny Williams', service: 'Silk Press', date: '2026-01-12', amount: 9000, rating: 4 },
]

const favorites = [
  { slug: 'alex-rivera',   name: 'Alex Rivera',   profession: 'Hair Stylist',   grad: 'from-brand-400 to-brand-600', initials: 'AR', rating: 4.97, nextSlot: 'Sat 11 AM' },
  { slug: 'sofiat-ramirez', name: 'Sofia Ramirez', profession: 'Nail Tech',       grad: 'from-rose-400 to-pink-600',  initials: 'SR', rating: 4.92, nextSlot: 'Fri 2 PM' },
  { slug: 'jordan-okafor', name: 'Jordan Okafor', profession: 'Master Barber',    grad: 'from-emerald-400 to-teal-600', initials: 'JO', rating: 4.99, nextSlot: 'Today 5 PM' },
]

const LOYALTY_POINTS   = 2340
const LOYALTY_TIER     = 'Silver'
const NEXT_TIER_AT     = 3000
const TIER_COLOR       = 'text-slate-400'

export default function ClientDashboard() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">My Dashboard</h1>
          <p className="text-white/45 text-sm mt-0.5">Welcome back, Alex</p>
        </div>
        <Link href="/discover" className="btn-primary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Search size={14} /> Book a service
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total bookings',  value: '18',                             sub: 'Lifetime',       icon: CalendarCheck, col: 'text-brand-400',  bg: 'bg-brand-500/10' },
          { label: 'Total spent',     value: formatCurrency(184500),           sub: 'All time',       icon: CreditCard,    col: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Saved styists',   value: favorites.length,                 sub: 'Favorites',      icon: Heart,         col: 'text-rose-400',   bg: 'bg-rose-500/10' },
          { label: 'Loyalty points',  value: LOYALTY_POINTS.toLocaleString(),  sub: `${LOYALTY_TIER} tier`, icon: Gift, col: 'text-amber-400',  bg: 'bg-amber-500/10' },
        ].map(({ label, value, sub, icon: Icon, col, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={15} className={col} />
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-0.5">{value}</p>
            <p className={`text-xs ${col}`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Loyalty card */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-amber-400" />
            <span className="text-white font-semibold">SalonShop Rewards</span>
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20', TIER_COLOR)}>{LOYALTY_TIER}</span>
          </div>
          <span className="text-white/35 text-xs">{LOYALTY_POINTS} pts</span>
        </div>
        <div className="mb-2 flex justify-between text-xs text-white/40">
          <span>Progress to Gold</span>
          <span>{NEXT_TIER_AT - LOYALTY_POINTS} pts away</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(LOYALTY_POINTS / NEXT_TIER_AT) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
          />
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-white/35">
          <span className="flex items-center gap-1"><Sparkles size={10} className="text-amber-400" /> 1 pt per $1 spent</span>
          <span className="flex items-center gap-1"><Gift size={10} className="text-amber-400" /> Redeem at checkout</span>
        </div>
      </div>

      {/* Upcoming / Past tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/65')}>
            {t === 'upcoming' ? 'Upcoming' : 'Past bookings'}
          </button>
        ))}
      </div>

      {/* Bookings */}
      {tab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <CalendarCheck size={32} className="mx-auto mb-3 text-white/15" />
              <p>No upcoming appointments</p>
              <Link href="/discover" className="btn-primary mt-4 inline-flex !py-2 !px-5 !text-sm">Book now</Link>
            </div>
          ) : upcomingBookings.map(b => (
            <div key={b.id} className="card flex items-center gap-4">
              <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-br', b.grad)}>{b.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{b.worker}</p>
                <p className="text-white/40 text-sm">{b.service}</p>
                <div className="flex items-center gap-3 mt-1 text-white/30 text-xs">
                  <span className="flex items-center gap-1"><Clock size={10} />{formatDate(b.date)} · {b.time}</span>
                  <span className="flex items-center gap-1"><CreditCard size={10} />{formatCurrency(b.amount)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 font-bold">Confirmed</span>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'past' && (
        <div className="space-y-3">
          {pastBookings.map(b => (
            <div key={b.id} className="card flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{b.worker}</p>
                <p className="text-white/40 text-sm">{b.service} · {formatDate(b.date)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={11} className={cn(s <= b.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10')} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-white font-semibold">{formatCurrency(b.amount)}</span>
                <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                  <RefreshCcw size={11} /> Rebook
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favorites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart size={15} className="text-rose-400" />
            <h2 className="font-display font-semibold text-white">Saved professionals</h2>
          </div>
          <Link href="/discover" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">Browse more</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {favorites.map(f => (
            <div key={f.slug} className="card flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br', f.grad)}>{f.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{f.name}</p>
                <p className="text-white/40 text-xs">{f.profession}</p>
                <p className={cn('text-xs mt-0.5', f.nextSlot.startsWith('Today') ? 'text-green-400' : 'text-white/35')}>{f.nextSlot}</p>
              </div>
              <Link href={`/book/${f.slug}`} className="flex-shrink-0 text-brand-400 hover:text-brand-300">
                <CalendarCheck size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
