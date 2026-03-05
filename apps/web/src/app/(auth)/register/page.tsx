'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2, Scissors, Building2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles = [
  { id: 'client', icon: User, label: 'Client', description: 'Book appointments & manage my schedule' },
  { id: 'provider', icon: Scissors, label: 'Pro / Stylist', description: 'Accept bookings & get paid' },
  { id: 'shop', icon: Building2, label: 'Shop Owner', description: 'Manage a team of service providers' },
] as const

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<string>('provider')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const password = watch('password', '')
  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      console.log({ ...data, role: selectedRole })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10">
            <Image src="/logo.png" alt="SalonShop" fill className="object-contain" />
          </div>
          <span className="font-display font-bold text-2xl text-white">
            Salon<span className="gradient-text">Shop</span>
          </span>
        </Link>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Create your account</h1>
        <p className="text-white/50">Free 14-day trial · No credit card required</p>
      </div>

      <div className="glass-card p-8">
        {/* Role Selector */}
        <div className="mb-7">
          <label className="block text-white/70 text-sm font-medium mb-3">I am a...</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map(({ id, icon: Icon, label, description }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedRole(id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-center',
                  selectedRole === id
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
                    : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                )}
              >
                <Icon size={18} />
                <span className="text-xs font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
          <p className="text-white/35 text-xs mt-2 text-center">
            {roles.find((r) => r.id === selectedRole)?.description}
          </p>
        </div>

        {/* OAuth */}
        <div className="flex gap-3 mb-6">
          <button type="button" className="btn-secondary flex-1 justify-center gap-2 !text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button type="button" className="btn-secondary flex-1 justify-center gap-2 !text-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs font-medium">or with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">First name</label>
              <input
                {...register('firstName')}
                className={cn('input-field', errors.firstName && 'border-red-500/50')}
                placeholder="Alex"
                autoComplete="given-name"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Last name</label>
              <input
                {...register('lastName')}
                className={cn('input-field', errors.lastName && 'border-red-500/50')}
                placeholder="Rivera"
                autoComplete="family-name"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Email address</label>
            <input
              {...register('email')}
              type="email"
              className={cn('input-field', errors.email && 'border-red-500/50')}
              placeholder="hello@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={cn('input-field pr-12', errors.password && 'border-red-500/50')}
                placeholder="Min 8 chars, uppercase & number"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all duration-300',
                        level <= passwordStrength.score
                          ? passwordStrength.color
                          : 'bg-white/10'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/35">{passwordStrength.label}</p>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center !py-3.5 mt-2"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-5">
          By signing up, you agree to our{' '}
          <Link href="/legal/terms" className="text-white/50 hover:text-white/70 underline">Terms</Link>
          {' '}&amp;{' '}
          <Link href="/legal/privacy" className="text-white/50 hover:text-white/70 underline">Privacy Policy</Link>
        </p>
      </div>

      <p className="text-center text-white/40 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { score: 1, label: 'Weak', color: 'bg-red-500' },
    { score: 2, label: 'Fair', color: 'bg-yellow-500' },
    { score: 3, label: 'Good', color: 'bg-blue-500' },
    { score: 4, label: 'Strong', color: 'bg-brand-500' },
  ]
  return levels[score - 1] ?? { score: 0, label: '', color: '' }
}
