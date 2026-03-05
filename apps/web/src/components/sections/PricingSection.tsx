'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap, Building2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const plans = [
  {
    tier: 'free',
    name: 'Starter',
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    desc: 'Perfect for getting started.',
    features: [
      'Up to 5 services',
      'Basic booking page',
      '1 payment method',
      'Email confirmations',
      'Basic analytics',
    ],
    cta: 'Get started free',
    href: '/register?plan=free',
    highlight: false,
    badge: null,
  },
  {
    tier: 'pro',
    name: 'Pro',
    icon: Zap,
    price: { monthly: 29, yearly: 23 },
    desc: 'For solo pros ready to grow.',
    features: [
      'Unlimited services',
      'Deposit & full pre-pay',
      'All payment methods',
      'SMS + email automation',
      'Full analytics dashboard',
      'Portfolio gallery',
      'Loyalty & referrals',
      'QR booking link',
      'Custom booking URL',
      'Priority support',
    ],
    cta: 'Start Pro free trial',
    href: '/register?plan=pro',
    highlight: true,
    badge: 'Most popular',
  },
  {
    tier: 'business',
    name: 'Business',
    icon: Building2,
    price: { monthly: 79, yearly: 63 },
    desc: 'For shops and teams.',
    features: [
      'Everything in Pro',
      'Up to 25 staff members',
      'Team calendar & roles',
      'Commission split tracking',
      'Revenue by provider',
      'Advanced reporting',
      'Custom branding',
      'Custom domain',
      'API access',
      'Dedicated onboarding',
    ],
    cta: 'Start Business trial',
    href: '/register?plan=business',
    highlight: false,
    badge: null,
  },
]

export function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="section-spacing bg-surface-950">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-6">
            Transparent pricing
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl text-white mb-5 tracking-tight">
            Simple pricing,{' '}
            <span className="gradient-text">no surprises</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08]">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                !yearly ? 'bg-white/10 text-white shadow-sm' : 'text-white/45 hover:text-white/70'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
                yearly ? 'bg-white/10 text-white shadow-sm' : 'text-white/45 hover:text-white/70'
              )}
            >
              Yearly
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/30">
                −20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
          {plans.map(({ tier, name, icon: Icon, price, desc, features, cta, href, highlight, badge }, i) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={cn(
                'relative rounded-2xl p-7 flex flex-col transition-all duration-300',
                highlight
                  ? 'bg-brand-500/12 border-2 border-brand-500/45 shadow-glow-teal'
                  : 'bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-card',
              )}
            >
              {/* Popular badge */}
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-bold shadow-glow-teal">
                  <Zap size={11} />
                  {badge}
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center',
                      highlight ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-white/[0.07] border border-white/10'
                    )}>
                      <Icon size={14} className={highlight ? 'text-brand-300' : 'text-white/60'} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">{name}</h3>
                  </div>
                  <p className="text-white/40 text-sm">{desc}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-7">
                <div className="flex items-end gap-1.5">
                  <span className="font-display font-black text-5xl text-white leading-none">
                    {price.monthly === 0 ? 'Free' : `$${yearly ? price.yearly : price.monthly}`}
                  </span>
                  {price.monthly > 0 && (
                    <span className="text-white/35 text-sm mb-1.5">/mo{yearly ? ' billed yearly' : ''}</span>
                  )}
                </div>
                {yearly && price.monthly > 0 && (
                  <p className="text-green-400 text-xs font-semibold mt-1.5">
                    Save ${(price.monthly - price.yearly) * 12}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/65">
                    <Check
                      size={15}
                      className={cn('mt-0.5 flex-shrink-0', highlight ? 'text-brand-400' : 'text-white/40')}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={href}
                className={cn(
                  'block text-center py-3 rounded-xl font-bold text-sm transition-all',
                  highlight
                    ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-glow-teal hover:-translate-y-0.5'
                    : 'bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/20'
                )}
              >
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/25 text-sm mt-8">
          All plans include a 14-day free trial · No credit card required to start
        </p>
      </div>
    </section>
  )
}
