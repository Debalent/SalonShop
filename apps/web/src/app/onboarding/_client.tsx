'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Check, ChevronRight, ChevronLeft, User, Scissors, Clock,
  CreditCard, Camera, MapPin, Zap, Shield, CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'

type Step = 'role' | 'profile' | 'services' | 'availability' | 'payments' | 'done'

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'role',         label: 'Role',         icon: User       },
  { id: 'profile',      label: 'Profile',      icon: Camera     },
  { id: 'services',     label: 'Services',     icon: Scissors   },
  { id: 'availability', label: 'Hours',        icon: Clock      },
  { id: 'payments',     label: 'Payouts',      icon: CreditCard },
]

const PROFESSIONS = [
  'Hair Stylist','Barber','Nail Technician','Esthetician',
  'Makeup Artist','Lash Technician','Massage Therapist','Tattoo Artist',
  'Microblading Artist','Eyebrow Specialist','Colorist','Natural Hair Specialist',
]

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function OnboardingContent() {
  const [step,      setStep]      = useState<Step>('role')
  const [role,      setRole]      = useState<'worker' | 'shop' | null>(null)
  const [profession,setProfession]= useState('')
  const [bio,       setBio]       = useState('')
  const [location,  setLocation]  = useState('')
  const [workDays,  setWorkDays]  = useState<Set<string>>(new Set(['Mon','Tue','Wed','Thu','Fri']))

  const stepIdx   = STEPS.findIndex(s => s.id === step)
  const totalSteps = STEPS.length

  const toggleDay = (d: string) => setWorkDays(prev => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n })

  const next = () => {
    const idx = STEPS.findIndex(s => s.id === step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id)
    else setStep('done')
  }

  const back = () => {
    const idx = STEPS.findIndex(s => s.id === step)
    if (idx > 0) setStep(STEPS[idx - 1].id)
  }

  if (step === 'done') return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} className="text-green-400" />
        </motion.div>
        <h2 className="font-display font-black text-3xl text-white mb-3">You're all set!</h2>
        <p className="text-white/50 mb-8">Your profile is live. Clients can now discover and book your services 24/7.</p>
        <Link href="/dashboard" className="btn-primary">
          Go to dashboard <ChevronRight size={16} />
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-display font-bold text-white">Salon<span className="text-brand-400">Shop</span></span>
        </Link>
        <span className="text-white/30 text-sm">Step {stepIdx + 1} of {totalSteps}</span>
      </header>

      {/* Progress */}
      <div className="h-1 bg-white/[0.05]">
        <motion.div
          className="h-full bg-brand-500"
          animate={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Step tabs */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            {STEPS.map(({ id, label, icon: Icon }, i) => {
              const done   = i < stepIdx
              const active = id === step
              return (
                <div key={id} className="flex items-center gap-2">
                  <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    done   ? 'bg-green-500/15 border border-green-500/25 text-green-400' :
                    active ? 'bg-brand-500/15 border border-brand-500/25 text-brand-300' :
                             'bg-white/[0.04] border border-white/[0.07] text-white/25'
                  )}>
                    {done ? <Check size={11} /> : <Icon size={11} />}
                    <span className="hidden sm:block">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={cn('w-4 h-px', done ? 'bg-green-500/40' : 'bg-white/[0.08]')} />}
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

              {/* STEP: Role */}
              {step === 'role' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="font-display font-black text-3xl text-white mb-2">How will you use SalonShop?</h1>
                    <p className="text-white/45">We'll tailor your experience accordingly.</p>
                  </div>
                  <div className="grid gap-3">
                    {[
                      { id: 'worker', icon: Scissors, title: 'Independent professional', desc: 'You offer services solo — I own my own book.' },
                      { id: 'shop',   icon: Shield,   title: 'Shop or salon owner',       desc: 'I manage a team of workers and a location.' },
                    ].map(({ id, icon: Icon, title, desc }) => (
                      <button key={id} type="button" onClick={() => setRole(id as 'worker' | 'shop')}
                        className={cn('flex items-start gap-4 p-5 rounded-2xl border text-left transition-all',
                          role === id ? 'bg-brand-500/12 border-brand-500/40 shadow-glow-teal' : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20')}>
                        <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon size={18} className="text-brand-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{title}</p>
                          <p className="text-white/40 text-sm mt-0.5">{desc}</p>
                        </div>
                        {role === id && (
                          <div className="flex-shrink-0 ml-auto w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                            <Check size={11} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP: Profile */}
              {step === 'profile' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="font-display font-black text-3xl text-white mb-2">Build your profile</h1>
                    <p className="text-white/45">This is what clients see when they find you.</p>
                  </div>
                  {/* Avatar upload placeholder */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-brand-500/40 bg-brand-500/8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500/70 transition-all gap-1">
                      <Camera size={20} className="text-brand-400" />
                      <span className="text-brand-300 text-xs">Add photo</span>
                    </div>
                  </div>
                  {/* Profession picker */}
                  <div>
                    <label className="text-sm text-white/50 font-medium block mb-2.5">What do you do?</label>
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {PROFESSIONS.map(p => (
                        <button key={p} type="button" onClick={() => setProfession(p)}
                          className={cn('px-3 py-2.5 rounded-xl border text-sm text-left transition-all',
                            profession === p ? 'bg-brand-500/12 border-brand-500/30 text-brand-300' : 'bg-white/[0.03] border-white/[0.07] text-white/55 hover:text-white hover:border-white/15')}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm text-white/50 font-medium block mb-2">City / Location</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Atlanta, GA"
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/40 rounded-xl text-white placeholder:text-white/25 text-sm outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-white/50 font-medium block mb-2">Bio <span className="text-white/25">(optional)</span></label>
                      <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell clients what makes you unique…"
                        className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/40 rounded-xl p-3.5 text-white/70 placeholder:text-white/20 text-sm outline-none resize-none transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: Services */}
              {step === 'services' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="font-display font-black text-3xl text-white mb-2">Add your services</h1>
                    <p className="text-white/45">You can add more from your dashboard anytime.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-dashed border-brand-500/30 bg-brand-500/5">
                    <div className="grid gap-3">
                      {[
                        { name: 'Balayage', duration: '3h', price: '$220' },
                        { name: "Women's Cut & Style", duration: '1h', price: '$85' },
                      ].map((svc) => (
                        <div key={svc.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                          <Scissors size={15} className="text-brand-400 flex-shrink-0" />
                          <span className="flex-1 text-white text-sm font-semibold">{svc.name}</span>
                          <span className="text-white/35 text-xs">{svc.duration}</span>
                          <span className="text-white font-bold text-sm">{svc.price}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 py-2.5 rounded-xl border border-brand-500/30 text-brand-400 text-sm font-semibold hover:bg-brand-500/10 transition-all flex items-center justify-center gap-2">
                      + Add a service
                    </button>
                  </div>
                  <p className="text-white/25 text-xs text-center">Services are professionally listed on your public booking page.</p>
                </div>
              )}

              {/* STEP: Availability */}
              {step === 'availability' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="font-display font-black text-3xl text-white mb-2">Set your hours</h1>
                    <p className="text-white/45">Clients will only see available times.</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm font-medium mb-3">Working days</p>
                    <div className="flex gap-2">
                      {DAYS.map(day => (
                        <button key={day} type="button" onClick={() => toggleDay(day)}
                          className={cn('flex-1 py-3 rounded-xl border text-xs font-bold transition-all',
                            workDays.has(day) ? 'bg-brand-500/15 border-brand-500/30 text-brand-300' : 'bg-white/[0.03] border-white/[0.07] text-white/30 hover:text-white/55')}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Start time', 'End time'].map(label => (
                      <div key={label}>
                        <p className="text-white/50 text-sm font-medium mb-2">{label}</p>
                        <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-3 text-white text-sm outline-none appearance-none">
                          {['8:00 AM','9:00 AM','10:00 AM'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP: Payments */}
              {step === 'payments' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="font-display font-black text-3xl text-white mb-2">Connect payouts</h1>
                    <p className="text-white/45">Get paid directly to your bank via Stripe.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-brand-500/20 bg-brand-500/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center"><Zap size={18} className="text-brand-400" /></div>
                      <div>
                        <p className="text-white font-semibold">Stripe Express</p>
                        <p className="text-white/40 text-xs">2-minute setup · Payouts every 2 days</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {['Platform fee: 2% of service total','Tips: 100% to you','Deposits: collected at booking','Payouts: automatic, every 2 business days'].map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-white/55">
                          <Check size={13} className="text-brand-400 mt-0.5 flex-shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                      <Shield size={15} /> Connect with Stripe
                    </button>
                    <p className="text-white/25 text-xs text-center">Or skip for now and connect later from settings.</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between mt-8">
            <button type="button" onClick={back} disabled={stepIdx === 0}
              className={cn('flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all',
                stepIdx === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.04] border-white/10 text-white/65 hover:bg-white/[0.08] hover:text-white')}>
              <ChevronLeft size={16} /> Back
            </button>
            <button type="button" onClick={next}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-glow-teal">
              {stepIdx === STEPS.length - 1 ? 'Finish setup' : 'Continue'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
