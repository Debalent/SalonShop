'use client'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Download, Calendar, Users, DollarSign, Clock } from 'lucide-react'
import { cn, formatCurrency, downloadCSV } from '@/lib/utils'

const revenueData = [
  { month: 'Jul', revenue: 3200, appointments: 52, newClients: 8 },
  { month: 'Aug', revenue: 4800, appointments: 71, newClients: 12 },
  { month: 'Sep', revenue: 4200, appointments: 68, newClients: 9 },
  { month: 'Oct', revenue: 5800, appointments: 84, newClients: 15 },
  { month: 'Nov', revenue: 5200, appointments: 76, newClients: 11 },
  { month: 'Dec', revenue: 7600, appointments: 102, newClients: 18 },
  { month: 'Jan', revenue: 6800, appointments: 91, newClients: 14 },
  { month: 'Feb', revenue: 8240, appointments: 119, newClients: 21 },
]

const serviceRevenue = [
  { name: 'Balayage', revenue: 3200, count: 14, color: '#14b8a6' },
  { name: 'Keratin', revenue: 1980, count: 11, color: '#8b5cf6' },
  { name: 'Highlights', revenue: 1750, count: 10, color: '#3b82f6' },
  { name: 'Cut & Style', revenue: 850, count: 10, color: '#f43f5e' },
  { name: "Men's Cut", revenue: 460, count: 10, color: '#f59e0b' },
]

const peakHours = [
  { hour: '9 AM', bookings: 8 },
  { hour: '10 AM', bookings: 18 },
  { hour: '11 AM', bookings: 14 },
  { hour: '12 PM', bookings: 5 },
  { hour: '1 PM', bookings: 12 },
  { hour: '2 PM', bookings: 20 },
  { hour: '3 PM', bookings: 24 },
  { hour: '4 PM', bookings: 16 },
  { hour: '5 PM', bookings: 9 },
]

const clientRetention = [
  { name: 'Returning', value: 87, color: '#14b8a6' },
  { name: 'New', value: 13, color: '#8b5cf6' },
]

export default function AnalyticsPage() {
  const handleExport = () => {
    downloadCSV(revenueData, 'salonshop-analytics')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Analytics</h1>
          <p className="text-white/45 text-sm mt-0.5">Last 8 months performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="btn-secondary !py-2 !px-4 !text-sm flex items-center gap-2"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Total Revenue (8mo)', value: '$45,840', change: '+31%', color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { icon: Calendar, label: 'Total Appointments', value: '663', change: '+28%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Users, label: 'New Clients', value: '108', change: '+23%', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { icon: Clock, label: 'Avg Booking Value', value: '$69.15', change: '+8%', color: 'text-coral-400', bg: 'bg-coral-500/10' },
        ].map(({ icon: Icon, label, value, change, color, bg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <span className="text-xs font-semibold text-green-400 px-2 py-1 rounded-full bg-green-500/10">
                {change}
              </span>
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-xl text-white">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-white text-lg">Revenue & Appointments</h2>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Appointments</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="appt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fill="url(#rev)" dot={false} activeDot={{ r: 4, fill: '#14b8a6' }} />
            <Area yAxisId="right" type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={2} fill="url(#appt)" dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue by service */}
        <div className="lg:col-span-2 card">
          <h2 className="font-display font-semibold text-white text-lg mb-5">Revenue by service</h2>
          <div className="space-y-3">
            {serviceRevenue.map(({ name, revenue, count, color }) => {
              const pct = Math.round((revenue / 8240) * 100)
              return (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-white/70 text-sm w-28 flex-shrink-0">{name}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <span className="text-white/50 text-xs w-8 text-right">{pct}%</span>
                  <span className="text-white text-sm font-semibold w-16 text-right">{formatCurrency(revenue)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Client retention + peak hours */}
        <div className="flex flex-col gap-5">
          <div className="card flex-1">
            <h2 className="font-display font-semibold text-white text-base mb-4">Client retention</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={80} height={80}>
                <PieChart>
                  <Pie data={clientRetention} cx="50%" cy="50%" innerRadius={25} outerRadius={38} dataKey="value" strokeWidth={0}>
                    {clientRetention.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {clientRetention.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-white/60">{name}</span>
                    <span className="font-semibold text-white ml-auto">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card flex-1">
            <h2 className="font-display font-semibold text-white text-base mb-3">Peak booking hours</h2>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={peakHours} barSize={8}>
                <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="bookings" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
