'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, SlidersHorizontal, Star, Clock, Heart,
  TrendingUp, Verified, X, ChevronDown, Scissors, Sparkles,
  Zap, Shield, Users,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

const CATEGORIES = ['All', 'Hair', 'Color', 'Nails', 'Barber', 'Esthetics', 'Massage', 'Tattoo', 'Lashes', 'Makeup']

const MOCK_WORKERS = [
  {
    id: 'w1', slug: 'alex-rivera', displayName: 'Alex Rivera', profession: 'Hair Stylist',
    city: 'Atlanta', state: 'GA', categories: ['Hair', 'Color'],
    avatarGrad: 'from-brand-400 to-brand-600', initials: 'AR',
    rating: 4.97, reviews: 312, startingAt: 7500, nextSlot: 'Wed 3:30 PM',
    isVerified: true, isFeatured: true, instantBook: true,
    specialties: ['Balayage', 'Curly cuts', 'Color correction'],
  },
  {
    id: 'w2', slug: 'destiny-williams', displayName: 'Destiny Williams', profession: 'Natural Hair Specialist',
    city: 'Atlanta', state: 'GA', categories: ['Hair', 'Nails'],
    avatarGrad: 'from-purple-400 to-pink-600', initials: 'DW',
    rating: 4.95, reviews: 198, startingAt: 6500, nextSlot: 'Thu 10:00 AM',
    isVerified: true, isFeatured: false, instantBook: true,
    specialties: ['Silk press', 'Braids', 'Alopecia care'],
  },
  {
    id: 'w3', slug: 'jordan-okafor', displayName: 'Jordan Okafor', profession: 'Master Barber',
    city: 'Decatur', state: 'GA', categories: ['Barber', 'Hair'],
    avatarGrad: 'from-emerald-400 to-teal-600', initials: 'JO',
    rating: 4.99, reviews: 441, startingAt: 4500, nextSlot: 'Today 5:00 PM',
    isVerified: true, isFeatured: true, instantBook: false,
    specialties: ['Fades', 'Beard sculpting', 'Hairline design'],
  },
  {
    id: 'w4', slug: 'sofia-ramirez', displayName: 'Sofia Ramirez', profession: 'Nail Technician',
    city: 'Atlanta', state: 'GA', categories: ['Nails'],
    avatarGrad: 'from-rose-400 to-pink-600', initials: 'SR',
    rating: 4.92, reviews: 167, startingAt: 5500, nextSlot: 'Fri 1:00 PM',
    isVerified: true, isFeatured: false, instantBook: true,
    specialties: ['Gel', 'Acrylic', 'Nail art', 'Dip powder'],
  },
  {
    id: 'w5', slug: 'priya-nair', displayName: 'Priya Nair', profession: 'Esthetician',
    city: 'Smyrna', state: 'GA', categories: ['Esthetics', 'Massage'],
    avatarGrad: 'from-amber-400 to-orange-600', initials: 'PN',
    rating: 4.88, reviews: 89, startingAt: 8000, nextSlot: 'Thu 2:30 PM',
    isVerified: false, isFeatured: false, instantBook: false,
    specialties: ['HydraFacial', 'Chemical peels', 'Dermaplaning'],
  },
  {
    id: 'w6', slug: 'marcus-chen', displayName: 'Marcus Chen', profession: 'Tattoo Artist',
    city: 'Atlanta', state: 'GA', categories: ['Tattoo'],
    avatarGrad: 'from-slate-400 to-zinc-600', initials: 'MC',
    rating: 4.96, reviews: 278, startingAt: 15000, nextSlot: 'Next Monday',
    isVerified: true, isFeatured: true, instantBook: false,
    specialties: ['Fine line', 'Japanese', 'Black & grey realism'],
  },
]

