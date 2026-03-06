'use client'
import { useState, useEffect } from 'react'

interface Notif { id: string; type: string; title: string; body: string; isRead: boolean; createdAt: string }

export function useNotifications() {
  const [notifs,   setNotifs]   = useState<Notif[]>([])
  const [unreadCt, setUnreadCt] = useState(0)

  useEffect(() => {
    // TODO: replace with real WebSocket / Pusher channel subscription
    setNotifs([
      { id: '1', type: 'BOOKING_CONFIRMED',  title: 'Booking confirmed', body: 'Your 9:00 AM with Alex is confirmed.',     isRead: false, createdAt: new Date().toISOString() },
      { id: '2', type: 'PAYMENT_RECEIPT',    title: 'Payment received',  body: '$42 deposit received. Thank you!',         isRead: false, createdAt: new Date().toISOString() },
      { id: '3', type: 'REVIEW_RECEIVED',    title: 'New 5-star review',  body: 'Maya left you a glowing review.',          isRead: true,  createdAt: new Date().toISOString() },
    ])
    setUnreadCt(2)
  }, [])

  const markRead = (id: string) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x))
    setUnreadCt(c => Math.max(0, c - 1))
  }

  return { notifs, unreadCt, markRead }
}
