'use client'
import { motion } from 'framer-motion'
import { CalendarDays, CreditCard, BarChart3 } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: CalendarDays,
    title: 'Create your profile',
    description: 'Set up your services, pricing, availability, and booking rules in under 10 minutes. Connect your Stripe account to start accepting payments instantly.',
    color: 'text-brand-400',
    accent: 'bg-brand-500',
    detail: ['Add services + pricing', 'Set your hours', 'Connect Stripe', 'Get your booking link'],
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Clients book & pay',
    description: 'Clients book in 3 clicks from your custom link, QR code, or profile. They pay a deposit or full amount — cards, Apple Pay, Google Pay accepted.',
    color: 'text-purple-400',
    accent: 'bg-purple-500',
    detail: ['Real-time availability', 'Deposit collection', 'Auto-confirmation', 'Calendar invite sent'],
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Get paid, grow faster',
    description: 'Funds hit your Stripe account automatically after every appointment. Track earnings, reviews, and client retention — all in your dashboard.',
    color: 'text-coral-400',
    accent: 'bg-coral-500',
    detail: ['Instant payout option', 'Automatic tipping', 'Revenue analytics', '1099-ready exports'],
  },
]

export function HowItWorksSection() {
  return (
    <section className="section-spacing bg-surface-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            How it works
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">
            Up and running{' '}
            <span className="gradient-text">in minutes</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            No training required. If you can use Instagram, you can use SalonShop.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map(({ step, icon: Icon, title, description, color, accent, detail }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < 2 && (
                /* eslint-disable-next-line react/forbid-dom-props */
                <div className="hidden md:block absolute top-8 left-full w-[calc(100%-2rem)] h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
              )}

              <div className="glass-card p-7 h-full relative z-10 hover:border-white/15 transition-all duration-300 hover:-translate-y-1">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${accent}/20 border border-current/20 flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                  </div>
                  <span className="text-5xl font-display font-black text-white/[0.06] leading-none">
                    {step}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-3">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{description}</p>

                <ul className="space-y-2">
                  {detail.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                      <div className={`w-1.5 h-1.5 rounded-full ${accent} flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
