'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Destiny Williams',
    role: 'Independent Stylist · Atlanta',
    avatar: 'D',
    gradient: 'from-pink-500 to-rose-600',
    rating: 5,
    quote: 'SalonShop replaced Styleseat for me overnight. The deposit system alone cut my no-shows by 80%. The dashboard is genuinely beautiful — I open it every morning.',
    highlight: '80% fewer no-shows',
    featured: true,
  },
  {
    name: 'Marcus Chen',
    role: 'Shop Owner · The Cut Collective',
    avatar: 'M',
    gradient: 'from-brand-500 to-blue-600',
    rating: 5,
    quote: 'Managing 6 stylists used to be chaos across 3 apps. SalonShop gave us one dashboard for everything. My revenue grew 22% in 60 days.',
    highlight: '+22% revenue in 60 days',
    featured: false,
  },
  {
    name: 'Sofia Ramirez',
    role: 'Nail Tech & Esthetician · Miami',
    avatar: 'S',
    gradient: 'from-purple-500 to-indigo-600',
    rating: 5,
    quote: 'The booking flow is so smooth my clients compliment it. Apple Pay and the 3-click checkout made a real difference. I get more bookings from my link than Instagram.',
    highlight: 'More bookings than Instagram',
    featured: false,
  },
  {
    name: 'Jordan Okafor',
    role: 'Barber · NYC',
    avatar: 'J',
    gradient: 'from-amber-500 to-orange-600',
    rating: 5,
    quote: 'I was skeptical switching from Square. But Stripe payouts hit my account faster, commission tracking for my team is perfect, and the QR code booking link is a game changer.',
    highlight: 'Faster payouts than Square',
    featured: false,
  },
  {
    name: 'Priya Nair',
    role: 'Lash Artist · Los Angeles',
    avatar: 'P',
    gradient: 'from-green-500 to-emerald-600',
    rating: 5,
    quote: 'The loyalty points feature brought back 30% of my lapsed clients in the first month. Automation saves me 2 hours a day on confirmations alone.',
    highlight: '30% lapsed clients returned',
    featured: false,
  },
  {
    name: 'Tyler Brooks',
    role: 'Tattoo Artist · Austin',
    avatar: 'T',
    gradient: 'from-blue-500 to-cyan-600',
    rating: 5,
    quote: 'The portfolio gallery and before/after slider makes my booking page look like a real creative portfolio. Clients trust me before they even read a review.',
    highlight: 'Portfolio that converts',
    featured: false,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-spacing bg-surface-900">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold mb-6">
            <Star size={13} className="fill-yellow-400" />
            Loved by professionals
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl xl:text-6xl text-white mb-5 tracking-tight">
            Real results from{' '}
            <span className="gradient-text">real pros</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Join 12,000+ beauty professionals who switched to SalonShop.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, avatar, gradient, rating, quote, highlight, featured }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300
                hover:-translate-y-1 hover:shadow-card
                ${featured
                  ? 'bg-brand-500/10 border-brand-500/25 md:col-span-2 lg:col-span-1'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.14]'}`}
            >
              {/* Quote icon */}
              <Quote size={28} className="text-white/8 mb-3 flex-shrink-0" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(rating)].map((_, j) => (
                  <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/70 text-sm leading-relaxed mb-5 flex-1">&ldquo;{quote}&rdquo;</p>

              {/* Highlight chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/60 text-xs font-semibold mb-5 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {highlight}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{name}</div>
                  <div className="text-white/40 text-xs">{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
