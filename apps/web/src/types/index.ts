export type UserRole = 'CLIENT' | 'WORKER' | 'SHOP_OWNER' | 'ADMIN'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
export type PaymentStatus = 'UNPAID' | 'DEPOSIT_PAID' | 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'DISPUTED'
export type ReviewStatus  = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'
export type DayOfWeek     = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export type LoyaltyTier   = 'bronze' | 'silver' | 'gold' | 'platinum'
export type SubscriptionTier = 'free' | 'pro' | 'elite'

export interface User {
  id:           string
  email:        string
  name:         string
  role:         UserRole
  avatarUrl:    string | null
  phone:        string | null
  timezone:     string
  createdAt:    string
}

export interface WorkerProfile {
  id:                  string
  userId:              string
  slug:                string
  displayName:         string
  profession:          string
  categories:          string[]
  specialties:         string[]
  yearsExperience:     number | null
  isAcceptingClients:  boolean
  depositPercent:      number
  cancellationHours:   number
  instantBook:         boolean
  averageRating:       number
  totalReviews:        number
  totalBookings:       number
  isVerified:          boolean
  isFeatured:          boolean
  subscriptionTier:    SubscriptionTier
  stripeAccountStatus: string | null
  user:                User
}

export interface Service {
  id:              string
  workerId:        string
  name:            string
  description:     string | null
  category:        string
  price:           number    // cents
  durationMinutes: number
  depositPercent:  number
  isActive:        boolean
  isAddon:         boolean
  imageUrl:        string | null
}

export interface Booking {
  id:            string
  clientId:      string
  workerId:      string
  serviceId:     string
  bookingDate:   string
  startTime:     string
  endTime:       string
  status:        BookingStatus
  paymentStatus: PaymentStatus
  totalAmount:   number
  depositAmount: number
  tipAmount:     number
  platformFee:   number
  workerPayout:  number
  clientNotes:   string | null
  createdAt:     string
  client:        User
  worker:        User
  service:       Service
  payment?:      Payment
  review?:       Review
}

export interface Payment {
  id:                    string
  bookingId:             string
  amount:                number
  depositAmount:         number
  tipAmount:             number
  platformFee:           number
  workerPayout:          number
  currency:              string
  status:                PaymentStatus
  stripePaymentIntentId: string | null
  receiptUrl:            string | null
  createdAt:             string
}

export interface Review {
  id:             string
  bookingId:      string
  clientId:       string
  workerId:       string
  rating:         number
  body:           string | null
  wouldBookAgain: boolean
  status:         ReviewStatus
  providerReply:  string | null
  createdAt:      string
  client:         User
}

export interface Shop {
  id:             string
  ownerId:        string
  name:           string
  slug:           string
  description:    string | null
  city:           string | null
  state:          string | null
  logoUrl:        string | null
  platformFeePct: number
  workerRevShare: number
  shopRevShare:   number
  isVerified:     boolean
}

export interface LoyaltyAccount {
  id:             string
  totalPoints:    number
  lifetimePoints: number
  tier:           LoyaltyTier
}

export interface Referral {
  id:           string
  code:         string
  creditAmount: number
  isRedeemed:   boolean
  sourceUser:   User
}

// API response wrappers
export interface ApiSuccess<T> { success: true; data: T }
export interface ApiError      { success: false; error: string; code?: string }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

// Booking flow
export interface AvailableSlot   { time: string; available: boolean }
export interface BookingRequest  { serviceId: string; workerId: string; date: string; time: string; notes?: string; tipCents?: number }
export interface CheckoutSession { url: string; sessionId: string }
