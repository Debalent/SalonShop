'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Clock, Instagram, Globe, CheckCircle, ArrowRight, Camera } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const MOCK_PROVIDER = {
  id: 'prov_001',
  slug: 'alex-rivera',
  first_name: 'Alex',
  last_name: 'Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
  bio: 'Certified colorist and precision cutter with 8 years of experience. Specialising in lived-in blondes, balayage, and curly/natural hair care. Every client leaves confident.',
  specialty: 'Color & Precision Cuts',
  years_experience: 8,
  instagram_handle: 'alexrivera.hair',
  website_url: null,
  city: 'Los Angeles',
  state: 'CA',
  average_rating: 4.97,
  total_reviews: 243,
  total_bookings: 1840,
  response_time_minutes: 12,
  stripe_account_enabled: true,
  subscription_tier: 'pro',
  portfolio_images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
    'https://images.unsplash.com/photo-1487412947147-5cebf96bc5e9?w=400',
    'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400',
    'https://images.unsplash.com/photo-1549236177-f9b0031b9d66?w=400',
    'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400',
  ],
}

const MOCK_SERVICES = [
  { id: 's1', name: 'Balayage + Gloss',  duration_minutes: 180, price: 28000, is_popular: true,  description: 'Full balayage with a toning gloss finish.' },
  { id: 's2', name: 'Precision Haircut', duration_minutes: 60,  price: 8500,  is_popular: true,  description: 'Dry cut tailored to your face shape and texture.' },
  { id: 's3', name: 'Root Touch-up',     duration_minutes: 90,  price: 12000, is_popular: false, description: 'Single process root colour with shine treatment.' },
  { id: 's4', name: 'Curly Cut (Dry)',   duration_minutes: 75,  price: 9500,  is_popular: false, description: 'DevaCurl-inspired dry cut for curly/coily textures.' },
  { id: 's5', name: 'Style & Blow-dry',  duration_minutes: 45,  price: 6000,  is_popular: false, description: 'Shampoo, condition, and branded blow-dry finish.' },
]

const MOCK_REVIEWS = [
  { id: 'r1', reviewer_name: 'Maya T.',    rating: 5, created_at: '2024-10-15', body: 'Alex completely transformed my hair. The balayage is exactly what I had in mind — natural and sun-kissed. Booking again next month!', service: 'Balayage + Gloss' },
  { id: 'r2', reviewer_name: 'Jasmine R.', rating: 5, created_at: '2024-10-02', body: 'Best precision cut I have ever had. She really listened to what I wanted and the result was perfect. 10/10.',                          service: 'Precision Haircut' },
  { id: 'r3', reviewer_name: 'Nadia W.',   rating: 5, created_at: '2024-09-21', body: 'Finally found someone who truly understands curly hair. My curls have never looked this defined and healthy.',                          service: 'Curly Cut (Dry)' },
  { id: 'r4', reviewer_name: 'Priya L.',   rating: 4, created_at: '2024-09-10', body: 'Great experience overall. Communication was quick and the salon space feels very elevated. Will definitely return.',                     service: 'Root Touch-up' },
]

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}
function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60), m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
      ))}
    </span>
  )
}

export default function ProviderProfileContent({ params }: { params: { slug: string } }) {
  if (params.slug !== MOCK_PROVIDER.slug) {
    notFound()
  }
  const provider = MOCK_PROVIDER

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-brand-600/30 to-coral-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent" />
      </div>

      <div className="page-container pb-24">
        <div className="-mt-20 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden ring-4 ring-surface-950 shadow-xl">
                <Image src={provider.avatar_url} alt={`${provider.first_name} ${provider.last_name}`} width={144} height={144} className="object-cover w-full h-full" />
              </div>
              {provider.stripe_account_enabled && (
                <span className="absolute -bottom-2 -right-2 bg-brand-500 rounded-full p-1">
                  <CheckCircle size={16} className="text-white" />
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{provider.first_name} {provider.last_name}</h1>
                <span className="px-2 py-0.5 bg-brand-500/20 text-brand-400 rounded-full text-xs font-medium">
                  {provider.subscription_tier === 'pro' ? 'Pro' : 'Business'}
                </span>
              </div>
              <p className="text-surface-400 mb-2">{provider.specialty} · {provider.years_experience} yrs experience</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-surface-400">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-400" />{provider.city}, {provider.state}</span>
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">{provider.average_rating}</span>
                  <span>({provider.total_reviews} reviews)</span>
                </span>
                <span className="flex items-center gap-1"><Clock size={14} />Responds in ~{provider.response_time_minutes}m</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              {provider.instagram_handle && (
                <a href={`https://instagram.com/${provider.instagram_handle}`} target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2.5 glass-card rounded-xl text-surface-300 hover:text-brand-400 transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              <Link href={`/book/${provider.id}`} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                Book Now <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-lg font-semibold text-white mb-3">About</h2>
              <p className="text-surface-300 leading-relaxed">{provider.bio}</p>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Camera size={18} className="text-brand-400" /> Portfolio</h2>
                <span className="text-surface-500 text-sm">{provider.portfolio_images.length} photos</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {provider.portfolio_images.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }} className="aspect-square rounded-xl overflow-hidden bg-surface-800 cursor-pointer group">
                    <Image src={img} alt={`Portfolio ${i + 1}`} width={300} height={300} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-white">Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={provider.average_rating} size={16} />
                  <span className="text-white font-semibold">{provider.average_rating}</span>
                  <span className="text-surface-500">({provider.total_reviews})</span>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-white text-sm">{review.reviewer_name}</span>
                        <span className="ml-2 text-xs text-surface-500">{review.service}</span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="text-surface-300 text-sm leading-relaxed">{review.body}</p>
                    <p className="text-surface-600 text-xs mt-2">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
              <div className="space-y-3">
                {MOCK_SERVICES.map((service) => (
                  <div key={service.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-white text-sm">{service.name}</span>
                        {service.is_popular && <span className="px-1.5 py-0.5 bg-coral-500/20 text-coral-400 rounded text-xs">Popular</span>}
                      </div>
                      <p className="text-surface-500 text-xs truncate">{service.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-brand-400 font-semibold text-sm">{formatCurrency(service.price)}</span>
                        <span className="text-surface-600 text-xs flex items-center gap-1"><Clock size={11} />{formatDuration(service.duration_minutes)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/book/${provider.id}`} className="btn-primary w-full text-center mt-4 block">Book an Appointment</Link>
              <div className="mt-5 pt-5 border-t border-surface-700/50 grid grid-cols-2 gap-3">
                {[
                  { label: 'Bookings',     value: provider.total_bookings.toLocaleString() },
                  { label: 'Reviews',      value: provider.total_reviews },
                  { label: 'Rating',       value: `${provider.average_rating} ★` },
                  { label: 'Responds in',  value: `~${provider.response_time_minutes}m` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-2 rounded-lg bg-surface-800/50">
                    <div className="font-bold text-white text-base">{value}</div>
                    <div className="text-surface-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
