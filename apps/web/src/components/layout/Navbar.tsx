'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, ChevronDown, Bell, User, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For Shops', href: '/shops' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-brand-500/50 transition-all duration-200">
              <Image src="/logo.png" alt="SalonShop" fill className="object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Salon<span className="gradient-text">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link href="/register" className="btn-primary !py-2 !px-5 !text-sm">
              Get started free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-surface-900/95 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <div className="page-container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                <Link
                  href="/login"
                  className="px-4 py-3 text-base font-semibold text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all text-center"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
