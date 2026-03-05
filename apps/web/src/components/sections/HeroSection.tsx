'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Star, Shield, Zap, CheckCircle2 } from 'lucide-react'
import { DemoModal } from '@/components/ui/DemoModal'

const trustBadges = [
  { icon: Shield, text: 'PCI Compliant', sub: 'Bank-grade security' },
  { icon: Zap, text: 'Instant Payouts', sub: 'via Stripe Connect' },
  { icon: Star, text: '4.9 / 5 Stars', sub: '3,200+ reviews' },
]

const avatarLetters = ['A', 'B', 'C', 'D', 'E']

export function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-900 pt-16">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-600/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-500/6 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.025] bg-dot-grid" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="page-container relative z-10 py-24 md:py-32 xl:py-36">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 xl:gap-20 items-center">

          {/* Left */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/12 border border-brand-500/25 text-brand-300 text-sm font-semibold mb-7"
            >
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Replacing Styleseat, Vagaro &amp; Square — for free
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="font-display font-extrabold text-5xl sm:text-6xl xl:text-7xl text-white leading-[1.06] tracking-tight mb-6"
            >
              The booking OS
              <br />
              <span className="gradient-text">for beauty pros</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/55 text-lg xl:text-xl leading-relaxed max-w-md mx-auto lg:mx-0 mb-10"
            >
              Appointments, encrypted payments, deposits, client profiles, and
              powerful analytics — in one platform built for independent pros and teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-glow-teal hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Start free — no card required
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/12 hover:border-white/20 text-white font-semibold text-base rounded-xl transition-all duration-200 w-full sm:w-auto"
              >
                <span className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Play size={13} className="text-brand-400 translate-x-0.5" fill="currentColor" />
                </span>
                Watch 2-min demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-white/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {avatarLetters.map((letter, i) => {
                    const zClasses = ['z-50', 'z-40', 'z-30', 'z-20', 'z-10']
                    const bgClasses = ['bg-brand-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-emerald-400']
                    return (
                      <div
                        key={letter}
                        className={`w-8 h-8 rounded-full border-2 border-surface-900 flex items-center justify-center text-white text-xs font-bold ${zClasses[i]} ${bgClasses[i]}`}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
                <span>Trusted by <strong className="text-white/75 font-semibold">12,000+</strong> pros</span>
              </div>
              <span className="hidden sm:block text-white/20">·</span>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-0.5">4.9 App Store</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-8 bg-brand-600/15 rounded-3xl blur-3xl pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-surface-800">
              <DashboardMockup />
            </div>

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 1.0 }}
              className="absolute -top-4 -right-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-800/90 border border-white/10 backdrop-blur-xl shadow-lg animate-float"
            >
              <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={14} className="text-green-400" />
              </div>
              <div>
                <div className="text-white text-xs font-semibold">Booking confirmed</div>
                <div className="text-white/40 text-[10px]">$65 deposit collected</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 1.15 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-800/90 border border-white/10 backdrop-blur-xl shadow-lg"
              style={{ animation: 'float 3s ease-in-out 1.2s infinite' }}
            >
              <div className="w-7 h-7 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-brand-400" />
              </div>
              <div>
                <div className="text-white text-xs font-semibold">Payout sent</div>
                <div className="text-white/40 text-[10px]">$1,240 to your bank</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0"
        >
          {trustBadges.map(({ icon: Icon, text, sub }) => (
            <div
              key={text}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500/12 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-brand-400" />
              </div>
              <div>
                <div className="text-white text-xs font-semibold">{text}</div>
                <div className="text-white/35 text-[10px]">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  const bars = [45, 72, 55, 88, 62, 95, 74, 90, 68, 100, 78, 85]
  const appointments = [
    { name: 'Aaliyah M.', service: 'Full Color + Cut', time: '9:00 AM', amount: '$120', dot: 'bg-brand-500' },
    { name: 'Brianna T.', service: 'Silk Press',       time: '11:30 AM', amount: '$80',  dot: 'bg-purple-500' },
    { name: 'Carlos V.',  service: 'Fade + Design',    time: '2:00 PM',  amount: '$55',  dot: 'bg-emerald-500' },
  ]

  return (
    <div className="bg-surface-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-20 bg-white/25 rounded-full mb-1.5" />
          <div className="h-2 w-14 bg-white/12 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-20 bg-brand-500/25 border border-brand-500/30 rounded-lg" />
          <div className="h-7 w-7 bg-white/5 border border-white/10 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: 'Revenue',   value: '$8,240', change: '+18%', color: 'text-brand-300' },
          { label: 'Bookings',  value: '147',    change: '+12%', color: 'text-blue-300' },
          { label: 'Avg Ticket',value: '$56',    change: '+5%',  color: 'text-purple-300' },
          { label: 'No-shows',  value: '2.1%',   change: '-40%', color: 'text-green-300' },
        ].map(({ label, value, change, color }) => (
          <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3">
            <div className="h-2 w-10 bg-white/15 rounded-full mb-2.5" />
            <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
            <div className="text-green-400 text-[10px] font-semibold mt-0.5">{change}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-2 w-16 bg-white/15 rounded-full" />
          <div className="h-2 w-10 bg-white/8 rounded-full" />
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-brand-500/40"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="h-2 w-24 bg-white/12 rounded-full mb-3" />
        <div className="space-y-2">
          {appointments.map(({ name, service, time, amount, dot }) => (
            <div key={name} className="flex items-center justify-between px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-6 rounded-full ${dot} flex-shrink-0`} />
                <div>
                  <div className="text-white text-xs font-semibold">{name}</div>
                  <div className="text-white/35 text-[10px]">{service}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/55 text-[10px]">{time}</div>
                <div className="text-brand-300 text-xs font-bold">{amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