function WorkerCard({ w, saved, onSave }: { w: typeof MOCK_WORKERS[0]; saved: boolean; onSave: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
        {/* Cover/Avatar area */}
        <div className="relative h-36 bg-gradient-to-br from-surface-800 to-surface-950 overflow-hidden">
          {/* Gradient avatar */}
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${w.avatarGrad}`} />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-900/80 to-transparent" />
          {/* Large avatar */}
          <div className={cn(
            'absolute bottom-0 left-5 translate-y-1/2 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl border-2 border-surface-900 shadow-lg bg-gradient-to-br',
            w.avatarGrad
          )}>
            {w.initials}
          </div>
          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {w.instantBook && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold">
                <Zap size={9} /> Instant
              </span>
            )}
            {w.isFeatured && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 font-bold">
                <Sparkles size={9} /> Featured
              </span>
            )}
          </div>
          {/* Save button */}
          <button
            onClick={(e) => { e.preventDefault(); onSave() }}
            className={cn(
              'absolute top-3 left-3 w-7 h-7 rounded-full border flex items-center justify-center transition-all',
              saved ? 'bg-rose-500 border-rose-500 text-white' : 'bg-black/40 border-white/20 text-white/50 hover:text-white opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart size={13} className={saved ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Content */}
        <div className="pt-10 p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-white text-base">{w.displayName}</h3>
                {w.isVerified && <Shield size={13} className="text-brand-400 flex-shrink-0" />}
              </div>
              <p className="text-white/45 text-xs">{w.profession}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-white font-bold text-sm">{w.rating}</span>
              <span className="text-white/30 text-xs">({w.reviews})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-white/30 text-xs mb-3">
            <MapPin size={10} />
            {w.city}, {w.state}
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {w.specialties.slice(0, 2).map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/45">{s}</span>
            ))}
            {w.specialties.length > 2 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/25">+{w.specialties.length - 2}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/30 text-[10px]">Starting at</p>
              <p className="text-white font-bold">{formatCurrency(w.startingAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[10px]">Next available</p>
              <p className={cn('text-xs font-semibold', w.nextSlot.startsWith('Today') ? 'text-green-400' : 'text-white/70')}>{w.nextSlot}</p>
            </div>
          </div>

          <Link
            href={`/book/${w.slug}`}
            className="mt-4 w-full block text-center py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-glow-teal"
          >
            Book now
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function DiscoverContent() {
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('All')
  const [saved,    setSaved]    = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const filtered = MOCK_WORKERS.filter(w =>
    (category === 'All' || w.categories.includes(category)) &&
    (!query || w.displayName.toLowerCase().includes(query.toLowerCase()) || w.profession.toLowerCase().includes(query.toLowerCase()) || w.specialties.some(s => s.toLowerCase().includes(query.toLowerCase())))
  )

  const toggleSave = (id: string) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero search bar */}
      <div className="bg-surface-900 border-b border-white/[0.06] sticky top-0 z-30 backdrop-blur-xl">
        <div className="page-container py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search stylists, barbers, nail techs…"
                className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/25 rounded-xl text-white placeholder:text-white/25 text-sm outline-none transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/55 text-sm hover:text-white hover:border-white/20 transition-all">
              <MapPin size={14} /> Atlanta, GA <ChevronDown size={12} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all',
                showFilters ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'border-white/[0.08] bg-white/[0.04] text-white/55 hover:text-white hover:border-white/20'
              )}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all',
                  category === cat
                    ? 'bg-brand-500 border-brand-500 text-white shadow-glow-teal'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/45 hover:text-white hover:border-white/20'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/45 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span> professionals near Atlanta
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-brand-400" />
            <span className="text-white/35 text-xs">Sorted by top rated</span>
          </div>
        </div>

        {/* Featured strip */}
        {category === 'All' && !query && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-white font-semibold text-sm">Featured this week</span>
            </div>
          </div>
        )}

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(w => (
                <WorkerCard key={w.id} w={w} saved={saved.has(w.id)} onSave={() => toggleSave(w.id)} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Search size={32} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/50 font-semibold">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-white/25 text-sm mt-1">Try a different search or category</p>
              <button onClick={() => { setQuery(''); setCategory('All') }} className="mt-4 btn-secondary !py-2 !px-5 !text-sm">
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="flex justify-center mt-10">
            <button className="btn-secondary flex items-center gap-2">
              <Users size={15} /> Load more professionals
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
