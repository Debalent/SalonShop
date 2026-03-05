import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { Instagram, Twitter, Youtube, ArrowUpRight } from 'lucide-react'

const cols = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',    href: '/#features' },
      { label: 'Pricing',     href: '/#pricing' },
      { label: 'How it works',href: '/#how-it-works' },
      { label: 'Testimonials',href: '/#testimonials' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',  href: '/legal/privacy' },
      { label: 'Terms of Service',href: '/legal/terms' },
      { label: 'Cookie Policy',   href: '/legal/cookies' },
      { label: 'Security',        href: '/security' },
    ],
  },
  {
    heading: 'Get Started',
    links: [
      { label: 'Sign up free', href: '/register' },
      { label: 'Sign in',      href: '/login' },
      { label: 'Book demo',    href: '/#pricing' },
    ],
  },
]

const socials = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter,   href: '#', label: 'Twitter / X' },
  { Icon: Youtube,   href: '#', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-950">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <Logo size={34} className="ring-1 ring-white/10 group-hover:ring-brand-500/40 transition-all" />
              <span className="font-display font-bold text-xl text-white">
                Salon<span className="gradient-text">Shop</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              The booking and payments operating system for independent beauty professionals and shops. Built different.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all duration-150"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-4">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-150 flex items-center gap-1 group"
                    >
                      {label}
                      {href.startsWith('/register') && (
                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SalonShop, Inc. All rights reserved. Proprietary intellectual property.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/30">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
