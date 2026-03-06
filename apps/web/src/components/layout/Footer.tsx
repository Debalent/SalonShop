'use client'
import Link from 'next/link'
import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const LINKS = {
  Product: [
    { label: 'Features',       href: '#features'       },
    { label: 'Pricing',        href: '#pricing'        },
    { label: 'Demo',           href: '#demo'           },
    { label: 'Changelog',      href: '#'               },
    { label: 'Roadmap',        href: '/docs/ROADMAP'   },
  ],
  'For Pros': [
    { label: 'Get started',    href: '/onboarding'     },
    { label: 'Your booking page', href: '/dashboard'   },
    { label: 'Stripe payouts', href: '/dashboard'      },
    { label: 'Discover pros',  href: '/discover'       },
  ],
  Company: [
    { label: 'About',          href: '#'               },
    { label: 'Blog',           href: '#'               },
    { label: 'Careers',        href: '#'               },
    { label: 'Contact',        href: 'mailto:balentinetechsolutions@gmail.com' },
  ],
  Legal: [
    { label: 'Privacy policy', href: '#'  },
    { label: 'Terms of service', href: '#' },
    { label: 'Cookie policy',   href: '#'  },
  ],
}

const SOCIAL = [
  { icon: Twitter,  href: '#', label: 'Twitter'  },
  { icon: Instagram,href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn'  },
  { icon: Github,   href: 'https://github.com/debalent/SalonShop', label: 'GitHub' },
  { icon: Mail,     href: 'mailto:balentinetechsolutions@gmail.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-950">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Logo size={26}/>
              <span className="font-display font-black text-lg text-white">Salon<span className="text-brand-400">Shop</span></span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-5 max-w-xs">
              The booking, payments, and growth OS for independent beauty professionals. Built from Atlanta to the world.
            </p>
            <div className="flex gap-2.5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all">
                  <Icon size={14}/>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-white font-semibold text-sm mb-4">{section}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-white/35 hover:text-white text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} SalonShop. All rights reserved. Built by Balentine Tech Solutions.</p>
          <div className="flex items-center gap-4 text-white/20 text-xs">
            <span>v0.9 beta</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
