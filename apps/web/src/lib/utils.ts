import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'h:mm a')
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function buildBookingUrl(slug: string, serviceId?: string): string {
  const base = `/book/${slug}`
  return serviceId ? `${base}?service=${serviceId}` : base
}

export function platformFeeFromAmount(amount: number, feePercent = 0.02): number {
  return Math.round(amount * feePercent)
}

export function providerPayoutAmount(total: number, tip: number, feePercent = 0.02): number {
  const fee = platformFeeFromAmount(total, feePercent)
  return total - fee + tip
}

export function generateQrUrl(slug: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/book/${slug}`
}

export function ratingToStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half)
}

export function maskCardNumber(last4: string, brand: string): string {
  return `${brand.charAt(0).toUpperCase() + brand.slice(1)} •••• ${last4}`
}

export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  const keys = Object.keys(data[0] || {})
  const csv = [
    keys.join(','),
    ...data.map((row) =>
      keys.map((k) => JSON.stringify(row[k] ?? '')).join(',')
    ),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
