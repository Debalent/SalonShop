'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    name: 'Destiny Williams', role: 'Natural Hair Specialist · Atlanta, GA',
    avatar: 'DW', grad: 'from-brand-400 to-brand-600',
    stars: 5, revenue: '+$3,200/mo',
    quote: 'I was using 5 different apps — Instagram for DMs, Square for payments, a Google calendar, Venmo for tips. SalonShop replaced all of them in a weekend. My clients love the text reminders and I love not chasing money.',
  },
  {
    name: 'Jordan Okafor', role: 'Master Barber · Decatur, GA',
    avatar: 'JO', grad: 'from-emerald-400 to-teal-600',
    stars: 5, revenue: '0 no-shows in 3 months',
    quote: "The deposit system is a game changer. Before SalonShop I had at least 2-3 no-shows a week. Now clients put skin in the game at booking and I haven't had a no-show in 3 months. That alone paid for the Pro plan 10x.",
  },
  {
    name: 'Priya Nair', role: 'Esthetician · Smyrna, GA',
    avatar: 'PN', grad: 'from-amber-400 to-orange-600',
    stars: 5, revenue: '4.9★ avg review score',
    quote: "The automatic review requests are genius. I was terrible at asking clients to leave reviews. Now it just... happens. My Google profile blew up and I added 18 new clients last month from organic discovery.",
  },
  {
    name: 'Sofia Ramirez', role: 'Nail Technician · Atlanta, GA',
    avatar: 'SR', grad: 'from-rose-400 to-pink-600',
    stars: 5, revenue: '2.3x client rebooking',
    quote: "The loyalty points thing is wild. I turned it on as an experiment and my rebooking rate literally doubled in 6 weeks. Clients will do anything to keep their Gold status. It's like gamification for my business.",
  },
  {
    name: 'Marcus Chen', role: 'Tattoo Artist · Atlanta, GA',
    avatar: 'MC', grad: 'from-slate-400 to-zinc-600',
    stars: 5, revenue: '$0 awkward payment moments',
    quote: "Tattoo clients used to Venmo me and it always felt weird. Now everything goes through the platform — deposit, final payment, tip — and I never have to say an awkward thing about money. Super professional.",
  },
  {
    name: 'Alex Rivera', role: 'Hair Colorist · Buckhead, GA',
    avatar: 'AR', grad: 'from-purple-400 to-fuchsia-600',
    stars: 5, revenue: '40h/mo saved on admin',
    quote: "I calculated that I was spending almost 2 hours per day texting back and forth with clients about scheduling. SalonShop cut that to near zero. I use those hours on extra clients now.",
  },
]

export function TestimonialsSection() {
  const half  = Math.ceil(TESTIMONIALS.length / 2)
  const col1  = TESTIMONIALS.slice(0, half)
  const col2  = TESTIMONIALS.slice(half)

  return (
    <section id="testimonials" className="section-spacing overflow-hidden">
      <div className="page-container">
        <motion.div className="text-center mb-16"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}}>
          <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-4">Real pros. Real results.</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-5">
            Don't just take our word.
          </h2>
          <p className="text-white/45 text-xl max-w-xl mx-auto">
            2,400+ independent professionals trust SalonShop to run their business.
          </p>
        </motion.div>

        <div className="flex gap-5 items-start">
          {[col1, col2].map((col, ci) => (
            <div key={ci} className={cn('flex-1 flex flex-col gap-5', ci === 1 && 'mt-8')}>
              {col.map(({ name, role, avatar, grad, stars, quote, revenue }, i) => (
                <motion.div key={name}
                  initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={{duration:0.4,delay:i*0.06}}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] p-6 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br',grad)}>{avatar}</div>
                      <div>
                        <p className="text-white font-semibold text-sm">{name}</p>
                        <p className="text-white/35 text-xs">{role}</p>
                      </div>
                    </div>
                    <Quote size={18} className="text-white/10 group-hover:text-brand-500/30 transition-colors"/>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(s=><Star key={s} size={12} className={s<=stars?'fill-amber-400 text-amber-400':'text-white/10'}/>)}
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">{revenue}</span>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
