'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  DollarSign, Users, Star, TrendingUp, AlertTriangle,
  Shield, CheckCircle, XCircle, Eye, Heart, Minus,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

/* ── Mock data ── */
const revenueByMonth = [
  { month: 'Sep', gmv: 48200,  fees: 964,  tips: 7200  },
  { month: 'Oct', gmv: 69000,  fees: 1380, tips: 10500 },
  { month: 'Nov', gmv: 62400,  fees: 1248, tips: 9400  },
  { month: 'Dec', gmv: 91200,  fees: 1824, tips: 13700 },
  { month: 'Jan', gmv: 81600,  fees: 1632, tips: 12200 },
  { month: 'Feb', gmv: 98800,  fees: 1976, tips: 14800 },
]

const providerFees = [
  { name: 'Alex Rivera',    gmv: 22400, fee: 448,  tips: 3360, net: 25312 },
  { name: 'Jordan Okafor',  gmv: 18600, fee: 372,  tips: 2790, net: 21018 },
  { name: 'Sofia Ramirez',  gmv: 15200, fee: 304,  tips: 2280, net: 17176 },
  { name: 'Destiny Williams',gmv: 14800, fee: 296,  tips: 2220, net: 16724 },
  { name: 'Marcus Chen',    gmv: 12900, fee: 258,  tips: 1935, net: 14577 },
  { name: 'Priya Nair',     gmv: 14900, fee: 298,  tips: 2235, net: 16837 },
]

const pendingReviews = [
  { id: 'pr1', reviewer: 'James K.',  provider: 'Destiny W.', rating: 2, body: 'Appointment ran 45 minutes late with no communication. Not great.', flagged: false },
  { id: 'pr2', reviewer: 'Amy L.',    provider: 'Alex R.',    rating: 5, body: 'Absolutely amazing as always, my hair has never looked better!',     flagged: false },
  { id: 'pr3', reviewer: 'Deleted1',  provider: 'Marcus C.',  rating: 1, body: 'Spam link <<<click here for free gift>>>',                           flagged: true },
]

const TOTAL_GMV   = revenueByMonth.reduce((s, r) => s + r.gmv,  0)
const TOTAL_FEES  = revenueByMonth.reduce((s, r) => s + r.fees, 0)
const TOTAL_TIPS  = revenueByMonth.reduce((s, r) => s + r.tips, 0)
const TOTAL_PROS  = providerFees.length

type ModAction = 'approve' | 'remove'

