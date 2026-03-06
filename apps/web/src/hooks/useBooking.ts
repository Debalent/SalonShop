'use client'
import { useState, useCallback } from 'react'
import type { BookingRequest } from '@/types'

interface BookingState { loading: boolean; error: string | null; bookingId: string | null }

export function useBooking() {
  const [state, setState] = useState<BookingState>({ loading: false, error: null, bookingId: null })

  const create = useCallback(async (req: BookingRequest) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res  = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setState({ loading: false, error: null, bookingId: json.data.bookingId })
      return json.data
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Booking failed'
      setState({ loading: false, error: msg, bookingId: null })
      throw e
    }
  }, [])

  return { ...state, create }
}
