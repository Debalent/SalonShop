'use client'
import { motion } from 'framer-motion'
import { Star, CheckCircle2 } from 'lucide-react'

const testimonials = [
  {
    name: 'Destiny Williams',
    role: 'Independent Stylist, Atlanta',
    avatar: 'D',
    color: 'from-pink-500 to-rose-500',
    rating: 5,
    quote: "SalonShop replaced Styleseat for me overnight. The deposit system alone has cut my no-shows by 80%. The dashboard is genuinely beautiful — I actually open it every morning.",
    highlight: '80% fewer no-shows',
  },
  {
    name: 'Marcus Chen',
    role: 'Shop Owner — The Cut Collective',
    avatar: 'M',
    color: 'from-brand-500 to-teal-500',
    rating: 5,
    quote: "Managing 6 stylists used to be chaos across 3 different apps. SalonShop gave us one dashboard for everything — bookings, payouts, performance. My revenue grew 22% in 60 days.",
    highlight: '+22% revenue in 60 days',
  },
  {
    name: 'Sofia Ramirez',
    role: 'Nail Tech & Esthetician, Miami',
    avatar: 'S',
    color: 'from-purple-500 to-indigo-500',
    rating: 5,
    quote: "The booking flow is so smooth my clients compliment it. Apple Pay support and the 3-click checkout made a real difference in conversions. I get more bookings now from my link than Instagram.",
    highlight: 'More bookings via link than IG',
  },
  {
    name: 'Jordan Okafor',
    role: 'Barber, NYC',
    avatar: 'J',
    color: 'from-amber-500 to-orange-500',
    rating: 5,
    quote: "I was skeptical switching from Square. But the Stripe payouts hit my account faster, the commission tracking for my team is perfect, and the QR code booking link is a game changer.",
    highlight: 'Faster payouts than Square',
  },
  {
    name: 'Priya Nair',
    role: 'Lash Artist, Los Angeles',
    avatar: 'P',
    color: 'from-green-500 to-emerald-500',
    rating: 5,
    quote: "The loyalty points feature brought back 30% of my lapsed clients in the first month. Automation features save me 2 hours a day on confirmations and reminders alone.",
    highlight: '30% lapsed clients returned',
  },
  {
    name: 'Tyler Brooks',
    role: 'Tattoo Artist, Austin',
    avatar: 'T',
    color: 'from-blue-500 to-cyan-500',
    rating: 5,
    quote: "The portfolio gallery and before/after slider makes my booking page look like a real creative portfolio. Clients trust me before they even read a review. It's premium.",
    highlight: 'Portfolio that converts',
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-spacing bg-surface-900">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold mb-6">
            <Star size={14} className="fill-yellow-400" />
            Loved by professionals
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-5">
            Real results from{' '}
            <span className="gradient-text">real pros</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, avatar, color, rating, quote, highlight }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(rating)].map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-white/70 text-sm leading-relaxed mb-5 flex-1">&ldquo;{quote}&rdquo;</p>

              {/* Highlight */}
              <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <CheckCircle2 size={14} className="text-brand-400 flex-shrink-0" />
                <span className="text-brand-400 text-xs font-semibold">{highlight}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold`}>
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
