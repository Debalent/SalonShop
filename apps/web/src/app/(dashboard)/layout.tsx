'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, CreditCard, Users, BarChart3,
  Settings, Bell, Menu, X, LogOut, ChevronRight, Scissors, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

const providerNav = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: CalendarDays, label: 'Appointments', href: '/dashboard/appointments' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/payments' },
  { icon: Users, label: 'Clients', href: '/dashboard/clients' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Scissors, label: 'Services', href: '/dashboard/services' },
  { icon: Star, label: 'Reviews', href: '/dashboard/reviews' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-surface-950 border-r border-white/[0.06] flex flex-col transition-transform duration-300',
        'lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
              <Image src="/logo.png" alt="SalonShop" fill className="object-cover" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Salon<span className="gradient-text">Shop</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {providerNav.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={18} className={cn(isActive ? 'text-brand-400' : 'text-white/40 group-hover:text-white/70')} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Alex Rivera</p>
              <p className="text-xs text-white/40 truncate">Solo Provider · Pro</p>
            </div>
            <LogOut size={15} className="text-white/25 group-hover:text-white/50 transition-colors flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
