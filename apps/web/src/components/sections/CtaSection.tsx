'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function CtaSection() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section id="demo" className="section-spacing">
      <div className="page-container">
        <motion.div
          initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:0.55}}
          className="relative rounded-3xl overflow-hidden border border-brand-500/20">
          {/* BG gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-brand-500/10 to-purple-600/15 pointer-events-none"/>
          <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:'radial-gradient(white 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"/>

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Flair */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-bold mb-7">
              <Sparkles size={12}/> Limited beta slots remaining
            </div>

            <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight mb-6 leading-[1.05]">
              Ready to run your<br/>
              <span className="gradient-text">business smarter?</span>
            </h2>
            <p className="text-white/50 text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Join 2,400+ beauty professionals who replaced their patchwork of apps with SalonShop.
              <strong className="text-white font-semibold"> Free to start. No credit card.</strong>
            </p>

            {/* Email waitlist OR direct signup */}
            {submitted ? (
              <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-lg font-semibold">
                <CheckCircle size={22}/> You're on the list. We'll be in touch shortly!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
                <div className="relative flex-1">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"/>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your professional email"
                    className="w-full pl-11 pr-4 py-4 text-base bg-white/[0.06] border border-white/[0.12] focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 rounded-xl text-white placeholder:text-white/25 outline-none transition-all"/>
                </div>
                <button type="submit" className="btn-primary text-base py-4 px-7 shadow-glow-teal whitespace-nowrap">
                  Join waitlist <ArrowRight size={16}/>
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                'Free forever plan',
                '2-min setup',
                'Cancel anytime',
                'No credit card',
              ].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-white/35 text-sm">
                  <CheckCircle size={13} className="text-brand-400/70"/> {item}
                </span>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-center gap-4">
              <p className="text-white/30 text-sm">Already a pro?</p>
              <Link href="/onboarding" className="text-brand-400 hover:text-brand-300 transition-colors font-semibold text-sm flex items-center gap-1.5">
                Complete your onboarding <ArrowRight size={13}/>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
