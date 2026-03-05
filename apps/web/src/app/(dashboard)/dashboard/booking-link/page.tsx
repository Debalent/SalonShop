'use client'
import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import {
  QrCode, Copy, Download, ExternalLink, Check,
  Share2, Smartphone, Globe, Sparkles, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'

/* ── Mock provider data (replace with real session/db data) ── */
const PROVIDER = {
  name: 'Alex Rivera',
  handle: 'alex-rivera',
  role: 'Solo Provider', // 'Shop Owner' | 'Solo Provider' — never 'Client'
  plan: 'Pro',
  specialty: 'Hair Stylist & Colorist',
  avatar: 'A',
}

const BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`
    : process.env.NEXT_PUBLIC_BASE_PATH
      ? `https://debalent.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
      : 'https://salonshop.app'

const BOOKING_URL = `${BASE_URL}/p/${PROVIDER.handle}`

/* ── QR style options ── */
type QRStyle = 'default' | 'branded' | 'minimal'

const QR_STYLES: { key: QRStyle; label: string; desc: string }[] = [
  { key: 'default',  label: 'Navy',     desc: 'Brand colors' },
  { key: 'branded',  label: 'Gradient', desc: 'Gradient fill' },
  { key: 'minimal',  label: 'B&W',      desc: 'Black & white' },
]

const QR_CONFIGS: Record<QRStyle, { fgColor: string; bgColor: string }> = {
  default:  { fgColor: '#1a50e0', bgColor: '#020510' },
  branded:  { fgColor: '#4472ee', bgColor: '#04091e' },
  minimal:  { fgColor: '#ffffff', bgColor: '#000000' },
}

const tips = [
  { icon: Smartphone, text: 'Print and display at your station or front desk' },
  { icon: Globe,      text: 'Add to your Instagram bio or link-in-bio page' },
  { icon: Share2,     text: 'Include on business cards, flyers, or menus' },
  { icon: QrCode,     text: 'Share the direct link in text messages and DMs' },
]

export default function BookingLinkPage() {
  const [qrStyle, setQrStyle]     = useState<QRStyle>('default')
  const [copied, setCopied]       = useState(false)
  const [copiedQR, setCopiedQR]   = useState(false)
  const canvasRef                  = useRef<HTMLDivElement>(null)

  /* Copy booking URL */
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(BOOKING_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [])

  /* Download QR as PNG via hidden canvas */
  const downloadQR = useCallback(() => {
    const svg = document.querySelector('#qr-svg') as SVGSVGElement | null
    if (!svg) return

    const svgData    = new XMLSerializer().serializeToString(svg)
    const svgBlob    = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url        = URL.createObjectURL(svgBlob)
    const img        = new Image()
    img.onload = () => {
      const size   = 512
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = size
      const ctx    = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)
      const link    = document.createElement('a')
      link.download = `salonshop-qr-${PROVIDER.handle}.png`
      link.href     = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = url
  }, [])

  /* Share via Web Share API if available */
  const share = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Book with ${PROVIDER.name} — SalonShop`,
        text: `Book an appointment with ${PROVIDER.name} online`,
        url: BOOKING_URL,
      })
    } else {
      copyLink()
    }
  }, [copyLink])

  const cfg = QR_CONFIGS[qrStyle]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
            <QrCode size={18} className="text-brand-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white leading-tight">
              Booking QR Code
            </h1>
            <p className="text-white/40 text-sm">
              Let clients discover and book you — instantly
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">

        {/* ── Left: URL + tips ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Booking URL card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
          >
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
              Your booking link
            </p>

            <div className="flex items-center gap-3 p-3.5 bg-surface-950 border border-white/[0.07] rounded-xl mb-4 overflow-hidden">
              <Globe size={15} className="text-brand-400 flex-shrink-0" />
              <span className="text-sm text-white/70 truncate flex-1 font-mono">
                {BOOKING_URL}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyLink}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  copied
                    ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                    : 'bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20'
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/10 text-white/65 hover:text-white hover:bg-white/[0.09] transition-all duration-200"
              >
                <ExternalLink size={14} />
                Preview page
              </a>

              <button
                onClick={share}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/10 text-white/65 hover:text-white hover:bg-white/[0.09] transition-all duration-200"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </motion.div>

          {/* Profile info */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
          >
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
              Linked profile
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {PROVIDER.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{PROVIDER.name}</p>
                <p className="text-white/45 text-sm truncate">{PROVIDER.specialty}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-semibold">
                    {PROVIDER.plan}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 font-semibold">
                    {PROVIDER.role}
                  </span>
                </div>
              </div>
              <a
                href={`/dashboard/settings`}
                className="flex items-center gap-1 text-xs text-white/35 hover:text-white/65 transition-colors"
              >
                Edit profile
                <ChevronRight size={12} />
              </a>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-yellow-400" />
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
                Get more bookings
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {tips.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-3.5 bg-surface-950/60 border border-white/[0.06] rounded-xl">
                  <Icon size={15} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-white/55 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: QR code card ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="flex flex-col"
        >
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center gap-6 sticky top-6">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest self-start">
              QR code
            </p>

            {/* Style picker */}
            <div className="flex gap-1.5 self-stretch">
              {QR_STYLES.map(s => (
                <button
                  key={s.key}
                  onClick={() => setQrStyle(s.key)}
                  className={cn(
                    'flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all',
                    qrStyle === s.key
                      ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400'
                      : 'bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/65'
                  )}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="text-[10px] opacity-60 font-normal">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* QR code display */}
            <div
              className="rounded-2xl p-5 flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: cfg.bgColor }}
              ref={canvasRef}
            >
              <QRCodeSVG
                id="qr-svg"
                value={BOOKING_URL}
                size={200}
                fgColor={cfg.fgColor}
                bgColor={cfg.bgColor}
                level="H"
                imageSettings={{
                  src: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo.png`,
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            {/* URL label */}
            <div className="text-center">
              <p className="text-white/55 text-xs font-mono truncate max-w-[260px]">
                {BOOKING_URL}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-glow-teal"
              >
                <Download size={15} />
                Download QR (PNG)
              </button>
              <button
                onClick={copyLink}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border',
                  copied
                    ? 'bg-green-500/10 border-green-500/25 text-green-400'
                    : 'bg-white/[0.05] border-white/[0.1] text-white/65 hover:bg-white/[0.1] hover:text-white'
                )}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Link copied!' : 'Copy booking link'}
              </button>
              <button
                onClick={share}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/65 hover:bg-white/[0.1] hover:text-white text-sm font-semibold transition-all"
              >
                <Share2 size={15} />
                Share
              </button>
            </div>

            <p className="text-xs text-white/25 text-center leading-relaxed">
              Scan to open your booking page.
              <br />Points to your live profile.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
