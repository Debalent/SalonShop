'use client'
import { motion } from 'framer-motion'

const stats = [
  { value: '12,000+', label: 'Professionals', sublabel: 'and growing' },
  { value: '$2.4M+', label: 'Processed monthly', sublabel: 'on the platform' },
  { value: '98.7%', label: 'Uptime SLA', sublabel: 'guaranteed reliability' },
  { value: '4.9 ★', label: 'App Store rating', sublabel: 'from 3,200+ reviews' },
]

export function StatsSection() {
  return (
    <section className="py-12 bg-surface-950 border-y border-white/[0.04]">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map(({ value, label, sublabel }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display font-black text-3xl md:text-4xl gradient-text mb-1">
                {value}
              </div>
              <div className="text-white font-semibold text-sm md:text-base mb-0.5">{label}</div>
              <div className="text-white/35 text-xs">{sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
