'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    let current = 0
    const step  = target / 55
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{prefix}{val >= 1000 ? val.toLocaleString() : val}{suffix}</span>
}

const STATS: Array<{ label: string; target: number; prefix: string; suffix: string; sub: string; display: string | null }> = [
  { label: 'Bookings processed',   target: 124000, prefix: '',  suffix: '+',  sub: 'All-time across platform',       display: null  },
  { label: 'Paid out to pros',     target: 4200,   prefix: '$', suffix: 'K+', sub: 'Net of platform fee',            display: null  },
  { label: 'Active professionals', target: 2400,   prefix: '',  suffix: '+',  sub: 'Growing 18% month-over-month',   display: null  },
  { label: 'Average rating',       target: 49,     prefix: '',  suffix: '',   sub: '5-star client experience',       display: '4.9★' },
]

export function StatsSection() {
  return (
    <section className="py-16 border-y border-white/[0.06] bg-white/[0.012]">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map(({ label, target, prefix, suffix, sub, display }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display font-black text-4xl md:text-5xl text-white mb-1.5 tabular-nums">
                {display
                  ? <span>{display}</span>
                  : <AnimatedNumber target={target} prefix={prefix} suffix={suffix} />
                }
              </p>
              <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
              <p className="text-white/30 text-xs">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
