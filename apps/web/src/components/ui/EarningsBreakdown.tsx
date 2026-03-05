'use client'
import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, Heart, Minus, TrendingUp } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

export interface EarningsData {
  grossService:  number   // cents — service total before fee
  tips:          number   // cents — 100% provider
  platformFee:   number   // cents — 2% of grossService
  net:           number   // cents — grossService - platformFee + tips
  period:        string
}

interface EarningsBreakdownProps {
  data: EarningsData
  className?: string
}

const row = (label: string, value: number, color: string, icon: React.ReactNode, sub?: string) => ({
  label, value, color, icon, sub,
})

export function EarningsBreakdown({ data, className }: EarningsBreakdownProps) {
  const rows = [
    row('Gross service revenue', data.grossService, 'text-white',      <DollarSign size={14} />, data.period),
    row('Tips earned',           data.tips,          'text-green-400',  <Heart size={14} />,       '100% yours'),
    row('Platform fee (2%)',     -data.platformFee,  'text-red-400',    <Minus size={14} />,       'SalonShop keeps'),
  ]

  return (
    <div className={cn('rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6', className)}>
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-brand-400" />
        <h3 className="font-display font-semibold text-white text-sm">Earnings Breakdown</h3>
        <span className="ml-auto text-xs text-white/30">{data.period}</span>
      </div>

      <div className="space-y-3 mb-5">
        {rows.map(({ label, value, color, icon, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/40 flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm">{label}</p>
              {sub && <p className="text-white/25 text-[11px]">{sub}</p>}
            </div>
            <span className={cn('font-bold text-sm tabular-nums', color)}>
              {value < 0 ? '-' : '+'}{formatCurrency(Math.abs(value))}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] mb-4" />

      {/* Net payout */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 rounded-xl bg-brand-500/10 border border-brand-500/25"
      >
        <div className="flex items-center gap-2">
          <ArrowRight size={16} className="text-brand-400" />
          <div>
            <p className="text-brand-300 font-bold text-sm">Net Payout</p>
            <p className="text-white/30 text-xs">After fee, including tips</p>
          </div>
        </div>
        <span className="font-display font-black text-2xl text-white tabular-nums">
          {formatCurrency(data.net)}
        </span>
      </motion.div>
    </div>
  )
}
