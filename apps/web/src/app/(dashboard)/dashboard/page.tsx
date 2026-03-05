'use client'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, CalendarDays,
  Users, Star, Clock, ChevronRight, ArrowUpRight, MoreHorizontal
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

const revenueData = [
  { month: 'Sep', revenue: 4200, appointments: 68 },
  { month: 'Oct', revenue: 5800, appointments: 84 },
  { month: 'Nov', revenue: 5200, appointments: 76 },
  { month: 'Dec', revenue: 7600, appointments: 102 },
  { month: 'Jan', revenue: 6800, appointments: 91 },
  { month: 'Feb', revenue: 8240, appointments: 119 },
]

const upcomingAppointments = [
  { id: '1', client: 'Aria Johnson', service: 'Balayage + Toner', time: '10:00 AM', duration: 180, status: 'confirmed', amount: 22000 },
  { id: '2', client: 'Marcus Lee', service: "Men's Fade", time: '11:30 AM', duration: 45, status: 'confirmed', amount: 4500 },
  { id: '3', client: 'Sofia Reyes', service: 'Keratin Treatment', time: '1:00 PM', duration: 120, status: 'pending', amount: 18000 },
  { id: '4', client: 'Dani Park', service: 'Cut & Style', time: '3:30 PM', duration: 60, status: 'confirmed', amount: 8500 },
]

const stats = [
  {
    label: 'Revenue this month',
    value: '$8,240',
    change: '+18.2%',
    positive: true,
    icon: DollarSign,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
  {
    label: 'Appointments',
    value: '119',
    change: '+12.5%',
    positive: true,
    icon: CalendarDays,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Active clients',
    value: '84',
    change: '+7 this month',
    positive: true,
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Avg rating',
    value: '4.97',
    change: '+0.03 vs last month',
    positive: true,
    icon: Star,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function DashboardPage() {
  const today = new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Good morning, Alex 👋
          </h1>
          <p className="text-white/45 text-sm mt-0.5">{formatDate(today, 'EEEE, MMMM d')}</p>
        </div>
        <button className="btn-primary !py-2 !px-4 !text-sm">
          + New appointment
        </button>
      </div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {stats.map(({ label, value, change, positive, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={itemVariants} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              )}>
                {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {change}
              </div>
            </div>
            <p className="text-white/50 text-sm mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white">{value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts + Appointments */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-white text-lg">Revenue</h2>
              <p className="text-white/40 text-sm">Last 6 months</p>
            </div>
            <button className="text-white/30 hover:text-white/60 p-1.5 rounded-lg hover:bg-white/5 transition-all">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#14b8a6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
              <Tooltip
                contentStyle={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
                formatter={(v: number) => [`$${(v / 100).toFixed(2)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#14b8a6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card flex flex-col gap-4"
        >
          <h2 className="font-display font-semibold text-white text-lg">Performance</h2>
          {[
            { label: 'No-show rate', value: '2.1%', sub: '↓ 0.8% vs last month', good: true },
            { label: 'Client retention', value: '87%', sub: '↑ 4% vs last month', good: true },
            { label: 'Avg ticket', value: '$56', sub: '↑ $4 vs last month', good: true },
            { label: 'Upcoming payouts', value: '$1,840', sub: 'Arrives in 2 days', good: true },
          ].map(({ label, value, sub, good }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-white/55 text-sm">{label}</p>
                <p className={cn('text-xs mt-0.5', good ? 'text-green-400' : 'text-red-400')}>{sub}</p>
              </div>
              <span className="font-display font-bold text-lg text-white">{value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Today's Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-white text-lg">Today&apos;s appointments</h2>
            <p className="text-white/40 text-sm">{upcomingAppointments.length} scheduled</p>
          </div>
          <a href="/dashboard/appointments" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
            View all <ChevronRight size={14} />
          </a>
        </div>

        <div className="space-y-3">
          {upcomingAppointments.map(({ id, client, service, time, duration, status, amount }) => (
            <div
              key={id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-150 group cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {client.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{client}</p>
                <p className="text-white/45 text-xs truncate">{service}</p>
              </div>

              {/* Time */}
              <div className="text-center hidden sm:block">
                <p className="text-white text-sm font-medium">{time}</p>
                <p className="text-white/35 text-xs">{duration} min</p>
              </div>

              {/* Amount */}
              <div className="text-right hidden md:block">
                <p className="text-white text-sm font-semibold">{formatCurrency(amount)}</p>
              </div>

              {/* Status */}
              <span className={cn(
                'text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0',
                status === 'confirmed' ? 'bg-brand-500/15 text-brand-400' : 'bg-yellow-500/15 text-yellow-400'
              )}>
                {status}
              </span>

              <ArrowUpRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
