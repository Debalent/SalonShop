'use client'
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
