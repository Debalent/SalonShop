'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowDownLeft, Clock, Download, ExternalLink, Heart, Minus, TrendingUp, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { EarningsBreakdown } from '@/components/ui/EarningsBreakdown'

const transactions = [
  { id: '1', client: 'Aria Johnson',  service: 'Balayage',          amount: 22000,  tip: 3300,  status: 'paid',     date: '2026-02-28' },
  { id: '2', client: 'Marcus Lee',    service: "Men's Fade",         amount: 4500,   tip: 675,   status: 'paid',     date: '2026-02-27' },
  { id: '3', client: 'Sofia Reyes',   service: 'Keratin Treatment',  amount: 18000,  tip: 0,     status: 'paid',     date: '2026-02-26' },
  { id: '4', client: 'Dani Park',     service: 'Cut & Style',        amount: 8500,   tip: 1275,  status: 'paid',     date: '2026-02-25' },
  { id: '5', client: 'Tyler Brooks',  service: 'Balayage',           amount: 22000,  tip: 0,     status: 'refunded', date: '2026-02-24' },
]

const payouts = [
  { id: 'po_1', amount: 154200, arrivalDate: '2026-03-06', status: 'pending', period: 'Feb 28 – Mar 5' },
  { id: 'po_2', amount: 248500, arrivalDate: '2026-02-28', status: 'paid',    period: 'Feb 21 – Feb 27' },
  { id: 'po_3', amount: 189000, arrivalDate: '2026-02-21', status: 'paid',    period: 'Feb 14 – Feb 20' },
]

// Feb earnings — compute from transactions
const FEB_GROSS  = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)
const FEB_TIPS   = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + t.tip,    0)
const FEB_FEE    = Math.round(FEB_GROSS * 0.02)
const FEB_NET    = FEB_GROSS - FEB_FEE + FEB_TIPS

export default function PaymentsPage() {
  const [tab, setTab] = useState<'transactions' | 'payouts'>('transactions')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Payments</h1>
          <p className="text-white/45 text-sm mt-0.5">Earnings, tips, payouts, and transaction history</p>
        </div>
        <button className="btn-secondary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Download size={15} /> Export 1099
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Net this month',  value: formatCurrency(FEB_NET),   sub: '+18% vs last',     color: 'text-green-400',  bg: 'bg-green-500/10',  icon: TrendingUp },
          { label: 'Tips earned',     value: formatCurrency(FEB_TIPS),  sub: '100% yours',        color: 'text-green-400',  bg: 'bg-green-500/10',  icon: Heart },
          { label: 'Pending payout',  value: '$1,542',                   sub: 'Arrives Mar 6',    color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
          { label: 'Platform fees',   value: formatCurrency(FEB_FEE),   sub: '2% of service',    color: 'text-red-400',    bg: 'bg-red-500/10',    icon: Minus },
        ].map(({ label, value, sub, color, bg, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={15} className={color} />
            </div>
            <p className="text-white/50 text-sm mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-1">{value}</p>
            <p className={`text-xs ${color}`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Earnings breakdown */}
      <EarningsBreakdown
        data={{ grossService: FEB_GROSS, tips: FEB_TIPS, platformFee: FEB_FEE, net: FEB_NET, period: 'February 2026' }}
      />

      {/* Stripe banner */}
      <div className="glass-card p-5 border-brand-500/20 bg-brand-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <DollarSign size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Stripe Connect linked</p>
            <p className="text-white/45 text-xs">acct_•••• 3892 · Express account</p>
          </div>
        </div>
        <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-brand-400 text-sm font-semibold hover:text-brand-300 transition-colors">
          Stripe Dashboard <ExternalLink size={14} />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {(['transactions', 'payouts'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all',
              tab === t ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/65'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="card overflow-hidden !p-0">
          <div className="p-5 border-b border-white/[0.06]">
            <h2 className="font-display font-semibold text-white">Transaction history</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {transactions.map(tx => {
              const fee    = Math.round(tx.amount * 0.02)
              const payout = tx.amount - fee + tx.tip
              return (
                <div key={tx.id} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    tx.status === 'paid' ? 'bg-green-500/10' : 'bg-red-500/10'
                  )}>
                    {tx.status === 'paid' ? <CheckCircle size={16} className="text-green-400" /> : <Minus size={16} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{tx.client}</p>
                    <p className="text-white/35 text-xs">{tx.service} · {formatDate(tx.date)}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-white/30 text-xs">Service</p>
                    <p className="text-white text-sm font-semibold">{formatCurrency(tx.amount)}</p>
                  </div>
                  {tx.tip > 0 && (
                    <div className="text-right hidden md:block">
                      <p className="text-white/30 text-xs">Tip</p>
                      <p className="text-green-400 text-sm font-semibold">+{formatCurrency(tx.tip)}</p>
                    </div>
                  )}
                  <div className="text-right hidden md:block">
                    <p className="text-white/30 text-xs">Fee</p>
                    <p className="text-red-400 text-sm font-semibold">-{formatCurrency(fee)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/30 text-xs">Your payout</p>
                    <p className={cn('font-bold', tx.status === 'refunded' ? 'text-red-400 line-through' : 'text-white')}>
                      {formatCurrency(payout)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Payouts */}
      {tab === 'payouts' && (
        <div className="card">
          <h2 className="font-display font-semibold text-white text-sm mb-4">Stripe payouts</h2>
          <div className="space-y-3">
            {payouts.map(({ id, amount, arrivalDate, status, period }) => (
              <div key={id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                  status === 'paid' ? 'bg-green-500/10' : 'bg-yellow-500/10')}>
                  {status === 'paid' ? <ArrowDownLeft size={16} className="text-green-400" /> : <Clock size={16} className="text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{formatCurrency(amount)}</p>
                  <p className="text-white/40 text-xs">{period}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-xs font-semibold capitalize', status === 'paid' ? 'text-green-400' : 'text-yellow-400')}>{status}</p>
                  <p className="text-white/30 text-xs">{formatDate(arrivalDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
