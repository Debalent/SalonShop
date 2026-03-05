import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SalonShop — Booking & Payments for Beauty Pros',
    template: '%s | SalonShop',
  },
  description:
    'The financial and booking operating system for independent service professionals and shops. Secure payments, smart scheduling, and powerful analytics — all in one place.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://salonshop.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://salonshop.app',
    siteName: 'SalonShop',
    title: 'SalonShop — Booking & Payments for Beauty Pros',
    description: 'Replace Styleseat and Square Appointments with something better.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SalonShop',
    description: 'Booking & Payments for Beauty Pros',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f11' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              theme="dark"
              toastOptions={{
                classNames: {
                  toast: 'glass-card !bg-surface-800 !border-white/10',
                  title: '!text-white',
                  description: '!text-white/60',
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
