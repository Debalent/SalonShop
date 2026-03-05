'use client'
import { motion } from 'framer-motion'
import {
  CalendarDays, CreditCard, BarChart3, Bell, Users, Shield,
  Zap, Star, Repeat, Globe, Smartphone, Lock
} from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: '3-Click Booking',
    description: 'Clients book in seconds. Real-time availability, Google Calendar sync, buffer times, and recurring appointments.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/8',
    border: 'border-brand-500/15',
  },
  {
    icon: CreditCard,
    title: 'Stripe-Powered Payments',
    description: 'Cards, Apple Pay, Google Pay, ACH. Deposits, full pre-pay, no-show protection. Instant payouts via Stripe Connect.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/8',
    border: 'border-purple-500/15',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'PCI-compliant. Tokenized cards. No card data on our servers. 2FA, rate limiting, SOC2-ready architecture.',
    color: 'text-green-400',
    bg: 'bg-green-500/8',
    border: 'border-green-500/15',
  },
  {
    icon: BarChart3,
    title: 'Financial Dashboard',
    description: 'Revenue charts, client retention, no-show rates, top services, peak times. Export-ready for tax season.',
    color: 'text-coral-400',
    bg: 'bg-coral-500/8',
    border: 'border-coral-500/15',
  },
  {
    icon: Bell,
    title: 'Smart Automation',
    description: 'Auto-confirmations, SMS + email reminders, rebooking nudges, late cancellation fee collection.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8',
    border: 'border-yellow-500/15',
  },
  {
    icon: Users,
    title: 'Shop & Team Management',
    description: 'Multi-provider shops with shared calendars, role permissions, revenue split by provider, and commission tracking.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/8',
    border: 'border-blue-500/15',
  },
  {
    icon: Star,
    title: 'Reviews & Trust',
    description: 'Verified reviews, provider badges, before/after portfolio gallery, and moderation tools to keep quality high.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/8',
    border: 'border-orange-500/15',
  },
  {
    icon: Repeat,
    title: 'Loyalty & Growth',
    description: 'Loyalty points, membership packages, referral codes, promo codes, gift cards, and subscription clients.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/8',
    border: 'border-pink-500/15',
  },
  {
    icon: Globe,
    title: 'Custom Booking Links',
    description: 'QR-scannable booking page per provider. Custom domain for Business tier. White-label ready.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/8',
    border: 'border-teal-500/15',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First UX',
    description: 'Native-app quality web experience. Touch-optimized. Lightning-fast. Feels as good as the app it will become.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/8',
    border: 'border-indigo-500/15',
  },
  {
    icon: Zap,
    title: 'Instant Notifications',
    description: 'Real-time push, SMS, and email for bookings, payments, reviews, and payouts — for both clients and providers.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/15',
  },
  {
    icon: Lock,
    title: 'Client Profiles',
    description: 'Saved payment methods (tokenized), preferences, service history, notes, allergies, and favorite providers.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/8',
    border: 'border-rose-500/15',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-6">
            Everything you need
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">
            Built for the way you{' '}
            <span className="gradient-text">actually work</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Every feature designed for beauty pros — not generic businesses.
            From solo stylists to multi-chair shops.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {features.map(({ icon: Icon, title, description, color, bg, border }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className={`group p-5 rounded-2xl ${bg} border ${border} hover:border-opacity-40 transition-all duration-300 hover:shadow-card hover:-translate-y-0.5`}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
