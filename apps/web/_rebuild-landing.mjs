/**
 * SalonShop — $100M Landing Page Rebuild Script
 * Overwrites all section + layout components with venture-grade UI
 */
import { writeFileSync } from 'fs'

const SECTIONS = 'C:/sw/apps/web/src/components/sections'
const LAYOUT   = 'C:/sw/apps/web/src/components/layout'

const w = (path, content) => { writeFileSync(path, content, 'utf8'); console.log(`  ✓ ${path.split('/src/')[1]}`) }

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
w(`${LAYOUT}/Navbar.tsx`, `'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'

const NAV_ITEMS = [
  { label: 'Features',   href: '#features'   },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing',    href: '#pricing'    },
  {
    label: 'Product',
    href: '#',
    children: [
      { label: 'Booking system',   href: '#features',       desc: 'Calendar, slots, reminders' },
      { label: 'Payments',         href: '#features',       desc: 'Stripe Connect marketplace' },
      { label: 'Analytics',        href: '/dashboard',      desc: 'Revenue & growth insights' },
      { label: 'Loyalty rewards',  href: '/dashboard/loyalty', desc: 'Points, tiers, referrals' },
    ],
  },
]

export function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-surface-950/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl' : 'bg-transparent'
    )}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={28} />
            <span className="font-display font-black text-xl text-white tracking-tight">
              Salon<span className="text-brand-400">Shop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              item.children ? (
                <div key={item.label} className="relative"
                  onMouseEnter={() => setDropdown(item.label)}
                  onMouseLeave={() => setDropdown(null)}>
                  <button className="flex items-center gap-1 px-3.5 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/[0.05]">
                    {item.label} <ChevronDown size={13} className={cn('transition-transform', dropdown === item.label && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{    opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-64 mt-1 rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-xl shadow-2xl overflow-hidden p-1.5"
                      >
                        {item.children.map(child => (
                          <Link key={child.label} href={child.href}
                            className="flex flex-col gap-0.5 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group">
                            <span className="text-white text-sm font-semibold group-hover:text-brand-300 transition-colors">{child.label}</span>
                            <span className="text-white/35 text-xs">{child.desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={item.label} href={item.href}
                  className="px-3.5 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/[0.05]">
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/dashboard" className="text-white/55 hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-white/[0.05] transition-all">
              Sign in
            </Link>
            <Link href="/onboarding"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all hover:shadow-glow-teal hover:-translate-y-0.5">
              <Sparkles size={13} /> Get started free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] text-white/70 hover:text-white transition-colors">
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] bg-surface-950/95 backdrop-blur-xl"
          >
            <div className="page-container py-4 space-y-1">
              {NAV_ITEMS.filter(i => !i.children).map(item => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-white/60 hover:text-white font-medium rounded-xl hover:bg-white/[0.05] transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-white/[0.06]">
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-secondary text-center">Sign in</Link>
                <Link href="/onboarding" onClick={() => setOpen(false)} className="btn-primary text-center">
                  Get started free <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/HeroSection.tsx`, `'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Play, Star, Shield, Zap, CheckCircle,
  Calendar, CreditCard, Sparkles, TrendingUp, Users,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

// ── Booking card preview ───────────────────────────────────────
const BOOKING_STEPS = [
  { label: 'Choose service', icon: Sparkles,   color: 'text-purple-400' },
  { label: 'Pick a time',    icon: Calendar,   color: 'text-brand-400'  },
  { label: 'Secure & pay',   icon: CreditCard, color: 'text-emerald-400'},
]
const DEMO_BOOKINGS = [
  { name: 'Jasmine R.', service: 'Balayage · 3h',       time: 'Today 10 AM',    amount: 22000, avatar: 'JR', grad: 'from-purple-400 to-fuchsia-600' },
  { name: 'Marcus T.',  service: "Men's Fade · 45m",    time: 'Today 2:30 PM',  amount: 4500,  avatar: 'MT', grad: 'from-emerald-400 to-teal-600'   },
  { name: 'Sofia M.',   service: 'Full Gel Set · 1.5h', time: 'Tomorrow 11 AM', amount: 7500,  avatar: 'SM', grad: 'from-rose-400 to-pink-600'      },
]

function BookingPreviewCard() {
  const [step, setStep] = useState(0)
  const [idx,  setIdx]  = useState(0)
  useEffect(() => {
    const t1 = setInterval(() => setStep(s => (s + 1) % 3), 2200)
    const t2 = setInterval(() => setIdx(i => (i + 1) % DEMO_BOOKINGS.length), 3600)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])
  const b = DEMO_BOOKINGS[idx]
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div className="absolute -inset-10 bg-brand-500/8 rounded-[3rem] blur-3xl pointer-events-none" />
      <div className="relative rounded-3xl border border-white/[0.09] bg-surface-900/80 backdrop-blur-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-white/25 text-[11px] font-mono">salonshop.app/book/destiny</span>
          <Shield size={12} className="text-brand-400" />
        </div>
        {/* Worker */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">DW</div>
          <div>
            <p className="text-white font-semibold text-sm">Destiny Williams</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {[1,2,3,4,5].map(s=><Star key={s} size={10} className="fill-amber-400 text-amber-400"/>)}
              <span className="text-white/30 text-xs">4.98 · 312 reviews</span>
            </div>
          </div>
          <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-green-500/12 border border-green-500/20 text-green-400 font-bold flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Available
          </span>
        </div>
        {/* Steps */}
        <div className="px-5 py-4 space-y-2">
          {BOOKING_STEPS.map(({ label, icon: Icon, color }, i) => {
            const active = i === step % 3; const done = i < step % 3
            return (
              <div key={label} className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-500',
                active ? 'bg-brand-500/10 border-brand-500/20' : done ? 'bg-green-500/6 border-green-500/15 opacity-60' : 'bg-white/[0.02] border-white/[0.05] opacity-35'
              )}>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', done ? 'bg-green-500/12' : active ? 'bg-brand-500/12' : 'bg-white/5')}>
                  {done ? <CheckCircle size={14} className="text-green-400"/> : <Icon size={14} className={active ? color : 'text-white/20'}/>}
                </div>
                <p className={cn('text-sm font-semibold flex-1', active ? 'text-white' : 'text-white/30')}>{label}</p>
                {active && <Zap size={12} className="text-brand-400"/>}
              </div>
            )
          })}
        </div>
        {/* Live booking feed */}
        <div className="mx-5 mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div key={idx} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-20,opacity:0}} transition={{duration:0.3}}
              className="flex items-center gap-3 px-4 py-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-gradient-to-br', b.grad)}>{b.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{b.name}</p>
                <p className="text-white/35 text-xs truncate">{b.service} · {b.time}</p>
              </div>
              <p className="text-emerald-400 font-bold text-sm flex-shrink-0">{formatCurrency(b.amount)}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Floating badges */}
      <motion.div animate={{y:[0,-6,0]}} transition={{duration:3,repeat:Infinity}}
        className="absolute -top-4 -right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/12 border border-emerald-500/20 backdrop-blur shadow-lg text-xs font-bold text-emerald-300">
        <TrendingUp size={12}/> +$840 this week
      </motion.div>
      <motion.div animate={{y:[0,6,0]}} transition={{duration:3.5,repeat:Infinity,delay:0.5}}
        className="absolute -bottom-4 -left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/12 border border-purple-500/20 backdrop-blur shadow-lg text-xs font-bold text-purple-300">
        <Users size={12}/> 847 bookings today
      </motion.div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      {/* BG */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-950 to-surface-900"/>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/[0.06] rounded-full blur-3xl"/>
        <div className="absolute top-48 right-10 w-80 h-80 bg-purple-500/[0.04] rounded-full blur-3xl"/>
        <div className="absolute inset-0 opacity-[0.012]" style={{backgroundImage:'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',backgroundSize:'72px 72px'}}/>
      </div>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Copy */}
          <motion.div className="flex-1 text-center lg:text-left" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.55}}>
            <motion.div initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} transition={{delay:0.1}}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/8 text-brand-300 text-sm font-bold mb-7">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"/>
              Open beta · 2,400+ pros live
              <ArrowRight size={12}/>
            </motion.div>
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-[4.5rem] text-white leading-[1.04] tracking-tight mb-6">
              Your beauty{' '}
              <span className="relative inline-block">
                <span className="gradient-text">business</span>
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#1a50e0" strokeWidth="2.5" strokeOpacity="0.5" fill="none"/>
                </svg>
              </span>
              <br/>on autopilot.
            </h1>
            <p className="text-white/50 text-xl md:text-2xl leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
              The all-in-one booking, payments, and growth OS for{' '}
              <span className="text-white/80 font-medium">independent beauty pros</span>.
              Replace Booksy, Square, and Venmo with one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <Link href="/onboarding" className="btn-primary text-base py-4 px-8 w-full sm:w-auto shadow-glow-teal">
                Start free — no card needed <ArrowRight size={16}/>
              </Link>
              <a href="#demo" className="btn-secondary text-base py-4 px-8 w-full sm:w-auto group">
                <span className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center group-hover:bg-white/12 transition-colors"><Play size={9} className="fill-white text-white ml-0.5"/></span>
                See it in 90 sec
              </a>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-5 flex-wrap">
              {[
                { icon: Shield,   label: 'SOC 2 compliant'    },
                { icon: Zap,      label: 'Instant payouts'    },
                { icon: Star,     label: '4.9★ rated by pros' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/30 text-sm">
                  <Icon size={12} className="text-white/20"/> {label}
                </div>
              ))}
            </div>
          </motion.div>
          {/* Preview */}
          <motion.div className="flex-1 w-full" initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} transition={{duration:0.65,delay:0.15}}>
            <BookingPreviewCard/>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   STATS SECTION
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/StatsSection.tsx`, `'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal]  = useState(0)
  const ref            = useRef(null)
  const inView         = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

const STATS = [
  { label: 'Bookings processed',  target: 124000, suffix: '+',  desc: 'Across all providers' },
  { label: 'Paid out to pros',    target: 4200000, prefix: '$', suffix: '+', desc: 'Net of platform fee' },
  { label: 'Active professionals',target: 2400,   suffix: '+',  desc: 'And growing 18% MoM'  },
  { label: 'Average rating',      target: 498,    prefix: '',   suffix: '',  desc: '5-star experience',  render: (v: number) => (v/100).toFixed(2) + '★' },
]

export function StatsSection() {
  return (
    <section className="py-16 border-y border-white/[0.06] bg-white/[0.01]">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ label, target, prefix = '', suffix = '', desc, render }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="text-center"
            >
              <p className="font-display font-black text-4xl md:text-5xl text-white mb-1.5">
                {render
                  ? (() => { const [v,setV]=useState(0); useEffect(()=>{},[]); return render(target) })()
                  : <Counter target={target} prefix={prefix} suffix={suffix}/>
                }
              </p>
              <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
              <p className="text-white/30 text-xs">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/FeaturesSection.tsx`, `'use client'
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
`)

