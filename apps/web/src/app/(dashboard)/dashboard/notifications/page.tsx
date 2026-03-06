'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, CalendarCheck, CreditCard, Star, Gift,
  UserPlus, AlertCircle, CheckCheck, Trash2, Settings,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type NotifKind = 'booking' | 'payment' | 'review' | 'loyalty' | 'system' | 'follow'

interface Notif {
  id: string
  kind: NotifKind
  title: string
  body: string
  time: string
  read: boolean
}

const INITIAL: Notif[] = [
  { id: 'n1',  kind: 'booking',  title: 'Booking confirmed',          body: 'Alex Rivera confirmed your Balayage + Gloss on Mar 7 at 10:00 AM.', time: '2 min ago',  read: false },
  { id: 'n2',  kind: 'payment',  title: 'Payout sent',                 body: 'Your $420.00 payout has been sent to your bank account.',          time: '1 hr ago',   read: false },
  { id: 'n3',  kind: 'review',   title: 'New review received',         body: 'Jordan left you a 5-star review: "Best fade in the city!"',       time: '3 hrs ago',  read: false },
  { id: 'n4',  kind: 'loyalty',  title: 'Loyalty tier upgraded',       body: "You've reached Gold tier — enjoy 1% platform fee from now on.",   time: '5 hrs ago',  read: false },
  { id: 'n5',  kind: 'booking',  title: 'Booking reminder',            body: 'Sofia Ramirez — Full Set Gel Nails tomorrow at 2:00 PM.',         time: '9 hrs ago',  read: true  },
  { id: 'n6',  kind: 'follow',   title: 'New follower',                body: 'Priya Nair saved your profile and may book soon.',                time: '1 day ago',  read: true  },
  { id: 'n7',  kind: 'payment',  title: 'Tip received',                body: 'Destiny tipped you $25 on her last appointment.',                 time: '1 day ago',  read: true  },
  { id: 'n8',  kind: 'review',   title: 'Reminder: leave a review',    body: 'How was your cut with Jordan Okafor? Share your experience.',     time: '2 days ago', read: true  },
  { id: 'n9',  kind: 'system',   title: 'New feature: Referrals',      body: 'Refer a friend and earn 500 loyalty points each.',               time: '3 days ago', read: true  },
  { id: 'n10', kind: 'system',   title: 'Scheduled maintenance',       body: 'SalonShop will be briefly offline Mar 10 at 2 AM ET (< 5 min).', time: '4 days ago', read: true  },
]

const KIND_META: Record<NotifKind, { icon: React.ElementType; color: string; bg: string }> = {
  booking: { icon: CalendarCheck, color: 'text-brand-400',    bg: 'bg-brand-500/15'   },
  payment: { icon: CreditCard,    color: 'text-teal-400',     bg: 'bg-teal-500/15'    },
  review:  { icon: Star,          color: 'text-amber-400',    bg: 'bg-amber-500/15'   },
  loyalty: { icon: Gift,          color: 'text-violet-400',   bg: 'bg-violet-500/15'  },
  follow:  { icon: UserPlus,      color: 'text-rose-400',     bg: 'bg-rose-500/15'    },
  system:  { icon: AlertCircle,   color: 'text-white/40',     bg: 'bg-white/[0.06]'   },
}

type Filter = 'all' | 'unread'

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL)
  const [filter, setFilter] = useState<Filter>('all')

  const visible   = filter === 'unread' ? notifs.filter(n => !n.read) : notifs
  const unreadCt  = notifs.filter(n => !n.read).length

  const markRead  = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss   = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id))
  const markAll   = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const clearAll  = () => setNotifs([])

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2.5">
            <Bell size={22} className="text-brand-400" /> Notifications
            {unreadCt > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
                {unreadCt} new
              </span>
            )}
          </h1>
          <p className="text-white/45 text-sm mt-0.5">Stay on top of bookings, payouts &amp; more</p>
        </div>
        <Link href="/dashboard/settings" className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all" title="Notification settings">
          <Settings size={18} />
        </Link>
      </div>

      {/* Filter + actions row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {(['all', 'unread'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                filter === f
                  ? 'bg-brand-500/20 text-brand-300'
                  : 'text-white/50 hover:text-white/80',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {unreadCt > 0 && (
            <button
              onClick={markAll}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          {notifs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Bell size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-white/40">
            {filter === 'unread' ? 'No unread notifications' : 'All caught up!'}
          </p>
          <p className="text-sm mt-1">New alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((n, i) => {
            const meta = KIND_META[n.kind]
            const Icon = meta.icon
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                onClick={() => markRead(n.id)}
                className={cn(
                  'group relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                  n.read
                    ? 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                    : 'border-brand-500/20 bg-brand-500/[0.05] hover:bg-brand-500/[0.08]',
                )}
              >
                {/* Unread dot */}
                {!n.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-brand-500 rounded-full" />
                )}

                {/* Icon */}
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', meta.bg)}>
                  <Icon size={16} className={meta.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className={cn('text-sm font-semibold leading-snug', n.read ? 'text-white/70' : 'text-white')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-xs text-white/30 mt-1.5">{n.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                  className="absolute top-3 right-3 p-1 text-white/20 hover:text-white/60 transition-colors rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100"
                  title="Dismiss"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
