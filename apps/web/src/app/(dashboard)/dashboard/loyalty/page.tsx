'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check, Star, Zap, Crown, TrendingUp, Users, Sparkles } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

const TIERS = [
  { name: 'Bronze',   min: 0,    max: 499,   color: 'text-amber-700',  bg: 'bg-amber-900/20',  border: 'border-amber-700/20',  perks: ['1 pt / $1 spent', 'Birthday bonus', 'Early booking access'] },
  { name: 'Silver',   min: 500,  max: 1499,  color: 'text-slate-400',  bg: 'bg-slate-700/20',  border: 'border-slate-500/20',  perks: ['1.25x points', 'Priority support', 'Free cancellation 12h'] },
  { name: 'Gold',     min: 1500, max: 4999,  color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', perks: ['1.5x points', 'Monthly $10 credit', 'Queue jump'] },
  { name: 'Platinum', min: 5000, max: 99999, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', perks: ['2x points', 'Dedicated support', 'Free add-on monthly', 'VIP events'] },
]

const HISTORY = [
  { id: 1, reason: 'Balayage appointment',  points: +220, date: 'Feb 28' },
  { id: 2, reason: 'Tip bonus (>$15)',       points: +50,  date: 'Feb 28' },
  { id: 3, reason: 'Referral — Jasmine R.', points: +200, date: 'Feb 20' },
  { id: 4, reason: 'Cut & Style',            points: +85,  date: 'Jan 28' },
  { id: 5, reason: 'Redeemed — $10 off',    points: -500, date: 'Jan 15' },
  { id: 6, reason: 'Birthday bonus',        points: +100, date: 'Jan 10' },
]

const CURRENT_POINTS = 2340
const CURRENT_TIER   = 'Silver'
const currentTier    = TIERS.find(t => t.name === CURRENT_TIER)!
const nextTier       = TIERS[TIERS.findIndex(t => t.name === CURRENT_TIER) + 1]
const progress       = (CURRENT_POINTS - currentTier.min) / ((nextTier?.min ?? currentTier.max) - currentTier.min)

const REFERRAL_CODE = 'ALEX-K3X2'
const REFERRAL_URL  = `https://salonshop.app/join/${REFERRAL_CODE}`

export default function LoyaltyPage() {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(REFERRAL_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Rewards & Referrals</h1>
        <p className="text-white/45 text-sm mt-0.5">Earn points on every booking, redeem for credits</p>
      </div>

      {/* Points hero card */}
      <div className={`rounded-2xl border p-6 ${currentTier.border} ${currentTier.bg}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={18} className={currentTier.color} />
              <span className={`text-sm font-bold ${currentTier.color}`}>{CURRENT_TIER} Member</span>
            </div>
            <p className="font-display font-black text-5xl text-white">{CURRENT_POINTS.toLocaleString()}</p>
            <p className="text-white/40 text-sm mt-1">points · ≈ {formatCurrency(Math.floor(CURRENT_POINTS / 100) * 100)} in credits</p>
          </div>
          <div className="text-right">
            <p className="text-white/30 text-xs mb-1">Lifetime earned</p>
            <p className="text-white font-bold text-lg">4,840 pts</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>{CURRENT_TIER}</span>
              <span>{nextTier.min - CURRENT_POINTS} pts to {nextTier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${CURRENT_TIER === 'Silver' ? 'from-slate-400 to-slate-300' : CURRENT_TIER === 'Gold' ? 'from-yellow-400 to-amber-300' : 'from-purple-400 to-violet-300'}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tier benefits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map(tier => {
          const isCurrent = tier.name === CURRENT_TIER
          return (
            <div key={tier.name} className={cn('rounded-xl border p-4 transition-all', isCurrent ? `${tier.border} ${tier.bg} ring-1 ring-white/10` : 'border-white/[0.06] bg-white/[0.02] opacity-60')}>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={14} className={tier.color} />
                <span className={`text-sm font-bold ${tier.color}`}>{tier.name}</span>
                {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 font-bold ml-auto">Current</span>}
              </div>
              <ul className="space-y-1.5">
                {tier.perks.map(p => (
                  <li key={p} className="flex items-center gap-1.5 text-xs text-white/50">
                    <Sparkles size={9} className={tier.color} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Referral card */}
      <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-brand-400" />
          <h2 className="font-display font-semibold text-white">Refer a friend, earn $10</h2>
        </div>
        <p className="text-white/45 text-sm mb-5">
          Give a friend $10 off their first booking. When they complete it, you get 200 bonus points ($10 credit).
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            <span className="text-white font-bold font-mono tracking-wider">{REFERRAL_CODE}</span>
            <span className="text-white/20 text-xs border-l border-white/10 pl-3 flex-1 truncate">{REFERRAL_URL}</span>
          </div>
          <button onClick={copyLink} className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all',
            copied ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-brand-500 hover:bg-brand-400 text-white'
          )}>
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy link</>}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Friends referred', value: '3' },
            { label: 'Credits earned',   value: formatCurrency(60000) },
            { label: 'Available credit', value: formatCurrency(35000) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-bold text-white text-lg">{value}</p>
              <p className="text-white/35 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points history */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-brand-400" />
            <h2 className="font-display font-semibold text-white text-sm">Points history</h2>
          </div>
        </div>
        <div className="space-y-3">
          {HISTORY.map(h => (
            <div key={h.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${h.points > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {h.points > 0 ? <Zap size={13} className="text-green-400" /> : <Gift size={13} className="text-red-400" />}
                </div>
                <div>
                  <p className="text-white text-sm">{h.reason}</p>
                  <p className="text-white/30 text-xs">{h.date}</p>
                </div>
              </div>
              <span className={cn('font-bold text-sm tabular-nums', h.points > 0 ? 'text-green-400' : 'text-red-400')}>
                {h.points > 0 ? '+' : ''}{h.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
