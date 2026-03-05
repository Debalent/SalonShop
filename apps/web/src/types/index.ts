// ─── User & Auth ──────────────────────────────────────────────────────────────
export type UserRole = 'client' | 'provider' | 'shop_owner' | 'shop_manager' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
  isVerified: boolean
  twoFactorEnabled: boolean
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export interface Provider {
  id: string
  userId: string
  user: User
  slug: string
  displayName: string
  bio?: string
  coverPhotoUrl?: string
  portfolioImages: string[]
  location?: Location
  travelRadius?: number
  cancellationPolicy?: string
  depositPercentage: number
  requireDeposit: boolean
  isVerified: boolean
  verifiedBadge: boolean
  rating: number
  reviewCount: number
  socialLinks?: SocialLinks
  skillTags: string[]
  hoursOfOperation: HoursOfOperation
  stripeAccountId?: string
  subscriptionTier: SubscriptionTier
  createdAt: string
}

export interface SocialLinks {
  instagram?: string
  tiktok?: string
  facebook?: string
  website?: string
}

export interface Location {
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lng: number
}

export interface HoursOfOperation {
  [day: string]: { open: string; close: string; isClosed: boolean }
}

// ─── Shop ──────────────────────────────────────────────────────────────────────
export interface Shop {
  id: string
  ownerId: string
  name: string
  slug: string
  logoUrl?: string
  coverPhotoUrl?: string
  description?: string
  location: Location
  phone?: string
  email?: string
  website?: string
  members: ShopMember[]
  rating: number
  reviewCount: number
  subscriptionTier: SubscriptionTier
  stripeAccountId?: string
  createdAt: string
}

export interface ShopMember {
  id: string
  shopId: string
  providerId: string
  provider: Provider
  role: 'owner' | 'manager' | 'worker'
  commissionRate: number
  joinedAt: string
}

// ─── Service ──────────────────────────────────────────────────────────────────
export interface Service {
  id: string
  providerId?: string
  shopId?: string
  name: string
  description?: string
  category: string
  price: number
  duration: number // minutes
  depositAmount?: number
  maxAdvanceBookingDays: number
  bufferTimeBefore: number // minutes
  bufferTimeAfter: number // minutes
  isActive: boolean
  addOns: ServiceAddOn[]
  imageUrl?: string
}

export interface ServiceAddOn {
  id: string
  name: string
  price: number
  duration: number
}

// ─── Appointment / Booking ────────────────────────────────────────────────────
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export interface Appointment {
  id: string
  clientId: string
  client: User
  providerId: string
  provider: Provider
  serviceId: string
  service: Service
  shopId?: string
  status: AppointmentStatus
  startTime: string
  endTime: string
  notes?: string
  addOns: ServiceAddOn[]
  totalAmount: number
  depositAmount: number
  depositPaid: boolean
  payment?: Payment
  reminderSent: boolean
  followUpSent: boolean
  createdAt: string
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'

export interface Payment {
  id: string
  appointmentId: string
  amount: number
  depositAmount: number
  tipAmount: number
  platformFee: number
  providerPayout: number
  currency: string
  status: PaymentStatus
  stripePaymentIntentId: string
  stripeChargeId?: string
  refundedAmount: number
  metadata: Record<string, string>
  createdAt: string
}

export interface SavedPaymentMethod {
  id: string
  userId: string
  stripePaymentMethodId: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

// ─── Payout ───────────────────────────────────────────────────────────────────
export interface Payout {
  id: string
  providerId: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  stripePayoutId: string
  arrivalDate: string
  period: { from: string; to: string }
  createdAt: string
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string
  appointmentId: string
  clientId: string
  client: User
  providerId: string
  rating: number
  comment?: string
  providerReply?: string
  isVerified: boolean
  isModerated: boolean
  createdAt: string
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string
  userId: string
  type: 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'payment_received' | 'review_received' | 'payout_sent' | 'general'
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface ProviderAnalytics {
  totalRevenue: number
  monthlyRevenue: number[]
  avgTicketValue: number
  totalAppointments: number
  completedAppointments: number
  noShowRate: number
  clientRetentionRate: number
  topServices: { service: string; count: number; revenue: number }[]
  peakBookingTimes: { hour: number; count: number }[]
  recentActivity: Appointment[]
}

export interface ShopAnalytics extends ProviderAnalytics {
  revenueByProvider: { provider: Provider; revenue: number }[]
  occupancyRate: number
  commissionEarned: number
}

// ─── Subscription ─────────────────────────────────────────────────────────────
export type SubscriptionTier = 'free' | 'pro' | 'business'

export interface SubscriptionPlan {
  id: string
  tier: SubscriptionTier
  name: string
  price: number
  billingInterval: 'monthly' | 'yearly'
  features: string[]
  maxServices: number
  maxStaff: number
  stripePriceId: string
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  perPage: number
  totalPages: number
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface BookingFormData {
  serviceId: string
  addOnIds: string[]
  date: Date
  timeSlot: TimeSlot
  notes: string
  paymentMethodId: string
  payDeposit: boolean
}
