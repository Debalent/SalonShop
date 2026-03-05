'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const perks = [
  '14-day free trial',
  'No credit card required',
  'Setup in 10 minutes',
  'Cancel anytime',
]

export function CtaSection() {
  return (
    <section className="section-spacing bg-surface-900">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-800/60 via-brand-700/30 to-surface-800" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand-600/15 rounded-full blur-[80px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>
          <div className="absolute inset-0 rounded-3xl border border-brand-500/20" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300 text-sm font-semibold mb-8"
            >
              <Sparkles size={14} />
              Free 14-day trial — no credit card required
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display font-black text-4xl md:text-6xl xl:text-7xl text-white mb-6 leading-tight tracking-tight"
            >
              Stop leaving money
              <br />
              <span className="gradient-text">on the table.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Join 12,000+ beauty professionals who switched to SalonShop.
              Setup takes 10 minutes. Results start immediately.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-10 py-4 bg-white text-brand-700 font-bold text-base rounded-xl transition-all duration-200 hover:bg-brand-50 hover:-translate-y-0.5 hover:shadow-xl w-full sm:w-auto justify-center"
              >
                Start your free trial
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-white/25 text-white font-semibold text-base rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
              >
                View pricing
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            >
              {perks.map(p => (
                <div key={p} className="flex items-center gap-2 text-white/45 text-sm">
                  <CheckCircle2 size={14} className="text-brand-400" />
                  {p}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