/* ══════════════════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/HowItWorksSection.tsx`, `'use client'
import { motion } from 'framer-motion'
import { UserPlus, Scissors, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create your free profile',
    desc: 'Sign up and complete 5-minute onboarding. Set your services, pricing, availability, and connect your bank via Stripe. Your booking page is live instantly.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
    detail: ['Custom booking URL + QR code', 'Portfolio image gallery', 'Bio + specialties'],
  },
  {
    num: '02',
    icon: Scissors,
    title: 'Clients book themselves',
    desc: 'Share your link anywhere — Instagram bio, text message, your door. Clients choose service, see real-time availability, and pay a deposit to confirm.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    detail: ['24/7 self-booking', 'Automatic confirmations', 'Zero phone tag'],
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Get paid, grow faster',
    desc: 'Payments hit your bank automatically. Track your revenue, collect reviews, and use loyalty rewards to keep clients coming back — all from your dashboard.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    detail: ['Stripe instant payouts', 'Revenue analytics', 'Automated retention'],
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-spacing bg-white/[0.01] border-y border-white/[0.05]">
      <div className="page-container">
        <motion.div className="text-center mb-16"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}}>
          <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-4">How it works</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-5">
            Live in under <span className="gradient-text">10 minutes</span>.
          </h2>
          <p className="text-white/45 text-xl max-w-xl mx-auto">No technical knowledge required. If you can use Instagram, you can use SalonShop.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {STEPS.map(({ num, icon: Icon, title, desc, color, bg, detail }, i) => (
            <motion.div key={num}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:0.45,delay:i*0.1}}
              className="relative">
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-full w-6 h-px bg-gradient-to-r from-white/20 to-transparent z-10 translate-x-0" />
              )}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className={\`font-display font-black text-3xl \${color} opacity-30\`}>{num}</span>
                  <div className={\`w-10 h-10 rounded-xl flex items-center justify-center border \${bg}\`}>
                    <Icon size={18} className={color}/>
                  </div>
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {detail.map(d => (
                    <li key={d} className="flex items-center gap-2 text-xs text-white/40">
                      <div className={\`w-1.5 h-1.5 rounded-full bg-current \${color}\`}/>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/onboarding" className="btn-primary text-base py-4 px-8 shadow-glow-teal">
            Set up your profile now <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </section>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/TestimonialsSection.tsx`, `'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    name: 'Destiny Williams', role: 'Natural Hair Specialist · Atlanta, GA',
    avatar: 'DW', grad: 'from-brand-400 to-brand-600',
    stars: 5, revenue: '+$3,200/mo',
    quote: 'I was using 5 different apps — Instagram for DMs, Square for payments, a Google calendar, Venmo for tips. SalonShop replaced all of them in a weekend. My clients love the text reminders and I love not chasing money.',
  },
  {
    name: 'Jordan Okafor', role: 'Master Barber · Decatur, GA',
    avatar: 'JO', grad: 'from-emerald-400 to-teal-600',
    stars: 5, revenue: '0 no-shows in 3 months',
    quote: "The deposit system is a game changer. Before SalonShop I had at least 2-3 no-shows a week. Now clients put skin in the game at booking and I haven't had a no-show in 3 months. That alone paid for the Pro plan 10x.",
  },
  {
    name: 'Priya Nair', role: 'Esthetician · Smyrna, GA',
    avatar: 'PN', grad: 'from-amber-400 to-orange-600',
    stars: 5, revenue: '4.9★ avg review score',
    quote: "The automatic review requests are genius. I was terrible at asking clients to leave reviews. Now it just... happens. My Google profile blew up and I added 18 new clients last month from organic discovery.",
  },
  {
    name: 'Sofia Ramirez', role: 'Nail Technician · Atlanta, GA',
    avatar: 'SR', grad: 'from-rose-400 to-pink-600',
    stars: 5, revenue: '2.3x client rebooking',
    quote: "The loyalty points thing is wild. I turned it on as an experiment and my rebooking rate literally doubled in 6 weeks. Clients will do anything to keep their Gold status. It's like gamification for my business.",
  },
  {
    name: 'Marcus Chen', role: 'Tattoo Artist · Atlanta, GA',
    avatar: 'MC', grad: 'from-slate-400 to-zinc-600',
    stars: 5, revenue: '$0 awkward payment moments',
    quote: "Tattoo clients used to Venmo me and it always felt weird. Now everything goes through the platform — deposit, final payment, tip — and I never have to say an awkward thing about money. Super professional.",
  },
  {
    name: 'Alex Rivera', role: 'Hair Colorist · Buckhead, GA',
    avatar: 'AR', grad: 'from-purple-400 to-fuchsia-600',
    stars: 5, revenue: '40h/mo saved on admin',
    quote: "I calculated that I was spending almost 2 hours per day texting back and forth with clients about scheduling. SalonShop cut that to near zero. I use those hours on extra clients now.",
  },
]

export function TestimonialsSection() {
  const half  = Math.ceil(TESTIMONIALS.length / 2)
  const col1  = TESTIMONIALS.slice(0, half)
  const col2  = TESTIMONIALS.slice(half)

  return (
    <section id="testimonials" className="section-spacing overflow-hidden">
      <div className="page-container">
        <motion.div className="text-center mb-16"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}}>
          <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-4">Real pros. Real results.</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-5">
            Don't just take our word.
          </h2>
          <p className="text-white/45 text-xl max-w-xl mx-auto">
            2,400+ independent professionals trust SalonShop to run their business.
          </p>
        </motion.div>

        <div className="flex gap-5 items-start">
          {[col1, col2].map((col, ci) => (
            <div key={ci} className={cn('flex-1 flex flex-col gap-5', ci === 1 && 'mt-8')}>
              {col.map(({ name, role, avatar, grad, stars, quote, revenue }, i) => (
                <motion.div key={name}
                  initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={{duration:0.4,delay:i*0.06}}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] p-6 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br',grad)}>{avatar}</div>
                      <div>
                        <p className="text-white font-semibold text-sm">{name}</p>
                        <p className="text-white/35 text-xs">{role}</p>
                      </div>
                    </div>
                    <Quote size={18} className="text-white/10 group-hover:text-brand-500/30 transition-colors"/>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(s=><Star key={s} size={12} className={s<=stars?'fill-amber-400 text-amber-400':'text-white/10'}/>)}
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">{revenue}</span>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   PRICING
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/PricingSection.tsx`, `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, ArrowRight, Sparkles, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name:  'Free',
    desc:  'Everything you need to start taking bookings today.',
    monthly: 0,
    annual: 0,
    fee: '5% platform fee',
    cta: 'Start free',
    href: '/onboarding',
    highlight: false,
    features: [
      'Up to 30 bookings/mo',
      'Custom booking page + QR code',
      'Stripe payment processing',
      'SMS + email confirmations',
      'Basic analytics dashboard',
      'Client reviews',
    ],
    missing: ['Deposit-based bookings', 'Loyalty rewards', 'Team management', 'Priority support'],
  },
  {
    name: 'Pro',
    badge: 'Most popular',
    desc: 'For serious pros ready to scale their business.',
    monthly: 2900,   // cents
    annual: 2400,
    fee: '2% platform fee',
    cta: 'Start Pro free for 14 days',
    href: '/onboarding?plan=pro',
    highlight: true,
    features: [
      'Unlimited bookings',
      'Deposit-based booking',
      'Waitlist management',
      'Full earnings analytics + export',
      'Loyalty & referral system',
      'Automated rebook reminders',
      'Cancellation policy controls',
      'Priority email + chat support',
    ],
    missing: ['Team management', 'White-labeling', 'Dedicated account manager'],
  },
  {
    name: 'Elite',
    desc: 'For shops, studios, and multi-worker operations.',
    monthly: 7900,
    annual: 6600,
    fee: '1% platform fee',
    cta: 'Book a demo',
    href: 'mailto:balentinetechsolutions@gmail.com',
    highlight: false,
    features: [
      'Everything in Pro',
      'Multi-worker team management',
      'Shop-level analytics dashboard',
      'Custom revenue split rules',
      'Worker onboarding tools',
      'White-label booking page',
      'Dedicated account manager',
      'SLA + priority phone support',
    ],
    missing: [],
  },
]

function formatPrice(cents: number) {
  if (cents === 0) return '$0'
  return '$' + (cents / 100).toFixed(0)
}

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="section-spacing">
      <div className="page-container">
        <motion.div className="text-center mb-12"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}}>
          <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-4">Simple pricing</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-5">
            Transparent. Fair. <span className="gradient-text">No surprises.</span>
          </h2>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-8">
            Pay $0 to start. Upgrade when you need more. Cancel anytime.
          </p>
          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full border border-white/[0.08] bg-white/[0.04]">
            <button onClick={()=>setAnnual(false)} className={cn('px-4 py-1.5 rounded-full text-sm font-semibold transition-all',!annual?'bg-white/10 text-white':'text-white/40 hover:text-white/60')}>
              Monthly
            </button>
            <button onClick={()=>setAnnual(true)} className={cn('px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5',annual?'bg-brand-500/20 text-brand-300 border border-brand-500/30':'text-white/40 hover:text-white/60')}>
              Annual <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Save 17%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PLANS.map(({ name, badge, desc, monthly, annual: ann, fee, cta, href, highlight, features, missing }, i) => (
            <motion.div key={name}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:0.4,delay:i*0.1}}
              className={cn('relative rounded-2xl border p-7 flex flex-col',
                highlight
                  ? 'bg-brand-500/10 border-brand-500/30 shadow-glow-teal ring-1 ring-brand-500/20'
                  : 'bg-white/[0.025] border-white/[0.08]'
              )}>
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold shadow-glow-teal">
                  <Sparkles size={10}/> {badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl text-white mb-1">{name}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
              <div className="mb-2">
                <div className="flex items-end gap-1.5">
                  <span className="font-display font-black text-5xl text-white">
                    {formatPrice(annual ? ann : monthly)}
                  </span>
                  {(monthly > 0) && <span className="text-white/35 text-sm mb-2">/mo · billed {annual ? 'annually' : 'monthly'}</span>}
                </div>
                <p className="text-white/30 text-xs mt-1 flex items-center gap-1"><Zap size={10}/> +{fee} per transaction</p>
              </div>
              <Link href={href}
                className={cn('w-full text-center py-3 rounded-xl font-bold text-sm transition-all my-6 flex items-center justify-center gap-2',
                  highlight
                    ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-glow-teal hover:-translate-y-0.5'
                    : 'bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.10] text-white'
                )}>
                {cta} {highlight && <ArrowRight size={14}/>}
              </Link>
              <ul className="space-y-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                    <Check size={14} className={cn('mt-0.5 flex-shrink-0', highlight ? 'text-brand-400' : 'text-emerald-400')}/>
                    {f}
                  </li>
                ))}
                {missing.length > 0 && (
                  <>
                    <li className="border-t border-white/[0.05] my-2"/>
                    {missing.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/20 line-through">
                        <HelpCircle size={14} className="mt-0.5 flex-shrink-0 text-white/15"/>
                        {f}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/25 text-sm mt-8">
          All plans include SSL, GDPR compliance, 99.9% uptime SLA, and human support.
          Questions? <a href="mailto:balentinetechsolutions@gmail.com" className="text-brand-400 hover:text-brand-300 underline">Talk to us.</a>
        </p>
      </div>
    </section>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════════════════════ */
