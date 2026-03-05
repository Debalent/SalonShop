'use client'
import { motion } from 'framer-motion'
import { Users, DollarSign, Activity, Star } from 'lucide-react'

const stats = [
  { icon: Users,      value: '12,000+', label: 'Professionals',     sublabel: 'and growing every day',          color: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20' },
  { icon: DollarSign, value: '$2.4M+',  label: 'Processed monthly', sublabel: 'in real bookings & payments',    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: Activity,   value: '98.7%',   label: 'Uptime SLA',        sublabel: 'guaranteed reliability',         color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
  { icon: Star,       value: '4.9 / 5', label: 'App Store rating',  sublabel: 'from 3,200+ verified reviews',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-surface-950 border-y border-white/[0.05]">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ icon: Icon, value, label, sublabel, color, bg, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`relative p-5 md:p-6 rounded-2xl border flex flex-col gap-3 cursor-default
                hover:-translate-y-1 transition-all duration-300 hover:shadow-card ${bg} ${border}`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg} ${border}`}>
                <Icon size={19} className={color} />
              </div>
              <div>
                <div className={`font-display font-black text-3xl md:text-4xl leading-none mb-1 ${color}`}>
                  {value}
                </div>
                <div className="text-white font-semibold text-sm md:text-base">{label}</div>
                <div className="text-white/35 text-xs mt-0.5 hidden sm:block">{sublabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
