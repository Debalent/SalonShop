'use client'
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