export default function AdminPage() {
  const [reviews,  setReviews]  = useState(pendingReviews)
  const [modDone,  setModDone]  = useState<Record<string, ModAction>>({})
  const [activeTab, setTab]     = useState<'overview' | 'fees' | 'reviews'>('overview')

  const moderate = (id: string, action: ModAction) => {
    setModDone(m => ({ ...m, [id]: action }))
    setTimeout(() => setReviews(r => r.filter(x => x.id !== id)), 600)
  }

  const tabs = [
    { key: 'overview', label: 'Platform Overview' },
    { key: 'fees',     label: 'Fee Breakdown' },
    { key: 'reviews',  label: 'Review Moderation' },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <Shield size={13} className="text-red-400" />
            </div>
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Platform Analytics</h1>
          <p className="text-white/45 text-sm mt-0.5">Revenue, fees, tips, and review moderation</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total GMV',       value: formatCurrency(TOTAL_GMV  * 100), sub: '6-month total',    color: 'text-white',      bg: 'bg-white/5',        icon: DollarSign  },
          { label: 'Platform revenue', value: formatCurrency(TOTAL_FEES * 100), sub: '2% of GMV',        color: 'text-brand-400',  bg: 'bg-brand-500/10',   icon: TrendingUp  },
          { label: 'Total tips paid',  value: formatCurrency(TOTAL_TIPS * 100), sub: '100% to providers', color: 'text-green-400',  bg: 'bg-green-500/10',   icon: Heart       },
          { label: 'Active providers', value: TOTAL_PROS,                        sub: 'paid tier',         color: 'text-purple-400', bg: 'bg-purple-500/10',  icon: Users       },
        ].map(({ label, value, sub, color, bg, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={15} className={color} />
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-0.5">{value}</p>
            <p className={`text-xs ${color}`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all',
              activeTab === t.key ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/65'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue chart */}
          <div className="card">
            <h2 className="font-display font-semibold text-white text-sm mb-6">GMV vs Platform Revenue (6 mo)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a50e0" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a50e0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#04091e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === 'gmv' ? 'GMV' : name === 'fees' ? 'Platform rev' : 'Tips']}
                />
                <Area type="monotone" dataKey="gmv"  stroke="#1a50e0" strokeWidth={2} fill="url(#gmv)" name="gmv" />
                <Area type="monotone" dataKey="fees" stroke="#22c55e" strokeWidth={2} fill="url(#fee)" name="fees" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-3 justify-center">
              {[['#1a50e0','GMV'], ['#22c55e','Platform revenue'], ['#f59e0b','Tips']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-white/40">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color as string }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Tips chart */}
          <div className="card">
            <h2 className="font-display font-semibold text-white text-sm mb-4">Tips volume (not platform revenue)</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={revenueByMonth} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#04091e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Tips']} />
                <Bar dataKey="tips" fill="#22c55e" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fee breakdown tab */}
      {activeTab === 'fees' && (
        <div className="card overflow-hidden !p-0">
          <div className="p-5 border-b border-white/[0.06]">
            <h2 className="font-display font-semibold text-white">Fee breakdown by provider</h2>
            <p className="text-white/35 text-xs mt-0.5">February 2026 · 2% of gross service revenue</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {providerFees.map(p => (
              <div key={p.name} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{p.name}</p>
                </div>
                <div className="hidden sm:flex items-center gap-8 text-right">
                  <div>
                    <p className="text-white/25 text-[10px]">GMV</p>
                    <p className="text-white text-sm font-semibold">{formatCurrency(p.gmv * 100)}</p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px]">Tips</p>
                    <p className="text-green-400 text-sm font-semibold">+{formatCurrency(p.tips * 100)}</p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px]">Platform fee</p>
                    <p className="text-red-400 text-sm font-semibold">-{formatCurrency(p.fee * 100)}</p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px]">Net payout</p>
                    <p className="text-white font-bold text-sm">{formatCurrency(p.net * 100)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between">
            <span className="text-white/30 text-xs">Total platform revenue this month</span>
            <span className="font-display font-black text-xl text-brand-400">{formatCurrency(providerFees.reduce((s, p) => s + p.fee, 0) * 100)}</span>
          </div>
        </div>
      )}

      {/* Review moderation tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-yellow-400" />
            <p className="text-white/50 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''} pending moderation</p>
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-16 text-white/25">
              <CheckCircle size={32} className="mx-auto mb-3 text-green-400/50" />
              <p>All reviews cleared — nice work!</p>
            </div>
          )}

          {reviews.map(r => (
            <motion.div
              key={r.id}
              layout
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'card p-5',
                r.flagged ? 'border-red-500/25 bg-red-500/5' : 'border-white/[0.08]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={cn(s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10')} />
                      ))}
                    </div>
                    <span className="text-white text-sm font-semibold">{r.reviewer}</span>
                    <span className="text-white/30 text-xs">→ {r.provider}</span>
                    {r.flagged && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 font-bold">Flagged</span>
                    )}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">&ldquo;{r.body}&rdquo;</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => moderate(r.id, 'approve')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all"
                  >
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button
                    onClick={() => moderate(r.id, 'remove')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
                  >
                    <XCircle size={13} /> Remove
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/35 text-xs hover:text-white/55 transition-all">
                    <Eye size={13} /> Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
