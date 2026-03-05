'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2 } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

export interface OrderLine {
  label: string
  amount: number        // cents; negative = deduction
  variant?: 'normal' | 'tip' | 'fee-hidden' | 'total'
  sub?: string
}

interface OrderSummaryProps {
  lines: OrderLine[]
  showFee?: boolean   // stylist/admin only
  className?: string
}

export function OrderSummary({ lines, showFee = false, className }: OrderSummaryProps) {
  const visible = lines.filter(l => l.variant !== 'fee-hidden' || showFee)
  const total   = visible.find(l => l.variant === 'total')
  const rest    = visible.filter(l => l.variant !== 'total')

  return (
    <div className={cn('rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden', className)}>
      <div className="p-5 space-y-3">
        {rest.map(({ label, amount, variant, sub }) => (
          <div key={label} className="flex items-start gap-2">
            <div className="flex-1">
              <span className={cn('text-sm', variant === 'tip' ? 'text-green-400 font-semibold' : variant === 'fee-hidden' ? 'text-red-400' : 'text-white/65')}>
                {label}
              </span>
              {sub && <p className="text-white/25 text-xs mt-0.5">{sub}</p>}
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={amount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={cn(
                  'font-semibold text-sm tabular-nums',
                  variant === 'tip' ? 'text-green-400' : variant === 'fee-hidden' ? 'text-red-400' : 'text-white'
                )}
              >
                {amount < 0 ? '-' : ''}{formatCurrency(Math.abs(amount))}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {total && (
        <div className="border-t border-white/[0.07] px-5 py-4 flex items-center justify-between bg-white/[0.015]">
          <div>
            <p className="text-white font-bold">Total due today</p>
            {total.sub && <p className="text-white/30 text-xs">{total.sub}</p>}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={total.amount}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-display font-black text-2xl text-white tabular-nums"
            >
              {formatCurrency(total.amount)}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      <div className="px-5 py-3 bg-brand-500/5 border-t border-brand-500/10 flex items-center gap-2">
        <Shield size={13} className="text-brand-400 flex-shrink-0" />
        <p className="text-white/40 text-xs">Payments secured by Stripe · Tips go 100% to your stylist</p>
      </div>
    </div>
  )
}
