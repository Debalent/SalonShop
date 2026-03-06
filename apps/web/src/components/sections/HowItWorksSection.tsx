'use client'
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
                  <span className={`font-display font-black text-3xl ${color} opacity-30`}>{num}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}>
                    <Icon size={18} className={color}/>
                  </div>
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {detail.map(d => (
                    <li key={d} className="flex items-center gap-2 text-xs text-white/40">
                      <div className={`w-1.5 h-1.5 rounded-full bg-current ${color}`}/>
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
