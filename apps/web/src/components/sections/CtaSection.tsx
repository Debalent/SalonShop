'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="section-spacing bg-surface-900">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 via-brand-500/15 to-surface-800" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/15 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-500/10 rounded-full blur-[60px]" />
          </div>

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-brand-500/25" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300 text-sm font-semibold mb-8">
              <Sparkles size={14} />
              Free 14-day trial — no credit card required
            </div>

            <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-6 leading-tight">
              Stop leaving money
              <br />
              <span className="gradient-text">on the table.</span>
            </h2>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 12,000+ beauty professionals who switched to SalonShop.
              Setup takes 10 minutes. Results start immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-base !px-10 !py-4 glow-teal">
                Start your free trial
                <ArrowRight size={18} />
              </Link>
              <Link href="/demo" className="btn-secondary text-base !px-10 !py-4">
                See live demo
              </Link>
            </div>

            <p className="mt-6 text-white/30 text-sm">
              No setup fee · Cancel anytime · HTTPS + encrypted data
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