w(`${SECTIONS}/CtaSection.tsx`, `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function CtaSection() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section id="demo" className="section-spacing">
      <div className="page-container">
        <motion.div
          initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:0.55}}
          className="relative rounded-3xl overflow-hidden border border-brand-500/20">
          {/* BG gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-brand-500/10 to-purple-600/15 pointer-events-none"/>
          <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:'radial-gradient(white 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"/>

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Flair */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-bold mb-7">
              <Sparkles size={12}/> Limited beta slots remaining
            </div>

            <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight mb-6 leading-[1.05]">
              Ready to run your<br/>
              <span className="gradient-text">business smarter?</span>
            </h2>
            <p className="text-white/50 text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Join 2,400+ beauty professionals who replaced their patchwork of apps with SalonShop.
              <strong className="text-white font-semibold"> Free to start. No credit card.</strong>
            </p>

            {/* Email waitlist OR direct signup */}
            {submitted ? (
              <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-lg font-semibold">
                <CheckCircle size={22}/> You're on the list. We'll be in touch shortly!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
                <div className="relative flex-1">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"/>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your professional email"
                    className="w-full pl-11 pr-4 py-4 text-base bg-white/[0.06] border border-white/[0.12] focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 rounded-xl text-white placeholder:text-white/25 outline-none transition-all"/>
                </div>
                <button type="submit" className="btn-primary text-base py-4 px-7 shadow-glow-teal whitespace-nowrap">
                  Join waitlist <ArrowRight size={16}/>
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                'Free forever plan',
                '2-min setup',
                'Cancel anytime',
                'No credit card',
              ].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-white/35 text-sm">
                  <CheckCircle size={13} className="text-brand-400/70"/> {item}
                </span>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-center gap-4">
              <p className="text-white/30 text-sm">Already a pro?</p>
              <Link href="/onboarding" className="text-brand-400 hover:text-brand-300 transition-colors font-semibold text-sm flex items-center gap-1.5">
                Complete your onboarding <ArrowRight size={13}/>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
`)

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
w(`${LAYOUT}/Footer.tsx`, `'use client'
import Link from 'next/link'
import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const LINKS = {
  Product: [
    { label: 'Features',       href: '#features'       },
    { label: 'Pricing',        href: '#pricing'        },
    { label: 'Demo',           href: '#demo'           },
    { label: 'Changelog',      href: '#'               },
    { label: 'Roadmap',        href: '/docs/ROADMAP'   },
  ],
  'For Pros': [
    { label: 'Get started',    href: '/onboarding'     },
    { label: 'Your booking page', href: '/dashboard'   },
    { label: 'Stripe payouts', href: '/dashboard'      },
    { label: 'Discover pros',  href: '/discover'       },
  ],
  Company: [
    { label: 'About',          href: '#'               },
    { label: 'Blog',           href: '#'               },
    { label: 'Careers',        href: '#'               },
    { label: 'Contact',        href: 'mailto:balentinetechsolutions@gmail.com' },
  ],
  Legal: [
    { label: 'Privacy policy', href: '#'  },
    { label: 'Terms of service', href: '#' },
    { label: 'Cookie policy',   href: '#'  },
  ],
}

const SOCIAL = [
  { icon: Twitter,  href: '#', label: 'Twitter'  },
  { icon: Instagram,href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn'  },
  { icon: Github,   href: 'https://github.com/debalent/SalonShop', label: 'GitHub' },
  { icon: Mail,     href: 'mailto:balentinetechsolutions@gmail.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-950">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Logo size={26}/>
              <span className="font-display font-black text-lg text-white">Salon<span className="text-brand-400">Shop</span></span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-5 max-w-xs">
              The booking, payments, and growth OS for independent beauty professionals. Built from Atlanta to the world.
            </p>
            <div className="flex gap-2.5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all">
                  <Icon size={14}/>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-white font-semibold text-sm mb-4">{section}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-white/35 hover:text-white text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} SalonShop. All rights reserved. Built by Balentine Tech Solutions.</p>
          <div className="flex items-center gap-4 text-white/20 text-xs">
            <span>v0.9 beta</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
`)

console.log('\n  ✅ All landing page sections + layout rebuilt\n')
