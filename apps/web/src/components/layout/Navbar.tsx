'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'

const NAV_ITEMS = [
  { label: 'Features',   href: '#features'   },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing',    href: '#pricing'    },
  {
    label: 'Product',
    href: '#',
    children: [
      { label: 'Booking system',   href: '#features',       desc: 'Calendar, slots, reminders' },
      { label: 'Payments',         href: '#features',       desc: 'Stripe Connect marketplace' },
      { label: 'Analytics',        href: '/dashboard',      desc: 'Revenue & growth insights' },
      { label: 'Loyalty rewards',  href: '/dashboard/loyalty', desc: 'Points, tiers, referrals' },
    ],
  },
]

export function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-surface-950/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl' : 'bg-transparent'
    )}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={28} />
            <span className="font-display font-black text-xl text-white tracking-tight">
              Salon<span className="text-brand-400">Shop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              item.children ? (
                <div key={item.label} className="relative"
                  onMouseEnter={() => setDropdown(item.label)}
                  onMouseLeave={() => setDropdown(null)}>
                  <button className="flex items-center gap-1 px-3.5 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/[0.05]">
                    {item.label} <ChevronDown size={13} className={cn('transition-transform', dropdown === item.label && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{    opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-64 mt-1 rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-xl shadow-2xl overflow-hidden p-1.5"
                      >
                        {item.children.map(child => (
                          <Link key={child.label} href={child.href}
                            className="flex flex-col gap-0.5 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group">
                            <span className="text-white text-sm font-semibold group-hover:text-brand-300 transition-colors">{child.label}</span>
                            <span className="text-white/35 text-xs">{child.desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={item.label} href={item.href}
                  className="px-3.5 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/[0.05]">
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/dashboard" className="text-white/55 hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-white/[0.05] transition-all">
              Sign in
            </Link>
            <Link href="/onboarding"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all hover:shadow-glow-teal hover:-translate-y-0.5">
              <Sparkles size={13} /> Get started free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] text-white/70 hover:text-white transition-colors">
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] bg-surface-950/95 backdrop-blur-xl"
          >
            <div className="page-container py-4 space-y-1">
              {NAV_ITEMS.filter(i => !i.children).map(item => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-white/60 hover:text-white font-medium rounded-xl hover:bg-white/[0.05] transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-white/[0.06]">
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-secondary text-center">Sign in</Link>
                <Link href="/onboarding" onClick={() => setOpen(false)} className="btn-primary text-center">
                  Get started free <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
