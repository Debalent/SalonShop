'use client'
import { motion } from 'framer-motion'
import {
  CalendarDays, CreditCard, BarChart3, Bell, Users, Shield,
  Zap, Star, Repeat, Globe, Smartphone, Lock, CheckCircle2,
} from 'lucide-react'

const spotlights = [
  {
    icon: CalendarDays,
    tag: 'Booking',
    title: '3-Click Booking That Converts',
    desc: 'Real-time availability, instant confirmation, Google Calendar sync, buffer times, and recurring appointments. Clients book in under 30 seconds.',
    points: ['Real-time slot availability', 'Google & Apple Calendar sync', 'Buffer times + recurring', 'Custom cancellation policy'],
    accent: 'brand',
    side: 'right',
  },
  {
    icon: CreditCard,
    tag: 'Payments',
    title: 'Payments That Protect Your Time',
    desc: 'Stripe-powered end-to-end. Deposits, full pre-pay, or pay-on-arrival. Cards, Apple Pay, Google Pay, ACH. Auto-charge no-shows. Instant payouts.',
    points: ['Deposit & full pre-pay', 'Apple Pay + Google Pay', 'Auto no-show charges', 'Instant Stripe payouts'],
    accent: 'purple',
    side: 'left',
  },
  {
    icon: BarChart3,
    tag: 'Analytics',
    title: 'Analytics That Drive Decisions',
    desc: 'Revenue trends, client retention, peak-time heatmaps, top services, no-show rates, per-provider performance. Export-ready for tax season.',
    points: ['Revenue & retention charts', 'Peak-time heatmaps', 'Per-provider performance', 'Tax-ready CSV exports'],
    accent: 'rose',
    side: 'right',
  },
]

const gridFeatures = [
  { icon: Shield,     title: 'Enterprise Security',   desc: 'PCI-compliant. Tokenized cards. No card data on servers. 2FA + rate limiting.',              accent: 'green' },
  { icon: Bell,       title: 'Smart Automation',      desc: 'Auto-confirmations, SMS + email reminders, rebooking nudges, late cancellation fees.',        accent: 'yellow' },
  { icon: Users,      title: 'Team Management',       desc: 'Multi-provider shops, shared calendars, role permissions, commission tracking.',              accent: 'blue' },
  { icon: Star,       title: 'Reviews & Trust',       desc: 'Verified reviews, provider badges, before/after gallery, moderation tools.',                  accent: 'orange' },
  { icon: Repeat,     title: 'Loyalty & Growth',      desc: 'Loyalty points, memberships, referral codes, promo codes, gift cards.',                       accent: 'pink' },
  { icon: Globe,      title: 'Custom Booking Links',  desc: 'QR-scannable booking page per provider. Custom domain for Business tier.',                    accent: 'teal' },
  { icon: Smartphone, title: 'Mobile-First UX',       desc: 'Native-app quality experience. Touch-optimized. Lightning-fast on any device.',               accent: 'indigo' },
  { icon: Zap,        title: 'Instant Notifications', desc: 'Real-time push, SMS, email for bookings, payments, and reviews.',                             accent: 'amber' },
  { icon: Lock,       title: 'Client Profiles',       desc: 'Saved payments (tokenized), preferences, service history, notes, allergies.',                 accent: 'rose' },
]

const accentMap: Record<string, { text: string; bg: string; border: string; pill: string }> = {
  brand:  { text: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20',   pill: 'bg-brand-500/10  border-brand-500/20  text-brand-300' },
  purple: { text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  pill: 'bg-purple-500/10 border-purple-500/20 text-purple-300' },
  rose:   { text: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    pill: 'bg-rose-500/10   border-rose-500/20   text-rose-300' },
  green:  { text: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20',   pill: '' },
  yellow: { text: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20',  pill: '' },
  blue:   { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    pill: '' },
  orange: { text: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  pill: '' },
  pink:   { text: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    pill: '' },
  teal:   { text: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    pill: '' },
  indigo: { text: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  pill: '' },
  amber:  { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   pill: '' },
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const item    = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export function FeaturesSection() {
  return (
    <section id="features" className="section-spacing bg-surface-900">
      <div className="page-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-6">
            Everything you need
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl text-white mb-5 tracking-tight">
            Built for the way you{' '}
            <span className="gradient-text">actually work</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Every feature designed for beauty pros — not generic businesses.
            From solo stylists to multi-chair shops.
          </p>
        </motion.div>

        {/* Spotlight rows */}
        <div className="space-y-20 md:space-y-28 mb-24">
          {spotlights.map(({ icon: Icon, tag, title, desc, points, accent, side }, i) => {
            const a = accentMap[accent]
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${side === 'left' ? 'md:[&>:first-child]:order-last' : ''}`}
              >
                {/* Text */}
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold mb-5 ${a.pill}`}>
                    <Icon size={13} />{tag}
                  </div>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-4 leading-snug">{title}</h3>
                  <p className="text-white/55 leading-relaxed mb-7">{desc}</p>
                  <ul className="space-y-3">
                    {points.map(pt => (
                      <li key={pt} className="flex items-center gap-3 text-sm text-white/70">
                        <CheckCircle2 size={16} className={a.text} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual block */}
                <div className="relative">
                  <div className={`absolute -inset-6 ${a.bg} rounded-3xl blur-3xl opacity-30 pointer-events-none`} />
                  <div className={`relative rounded-2xl ${a.bg} border ${a.border} p-6 space-y-4`}>
                    {/* Mini feature illustration — reuse dashboard pattern */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
                      <div className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center`}>
                        <Icon size={17} className={a.text} />
                      </div>
                      <div>
                        <div className="h-2.5 w-24 bg-white/20 rounded-full mb-1.5" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center justify-between px-3 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${a.text.replace('text-', 'bg-')}`} />
                          <div className="h-2 w-28 bg-white/15 rounded-full" />
                        </div>
                        <div className={`h-5 w-14 rounded-lg ${a.bg} border ${a.border}`} />
                      </div>
                    ))}
                    <div className={`px-4 py-2.5 rounded-xl ${a.bg} border ${a.border} text-center`}>
                      <span className={`${a.text} text-sm font-bold`}>✓ {tag} active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-white/30 text-sm font-medium px-4">And so much more</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {gridFeatures.map(({ icon: Icon, title, desc, accent }) => {
            const a = accentMap[accent]
            return (
              <motion.div
                key={title}
                variants={item}
                className={`group p-5 rounded-2xl border transition-all duration-300
                  hover:-translate-y-1 hover:shadow-card ${a.bg} ${a.border}`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-4 ${a.bg} ${a.border}`}>
                  <Icon size={17} className={a.text} />
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
