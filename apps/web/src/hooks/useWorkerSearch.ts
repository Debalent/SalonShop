'use client'
import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'
import type { WorkerProfile } from '@/types'

interface SearchParams { q?: string; category?: string; city?: string; page?: number }

export function useWorkerSearch(params: SearchParams = {}) {
  const [workers, setWorkers]   = useState<WorkerProfile[]>([])
  const [total,   setTotal]     = useState(0)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState<string | null>(null)
  const debouncedQ = useDebounce(params.q ?? '', 350)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      setLoading(true)
      try {
        const sp = new URLSearchParams()
        if (debouncedQ)     sp.set('q',        debouncedQ)
        if (params.category) sp.set('category', params.category)
        if (params.city)     sp.set('city',     params.city)
        if (params.page)     sp.set('page',     String(params.page))
        const res  = await fetch(`/api/workers?${sp}`, { signal: controller.signal })
        const json = await res.json()
        if (json.success) { setWorkers(json.data.workers); setTotal(json.data.total) }
        else setError(json.error)
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError('Search failed')
      } finally { setLoading(false) }
    }
    run()
    return () => controller.abort()
  }, [debouncedQ, params.category, params.city, params.page])

  return { workers, total, loading, error }
}
