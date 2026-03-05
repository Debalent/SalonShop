'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Star, TrendingUp, Plus, Mail, Phone, Tag, Crown } from 'lucide-react'

const CLIENTS = [
  { id: 'c1', first_name: 'Maya',    last_name: 'Thompson',  email: 'maya@example.com',    phone: '(310) 555-0101', total_visits: 18, total_spent: 216000, average_rating: 5.0, last_visit: '2024-11-10', tags: ['VIP', 'Color'], is_vip: true,  loyalty_points: 320 },
  { id: 'c2', first_name: 'Jasmine', last_name: 'Reyes',     email: 'jasmine@example.com', phone: '(310) 555-0142', total_visits: 12, total_spent: 102000, average_rating: 4.9, last_visit: '2024-11-08', tags: ['Cut'],          is_vip: false, loyalty_points: 180 },
  { id: 'c3', first_name: 'Nadia',   last_name: 'Williams',  email: 'nadia@example.com',   phone: '(310) 555-0178', total_visits: 9,  total_spent: 85500,  average_rating: 5.0, last_visit: '2024-11-05', tags: ['Curly', 'VIP'], is_vip: true,  loyalty_points: 240 },
  { id: 'c4', first_name: 'Priya',   last_name: 'Laban',     email: 'priya@example.com',   phone: '(310) 555-0190', total_visits: 6,  total_spent: 72000,  average_rating: 4.8, last_visit: '2024-10-29', tags: ['Color'],        is_vip: false, loyalty_points: 95  },
  { id: 'c5', first_name: 'Aisha',   last_name: 'Coleman',   email: 'aisha@example.com',   phone: '(310) 555-0203', total_visits: 22, total_spent: 132000, average_rating: 4.7, last_visit: '2024-10-22', tags: ['Blowout'],      is_vip: true,  loyalty_points: 410 },
  { id: 'c6', first_name: 'Bianca',  last_name: 'Torres',    email: 'bianca@example.com',  phone: '(310) 555-0224', total_visits: 3,  total_spent: 28000,  average_rating: 4.5, last_visit: '2024-10-15', tags: ['New'],          is_vip: false, loyalty_points: 40  },
]

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

const TOTAL_REVENUE = CLIENTS.reduce((s, c) => s + c.total_spent, 0)
const AVG_SPEND = Math.round(TOTAL_REVENUE / CLIENTS.length)

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [vipOnly, setVipOnly] = useState(false)

  const filtered = CLIENTS.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || c.email.includes(search.toLowerCase())
    const matchVip = !vipOnly || c.is_vip
    return matchSearch && matchVip
  }).sort((a, b) => b.total_spent - a.total_spent)

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-surface-400 text-sm mt-0.5">{CLIENTS.length} total clients</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,      label: 'Total Clients',     value: CLIENTS.length },
          { icon: Crown,      label: 'VIP Clients',       value: CLIENTS.filter(c => c.is_vip).length },
          { icon: TrendingUp, label: 'Total Revenue',     value: formatCurrency(TOTAL_REVENUE) },
          { icon: Star,       label: 'Avg Spend / Client',value: formatCurrency(AVG_SPEND) },
        ].map(({ icon: Icon, label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className="text-brand-400" />
              <span className="text-surface-500 text-xs">{label}</span>
            </div>
            <div className="text-xl font-bold text-white">{value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="input-field pl-9 w-full text-sm" />
        </div>
        <button
          onClick={() => setVipOnly(!vipOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${vipOnly ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-surface-400 hover:text-white glass-card'}`}
        >
          <Crown size={14} /> VIP Only
        </button>
      </div>

      {/* Client Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-5 hover:border-brand-500/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/30 to-coral-500/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {client.first_name[0]}{client.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{client.first_name} {client.last_name}</span>
                  {client.is_vip && <Crown size={13} className="text-amber-400 flex-shrink-0" />}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-surface-700/60 text-surface-400 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-sm mb-4">
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-surface-400 hover:text-brand-400 transition-colors">
                <Mail size={13} /><span className="truncate">{client.email}</span>
              </a>
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-surface-400 hover:text-brand-400 transition-colors">
                <Phone size={13} /><span>{client.phone}</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-700/50">
              <div className="text-center">
                <div className="font-bold text-white text-sm">{client.total_visits}</div>
                <div className="text-surface-600 text-xs">Visits</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-sm">{formatCurrency(client.total_spent)}</div>
                <div className="text-surface-600 text-xs">Spent</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-sm">{client.loyalty_points}</div>
                <div className="text-surface-600 text-xs">Points</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
