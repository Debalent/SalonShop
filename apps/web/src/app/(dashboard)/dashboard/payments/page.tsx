'use client'
import { motion } from 'framer-motion'
import { DollarSign, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, AlertCircle, Download, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const transactions = [
  { id: '1', client: 'Aria Johnson', service: 'Balayage', amount: 22000, tip: 3000, platform: 440, payout: 24560, date: '2026-02-28', status: 'paid' },
  { id: '2', client: 'Marcus Lee', service: "Men's Fade", amount: 4500, tip: 1000, platform: 90, payout: 5410, date: '2026-02-27', status: 'paid' },
  { id: '3', client: 'Sofia Reyes', service: 'Keratin Treatment', amount: 18000, tip: 0, platform: 360, payout: 17640, date: '2026-02-26', status: 'paid' },
  { id: '4', client: 'Dani Park', service: 'Cut & Style', amount: 8500, tip: 1500, platform: 170, payout: 9830, date: '2026-02-25', status: 'paid' },
  { id: '5', client: 'Tyler Brooks', service: 'Balayage', amount: 22000, tip: 0, platform: 440, payout: 21560, date: '2026-02-24', status: 'refunded' },
]

const payouts = [
  { id: 'po_1', amount: 154200, arrivalDate: '2026-03-06', status: 'pending', period: 'Feb 28 – Mar 5' },
  { id: 'po_2', amount: 248500, arrivalDate: '2026-02-28', status: 'paid', period: 'Feb 21 – Feb 27' },
  { id: 'po_3', amount: 189000, arrivalDate: '2026-02-21', status: 'paid', period: 'Feb 14 – Feb 20' },
]

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Payments</h1>
          <p className="text-white/45 text-sm mt-0.5">Earnings, payouts, and transaction history</p>
        </div>
        <button className="btn-secondary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Download size={15} /> Export 1099
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'This month', value: '$8,240', sub: '+18% vs last', positive: true },
          { label: 'Pending payout', value: '$1,542', sub: 'Arrives Mar 6', positive: true },
          { label: 'Lifetime earnings', value: '$45,840', sub: 'Since Oct 2024', positive: true },
          { label: 'Platform fees', value: '$245', sub: 'This month (2%)', positive: false },
        ].map(({ label, value, sub, positive }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <p className="text-white/50 text-sm mb-2">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-1">{value}</p>
            <p className={cn('text-xs', positive ? 'text-green-400' : 'text-white/35')}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Connect Stripe CTA if no account */}
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

      {/* Upcoming payouts */}
      <div className="card">
        <h2 className="font-display font-semibold text-white text-lg mb-4">Payouts</h2>
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
                <span className={cn('text-xs px-2.5 py-1 rounded-full font-semibold',
                  status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400')}>
                  {status === 'paid' ? 'Paid' : `Arriving ${formatDate(arrivalDate, 'MMM d')}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-white text-lg">Transaction history</h2>
          <button className="text-brand-400 text-sm hover:text-brand-300 transition-colors">View all</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Client', 'Service', 'Amount', 'Tip', 'Fee', 'Your Payout', 'Date', 'Status'].map((h) => (
                  <th key={h} className="pb-3 text-white/35 text-xs font-medium text-left pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {transactions.map(({ id, client, service, amount, tip, platform, payout, date, status }) => (
                <tr key={id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{client}</td>
                  <td className="py-3 pr-4 text-white/55 whitespace-nowrap">{service}</td>
                  <td className="py-3 pr-4 text-white whitespace-nowrap">{formatCurrency(amount)}</td>
                  <td className="py-3 pr-4 text-green-400 whitespace-nowrap">{tip > 0 ? `+${formatCurrency(tip)}` : '—'}</td>
                  <td className="py-3 pr-4 text-white/40 whitespace-nowrap">{formatCurrency(platform)}</td>
                  <td className="py-3 pr-4 text-white font-semibold whitespace-nowrap">{formatCurrency(payout)}</td>
                  <td className="py-3 pr-4 text-white/40 whitespace-nowrap">{formatDate(date, 'MMM d')}</td>
                  <td className="py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                      status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
