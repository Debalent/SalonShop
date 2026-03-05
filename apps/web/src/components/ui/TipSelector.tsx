'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, DollarSign, Edit3, X } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

export type TipMode = 'pct10' | 'pct15' | 'pct20' | 'custom' | 'none'

interface TipSelectorProps {
  serviceTotal: number          // in cents
  onTipChange: (tipCents: number) => void
  className?: string
}

const PRESETS: { id: TipMode; label: string; pct?: number; desc?: string }[] = [
  { id: 'pct10', label: '10%', pct: 0.10 },
  { id: 'pct15', label: '15%', pct: 0.15 },
  { id: 'pct20', label: '20%', pct: 0.20 },
  { id: 'custom', label: 'Custom', desc: 'Enter amount' },
  { id: 'none',   label: 'No tip', desc: 'Skip' },
]

export function TipSelector({ serviceTotal, onTipChange, className }: TipSelectorProps) {
  const [mode, setMode]           = useState<TipMode>('pct15')
  const [customRaw, setCustomRaw] = useState('')

  const tipFor = useCallback((m: TipMode): number => {
    const pr = PRESETS.find(p => p.id === m)
    if (pr?.pct) return Math.round(serviceTotal * pr.pct)
    if (m === 'custom') {
      const v = parseFloat(customRaw.replace(/[^\d.]/g, ''))
      return isNaN(v) ? 0 : Math.round(v * 100)
    }
    return 0
  }, [serviceTotal, customRaw])

  const select = (m: TipMode) => {
    setMode(m)
    if (m !== 'custom') onTipChange(tipFor(m))
  }

  const handleCustomInput = (val: string) => {
    setCustomRaw(val)
    const v = parseFloat(val.replace(/[^\d.]/g, ''))
    onTipChange(isNaN(v) ? 0 : Math.round(v * 100))
  }

  const activeTip = tipFor(mode)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-rose-400" />
          <span className="text-sm font-semibold text-white">Add a tip</span>
        </div>
        {mode !== 'none' && activeTip > 0 && (
          <motion.span
            key={activeTip}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-green-400"
          >
            +{formatCurrency(activeTip)}
          </motion.span>
        )}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-5 gap-2">
        {PRESETS.map((preset) => {
          const isActive = mode === preset.id
          const tipAmt   = preset.pct ? Math.round(serviceTotal * preset.pct) : null
          return (
            <motion.button
              key={preset.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => select(preset.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-3 px-1 rounded-xl border text-center transition-all duration-200',
                preset.id === 'none'
                  ? isActive
                    ? 'bg-white/[0.08] border-white/20 text-white'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/65 hover:border-white/15'
                  : isActive
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-glow-teal'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/55 hover:bg-white/[0.06] hover:border-white/15 hover:text-white'
              )}
            >
              {isActive && preset.id !== 'none' && (
                <motion.div
                  layoutId="tip-active"
                  className="absolute inset-0 rounded-xl bg-brand-500/10 border border-brand-500/30"
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="font-bold text-sm leading-tight">
                {preset.id === 'custom' ? <Edit3 size={14} /> : preset.label}
              </span>
              {tipAmt !== null && (
                <span className={cn('text-[10px] mt-0.5', isActive ? 'text-brand-400' : 'text-white/30')}>
                  {formatCurrency(tipAmt)}
                </span>
              )}
              {preset.desc && preset.id !== 'custom' && (
                <span className="text-[10px] mt-0.5 text-white/30">{preset.desc}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Custom amount input */}
      <AnimatePresence>
        {mode === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative mt-1">
              <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="number"
                placeholder="0.00"
                value={customRaw}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="w-full pl-9 pr-10 py-3 bg-white/[0.05] border border-white/10 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 rounded-xl text-white placeholder:text-white/25 text-sm outline-none transition-all"
              />
              {customRaw && (
                <button
                  type="button"
                  onClick={() => { setCustomRaw(''); onTipChange(0) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No-tip note */}
      {mode === 'none' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/30 text-xs text-center"
        >
          No tip — that&apos;s totally fine. You can always tip in person.
        </motion.p>
      )}

      {/* Explainer */}
      {mode !== 'none' && (
        <p className="text-white/25 text-xs text-center flex items-center justify-center gap-1">
          <Heart size={10} className="text-rose-400" />
          100% goes directly to your stylist
        </p>
      )}
    </div>
  )
}
