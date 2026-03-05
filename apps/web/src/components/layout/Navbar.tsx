'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Features',     href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing',      href: '/#pricing' },
  { label: 'Testimonials', href: '/#testimonials' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-950/85 backdrop-blur-2xl border-b border-white/[0.07] shadow-2xl'
          : 'bg-transparent'
      )}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between h-16 md:h-[70px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Logo
              size={34}
              className="ring-1 ring-white/10 group-hover:ring-brand-500/50 transition-all duration-200"
            />
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Salon<span className="gradient-text">Shop</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/65 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-glow-teal"
            >
              Get started free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-surface-950/95 backdrop-blur-2xl border-t border-white/[0.07] overflow-hidden"
          >
            <div className="page-container py-5 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-medium text-white/65 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 flex flex-col gap-2.5 border-t border-white/[0.07] pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-semibold text-white/70 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all text-center"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-bold text-base rounded-xl transition-all"
                >
                  Get started free
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
