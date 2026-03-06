'use client'
import { motion } from 'framer-motion'
import {
  Calendar, CreditCard, BarChart3, Star, QrCode, Bell,
  Repeat, Shield, Zap, Users, Gift, Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: Calendar, color: 'text-brand-400', bg: 'bg-brand-500/10',
    title: 'Smart Scheduling',
    desc:  'Real-time availability, instant-book toggle, custom buffers, and automated SMS/email reminders. Clients self-book 24/7.',
    badge: 'Core',
  },
  {
    icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10',
    title: 'Stripe Connect Payments',
    desc:  'Deposit-based booking, tip-at-checkout, automatic platform fee split. Workers get paid directly — no manual transfers.',
    badge: 'Payments',
  },
  {
    icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10',
    title: 'Revenue Analytics',
    desc:  'Daily/weekly/monthly earnings charts, service breakdown, rebooking rate, no-show tracking, and client LTV.',
    badge: 'Analytics',
  },
  {
    icon: QrCode, color: 'text-amber-400', bg: 'bg-amber-500/10',
    title: 'QR Booking Link',
    desc:  'Every pro gets a shareable booking URL and auto-generated QR code. Print it, post it, text it. Done.',
    badge: 'Growth',
  },
  {
    icon: Star, color: 'text-rose-400', bg: 'bg-rose-500/10',
    title: 'Reviews & Reputation',
    desc:  'Post-appointment review flows, star ratings, "would book again" metric, public profile display, and response tools.',
    badge: 'Social',
  },
  {
    icon: Gift, color: 'text-teal-400', bg: 'bg-teal-500/10',
    title: 'Loyalty & Referrals',
    desc:  'Points per dollar spent, tier unlocks (Bronze→Platinum), referral credits, and birthday rewards — all automatic.',
    badge: 'Retention',
  },
  {
    icon: Bell, color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    title: 'Automated Reminders',
    desc:  'SMS + email sequences fire automatically: booking confirmation, 24h reminder, post-visit follow-up, rebook nudge.',
    badge: 'Automation',
  },
  {
    icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10',
    title: 'Team & Shop Management',
    desc:  'Multi-worker schedules, shop-level analytics, per-worker revenue splits, and role-based dashboard access.',
    badge: 'Teams',
  },
  {
    icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10',
    title: 'Instant Payouts',
    desc:  'Connect your bank once. Stripe handles all payouts automatically — daily, weekly, or on-demand. Zero manual work.',
    badge: 'Payments',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="section-spacing">
      <div className="page-container">
        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:0.5}}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/25 bg-brand-500/8 text-brand-300 text-sm font-bold mb-5">
            <Zap size={12}/> Built for 2026 pros
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-5">
            Everything you need.<br/>
            <span className="gradient-text">Nothing you don't.</span>
          </h2>
          <p className="text-white/45 text-xl max-w-2xl mx-auto leading-relaxed">
            Most pros juggle Booksy, Square, Venmo, Instagram DMs, and Google Sheets.
            We collapse all of that into one beautiful platform.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc, badge }, i) => (
            <motion.div key={title}
              initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:0.4,delay:i%3*0.07}}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.04] p-6 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                  <Icon size={18} className={color}/>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-white/35">{badge}</span>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-brand-200 transition-colors">{title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
