'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Star, Shield, Zap } from 'lucide-react'

const floatingBadges = [
  { icon: Shield, text: 'PCI Compliant', color: 'text-brand-400', bg: 'bg-brand-500/10', delay: 0.2 },
  { icon: Zap, text: 'Instant Payouts', color: 'text-coral-400', bg: 'bg-coral-500/10', delay: 0.4 },
  { icon: Star, text: '4.9 / 5 Rating', color: 'text-yellow-400', bg: 'bg-yellow-500/10', delay: 0.6 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-coral-500/8 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="page-container relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Replacing Styleseat, Vagaro & Square Appointments
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-7xl text-white leading-[1.08] tracking-tight mb-6"
          >
            The booking OS for
            <br />
            <span className="gradient-text">beauty professionals</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Secure appointments, encrypted payments, deposits, client profiles, and powerful analytics —
            in one beautiful platform built for independent pros and teams.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/register" className="btn-primary text-base !px-8 !py-3.5 glow-teal">
              Start free — no card required
              <ArrowRight size={18} />
            </Link>
            <button className="btn-secondary text-base !px-8 !py-3.5 group">
              <Play size={16} className="text-brand-400 group-hover:scale-110 transition-transform" />
              Watch demo
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-surface-900 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/10"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>Trusted by <strong className="text-white/70">12,000+</strong> beauty professionals</span>
            <span className="hidden sm:block text-white/20">|</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9 on the App Store</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="relative mt-16 max-w-5xl mx-auto"
        >
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/[0.06]">
            {/* Mock Dashboard UI */}
            <DashboardMockup />
          </div>

          {/* Floating Badges */}
          {floatingBadges.map(({ icon: Icon, text, color, bg, delay }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: delay + 0.8 }}
              className={`absolute hidden md:flex items-center gap-2 px-3 py-2 rounded-xl ${bg} border border-white/10 backdrop-blur-xl animate-float`}
              style={{
                top: delay === 0.2 ? '-20px' : delay === 0.4 ? '40%' : undefined,
                bottom: delay === 0.6 ? '10%' : undefined,
                left: delay === 0.4 ? '-80px' : undefined,
                right: delay === 0.2 ? '5%' : delay === 0.6 ? '-60px' : undefined,
              }}
            >
              <Icon size={14} className={color} />
              <span className={`text-xs font-semibold ${color}`}>{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="bg-surface-800 p-4 md:p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-brand-400" />
          </div>
          <div>
            <div className="h-3 w-24 bg-white/20 rounded-full mb-1.5" />
            <div className="h-2 w-16 bg-white/10 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-brand-500/20 border border-brand-500/30 rounded-lg" />
          <div className="h-8 w-8 bg-white/5 border border-white/10 rounded-lg" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Revenue', value: '$8,240', change: '+18%', color: 'text-brand-400' },
          { label: 'Bookings', value: '147', change: '+12%', color: 'text-blue-400' },
          { label: 'Avg Ticket', value: '$56', change: '+5%', color: 'text-purple-400' },
          { label: 'No-shows', value: '2.1%', change: '-40%', color: 'text-green-400' },
        ].map(({ label, value, change, color }) => (
          <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 md:p-4">
            <div className="h-2 w-12 bg-white/15 rounded-full mb-3" />
            <div className={`font-display font-bold text-xl md:text-2xl ${color} mb-1`}>{value}</div>
            <div className="text-xs text-green-400 font-medium">{change}</div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mb-4">
        <div className="flex items-end gap-1.5 h-24">
          {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-brand-500/30 hover:bg-brand-500/50 transition-all"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-2">
        {[
          { name: 'Aria Johnson', service: 'Balayage', time: '10:00 AM', status: 'confirmed' },
          { name: 'Marcus Lee', service: 'Men\'s Cut', time: '11:30 AM', status: 'confirmed' },
          { name: 'Sofia Reyes', service: 'Keratin Treatment', time: '1:00 PM', status: 'pending' },
        ].map(({ name, service, time, status }) => (
          <div key={name} className="flex items-center justify-between px-3 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                {name[0]}
              </div>
              <div>
                <div className="text-white text-xs font-semibold">{name}</div>
                <div className="text-white/40 text-xs">{service}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-xs">{time}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === 'confirmed' ? 'bg-brand-500/15 text-brand-400' : 'bg-yellow-500/15 text-yellow-400'
              }`}>
                {status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
