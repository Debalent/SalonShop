'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, Filter, Clock, DollarSign, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

// ----------- Types -----------
type Status = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',    color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  confirmed:  { label: 'Confirmed',  color: 'bg-brand-500/15 text-brand-400 border-brand-500/20' },
  in_progress:{ label: 'In Progress',color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  completed:  { label: 'Completed',  color: 'bg-green-500/15 text-green-400 border-green-500/20' },
  cancelled:  { label: 'Cancelled',  color: 'bg-surface-700/50 text-surface-400 border-surface-600/20' },
  no_show:    { label: 'No Show',    color: 'bg-coral-500/15 text-coral-400 border-coral-500/20' },
}

// ----------- Mock data -----------
const APPOINTMENTS = [
  { id: 'a1', client: 'Maya Thompson',    service: 'Balayage + Gloss',     starts_at: '2024-11-18T09:00:00', duration: 180, total: 28000, status: 'confirmed' },
  { id: 'a2', client: 'Jasmine Reyes',    service: 'Precision Haircut',    starts_at: '2024-11-18T12:30:00', duration: 60,  total: 8500,  status: 'confirmed' },
  { id: 'a3', client: 'Nadia Williams',   service: 'Curly Cut (Dry)',       starts_at: '2024-11-18T14:00:00', duration: 75,  total: 9500,  status: 'pending' },
  { id: 'a4', client: 'Priya Laban',      service: 'Root Touch-up',         starts_at: '2024-11-17T10:00:00', duration: 90,  total: 12000, status: 'completed' },
  { id: 'a5', client: 'Aisha Coleman',    service: 'Style & Blow-dry',      starts_at: '2024-11-17T13:00:00', duration: 45,  total: 6000,  status: 'completed' },
  { id: 'a6', client: 'Bianca Torres',    service: 'Balayage + Gloss',     starts_at: '2024-11-16T11:00:00', duration: 180, total: 28000, status: 'no_show' },
  { id: 'a7', client: 'Chloe Martin',     service: 'Precision Haircut',    starts_at: '2024-11-15T15:00:00', duration: 60,  total: 8500,  status: 'cancelled' },
  { id: 'a8', client: 'Dana Kim',         service: 'Root Touch-up',         starts_at: '2024-11-14T09:30:00', duration: 90,  total: 12000, status: 'completed' },
]

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}
function formatDuration(min: number) {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60), m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
function formatDateTime(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

const FILTER_TABS: { key: Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'no_show', label: 'No Show' },
]

export default function AppointmentsPage() {
  const [activeFilter, setActiveFilter] = useState<Status>('all')
  const [search, setSearch] = useState('')

  const filtered = APPOINTMENTS.filter((a) => {
    const matchStatus = activeFilter === 'all' || a.status === activeFilter
    const matchSearch = !search || a.client.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-surface-400 text-sm mt-0.5">Manage all your bookings</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Filters + Search */}
      <div className="card p-4 space-y-4">
        {/* Status tabs */}
        <div className="flex gap-1 flex-wrap">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeFilter === key
                  ? 'bg-brand-500 text-white'
                  : 'text-surface-400 hover:text-white hover:bg-surface-700/50'
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-70">
                {key === 'all' ? APPOINTMENTS.length : APPOINTMENTS.filter(a => a.status === key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or service…"
            className="input-field pl-9 w-full max-w-xs text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700/50">
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Client</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Service</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Duration</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Status</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-surface-500">No appointments found.</td>
                </tr>
              )}
              {filtered.map((appt, i) => {
                const { date, time } = formatDateTime(appt.starts_at)
                const s = STATUS_LABELS[appt.status]
                return (
                  <motion.tr
                    key={appt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-surface-700/30 hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0">
                          {appt.client.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-white whitespace-nowrap">{appt.client}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-surface-300 whitespace-nowrap">{appt.service}</td>
                    <td className="py-3 px-4">
                      <div className="text-white">{date}</div>
                      <div className="text-surface-500 text-xs flex items-center gap-1"><Clock size={11} />{time}</div>
                    </td>
                    <td className="py-3 px-4 text-surface-400">{formatDuration(appt.duration)}</td>
                    <td className="py-3 px-4 font-semibold text-white">{formatCurrency(appt.total)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-surface-500 hover:text-brand-400 transition-colors text-xs">View</button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-700/50">
          <span className="text-surface-500 text-sm">Showing {filtered.length} of {APPOINTMENTS.length}</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-surface-700/50 text-surface-400 hover:text-white transition-colors disabled:opacity-40" disabled>
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 rounded bg-brand-500/20 text-brand-400 text-sm font-medium">1</span>
            <button className="p-1.5 rounded hover:bg-surface-700/50 text-surface-400 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
