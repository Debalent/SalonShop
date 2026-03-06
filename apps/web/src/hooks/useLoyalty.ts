'use client'
import { useState, useEffect } from 'react'

interface LoyaltyData { points: number; tier: string; transactions: { points: number; reason: string; createdAt: string }[] }

export function useLoyalty() {
  const [data,    setData]    = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/loyalty')
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data) })
      .finally(() => setLoading(false))
  }, [])

  const tierProgress = () => {
    if (!data) return 0
    const thresholds = { bronze: 0, silver: 500, gold: 1500, platinum: 5000 }
    const next = { bronze: 500, silver: 1500, gold: 5000, platinum: 5000 }
    const cur  = thresholds[data.tier as keyof typeof thresholds] ?? 0
    const nxt  = next[data.tier as keyof typeof next] ?? 5000
    return Math.min(((data.points - cur) / (nxt - cur)) * 100, 100)
  }

  return { data, loading, tierProgress }
}
