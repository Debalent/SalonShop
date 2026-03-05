'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const plans = [
  {
    tier: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started.',
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
    price: { monthly: 29, yearly: 23 },
    description: 'For solo pros ready to grow.',
    features: [
      'Unlimited services',
      'Deposit & pre-pay',
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
    price: { monthly: 79, yearly: 63 },
    description: 'For shops and teams.',
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
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="section-spacing bg-surface-950">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-500/10 border border-coral-500/20 text-coral-400 text-sm font-semibold mb-6">
            Transparent pricing
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">
            Simple pricing,{' '}
            <span className="gradient-text">no surprises</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                !isYearly ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
                isYearly ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'
              )}
            >
              Yearly
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map(({ tier, name, price, description, features, cta, href, highlight, badge }, i) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={cn(
                'relative rounded-2xl p-7 flex flex-col transition-all duration-300',
                highlight
                  ? 'bg-brand-500/10 border-2 border-brand-500/40 shadow-glow-teal scale-[1.02]'
                  : 'glass-card hover:border-white/15'
              )}
            >
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-bold shadow-glow-teal flex items-center gap-1.5">
                  <Zap size={12} /> {badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-bold text-xl text-white mb-1">{name}</h3>
                <p className="text-white/50 text-sm">{description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="font-display font-black text-5xl text-white">
                    ${isYearly ? price.yearly : price.monthly}
                  </span>
                  <span className="text-white/40 text-sm mb-2">/mo</span>
                </div>
                {isYearly && price.monthly > 0 && (
                  <span className="text-white/35 text-xs line-through">${price.monthly}/mo</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-white/65">
                    <Check size={15} className="text-brand-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={cn(
                  'text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200',
                  highlight
                    ? 'btn-primary'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
                )}
              >
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/35 text-sm mt-10"
        >
          All plans include SSL, uptime guarantee, and SOC2-ready infrastructure.
          Platform fee of 2% applies on Pro and below.
        </motion.p>
      </div>
    </section>
  )
}
