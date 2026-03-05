'use client'
import { motion } from 'framer-motion'
import { CalendarDays, CreditCard, BarChart3, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: CalendarDays,
    title: 'Create your profile',
    desc: 'Set up services, pricing, availability, and booking rules in under 10 minutes. Connect Stripe to start accepting payments instantly.',
    detail: ['Add services + pricing', 'Set your availability', 'Connect Stripe in 2 min', 'Get your booking link'],
    accent: 'brand',
  },
  {
    num: '02',
    icon: CreditCard,
    title: 'Clients book & pay',
    desc: 'Clients book in 3 clicks from your custom link, QR code, or profile. They pay a deposit or full amount — cards, Apple Pay, Google Pay accepted.',
    detail: ['Real-time availability', 'Deposit collection', 'Auto-confirmation', 'Calendar invite sent'],
    accent: 'purple',
  },
  {
    num: '03',
    icon: BarChart3,
    title: 'Get paid, grow faster',
    desc: 'Funds hit your Stripe account automatically after every appointment. Track earnings, reviews, and client retention — all in your dashboard.',
    detail: ['Instant payout option', 'Automatic tipping', 'Revenue analytics', '1099-ready exports'],
    accent: 'rose',
  },
]

const accentMap: Record<string, { text: string; bg: string; border: string; num: string }> = {
  brand:  { text: 'text-brand-400',  bg: 'bg-brand-500/10',  border: 'border-brand-500/20',  num: 'text-brand-500/20' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', num: 'text-purple-500/20' },
  rose:   { text: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20',   num: 'text-rose-500/20' },
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-spacing bg-surface-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            How it works
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl text-white mb-5 tracking-tight">
            Up and running{' '}
            <span className="gradient-text">in minutes</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            No training required. If you can use Instagram, you can use SalonShop.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[calc(33.33%-24px)] right-[calc(33.33%-24px)] h-px bg-gradient-to-r from-white/10 via-brand-500/20 to-white/10" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map(({ num, icon: Icon, title, desc, detail, accent }, i) => {
              const a = accentMap[accent]
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 h-full hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-300 hover:shadow-card">
                    {/* Step icon + number */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${a.bg} border ${a.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={22} className={a.text} />
                      </div>
                      <span className={`text-6xl font-display font-black leading-none ${a.num}`}>{num}</span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-white mb-3">{title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">{desc}</p>

                    <ul className="space-y-2.5">
                      {detail.map(pt => (
                        <li key={pt} className="flex items-center gap-2.5 text-sm text-white/65">
                          <CheckCircle2 size={14} className={a.text} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
