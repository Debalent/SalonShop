/**
 * SalonShop Venture-Grade Upgrade Script
 * Generates all new files: Prisma schema, API routes, pages, components, README
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const ROOT  = 'C:/Users/Admin/OneDrive/Documents/SalonShop'
const WEB   = `${ROOT}/apps/web`
const WSRC  = `${WEB}/src`

const mk = (p, c) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c, 'utf8'); console.log(`  ✓ ${p.replace(ROOT+'/', '')}`) }

/* ════════════════════════════════════════════════════════════
   1. PRISMA SCHEMA
════════════════════════════════════════════════════════════ */
mk(`${WEB}/prisma/schema.prisma`, `// SalonShop — Production Prisma Schema
// PostgreSQL + Stripe Connect marketplace

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────────────────────────

enum UserRole {
  CLIENT
  WORKER
  SHOP_OWNER
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum PaymentStatus {
  UNPAID
  DEPOSIT_PAID
  PAID
  REFUNDED
  PARTIALLY_REFUNDED
  DISPUTED
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED
}

enum NotificationType {
  BOOKING_CONFIRMED
  BOOKING_REMINDER
  BOOKING_CANCELLED
  PAYMENT_RECEIPT
  REVIEW_RECEIVED
  REBOOK_NUDGE
  TIP_RECEIVED
  PAYOUT_SENT
  SYSTEM
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

// ─── Core User ────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String
  role          UserRole  @default(CLIENT)
  emailVerified DateTime?
  phone         String?
  avatarUrl     String?
  timezone      String    @default("America/New_York")
  locale        String    @default("en")
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  profile           Profile?
  workerProfile     WorkerProfile?
  shopMembership    ShopWorker[]
  ownedShop         Shop?

  clientBookings    Booking[]         @relation("ClientBookings")
  workerBookings    Booking[]         @relation("WorkerBookings")
  clientPayments    Payment[]         @relation("ClientPayments")
  reviewsGiven      Review[]          @relation("ReviewsGiven")
  reviewsReceived   Review[]          @relation("ReviewsReceived")
  notifications     Notification[]
  loyaltyAccount    LoyaltyAccount?
  referrals         Referral[]        @relation("ReferralSource")
  referredBy        Referral?         @relation("ReferralTarget")
  savedWorkers      SavedWorker[]
  clientPaymentMethods SavedPaymentMethod[]
  waitlistEntries   WaitlistEntry[]
  sessions          Session[]

  @@index([email])
  @@index([role])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  userAgent    String?
  ipAddress    String?
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
}

// ─── Profile ──────────────────────────────────────────────────────────────────

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  bio             String?
  location        String?
  city            String?
  state           String?
  zipCode         String?
  latitude        Float?
  longitude       Float?
  contactPhone    String?
  website         String?
  instagram       String?
  tiktok          String?
  portfolioImages String[] // Array of storage URLs
  coverImageUrl   String?
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─── Worker Profile ───────────────────────────────────────────────────────────

model WorkerProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  slug                  String   @unique
  displayName           String
  profession            String   // "Hair Stylist", "Barber", etc.
  categories            String[] // ["Hair", "Color", "Nails"]
  yearsExperience       Int?
  specialties           String[]
  isAcceptingClients    Boolean  @default(true)
  depositPercent        Int      @default(30)   // 0-100
  cancellationHours     Int      @default(24)   // hours notice for free cancel
  instantBook           Boolean  @default(false)
  stripeAccountId       String?  @unique         // Stripe Connect account
  stripeAccountStatus   String?  // "active" | "pending" | "restricted"
  averageRating         Float    @default(0)
  totalReviews          Int      @default(0)
  totalBookings         Int      @default(0)
  isVerified            Boolean  @default(false)
  isFeatured            Boolean  @default(false)
  subscriptionTier      String   @default("free")  // "free" | "pro" | "elite"
  onboardingCompleted   Boolean  @default(false)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  services     Service[]
  availability Availability[]
  timeBlocks   TimeBlock[]

  @@index([slug])
  @@index([profession])
  @@index([averageRating])
  @@index([isAcceptingClients])
}

// ─── Services ─────────────────────────────────────────────────────────────────

model Service {
  id              String   @id @default(cuid())
  workerId        String
  workerProfile   WorkerProfile @relation(fields: [workerId], references: [id], onDelete: Cascade)
  name            String
  description     String?
  category        String
  price           Int      // cents
  durationMinutes Int
  depositPercent  Int      @default(0)
  isActive        Boolean  @default(true)
  isAddon         Boolean  @default(false)
  sortOrder       Int      @default(0)
  imageUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  bookings        Booking[]

  @@index([workerId])
  @@index([category])
  @@index([isActive])
}

// ─── Availability ─────────────────────────────────────────────────────────────

model Availability {
  id            String        @id @default(cuid())
  workerId      String
  workerProfile WorkerProfile @relation(fields: [workerId], references: [id], onDelete: Cascade)
  dayOfWeek     DayOfWeek
  startTime     String        // "09:00"
  endTime       String        // "18:00"
  isActive      Boolean       @default(true)

  @@unique([workerId, dayOfWeek])
  @@index([workerId])
}

// ─── Time Blocks (blocked-out time) ──────────────────────────────────────────

model TimeBlock {
  id            String        @id @default(cuid())
  workerId      String
  workerProfile WorkerProfile @relation(fields: [workerId], references: [id], onDelete: Cascade)
  startAt       DateTime
  endAt         DateTime
  reason        String?
  createdAt     DateTime      @default(now())

  @@index([workerId, startAt])
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

model Booking {
  id              String        @id @default(cuid())
  clientId        String
  workerId        String
  serviceId       String
  shopId          String?
  bookingDate     DateTime
  startTime       String        // "14:00"
  endTime         String        // "15:30"
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  totalAmount     Int           // cents
  depositAmount   Int           @default(0) // cents
  tipAmount       Int           @default(0) // cents
  platformFee     Int           @default(0) // cents
  workerPayout    Int           @default(0) // cents
  clientNotes     String?
  internalNotes   String?
  cancelledAt     DateTime?
  cancelReason    String?
  completedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  client    User     @relation("ClientBookings", fields: [clientId], references: [id])
  worker    User     @relation("WorkerBookings", fields: [workerId], references: [id])
  service   Service  @relation(fields: [serviceId], references: [id])
  shop      Shop?    @relation(fields: [shopId], references: [id])
  payment   Payment?
  review    Review?

  @@index([clientId])
  @@index([workerId, bookingDate])
  @@index([status])
  @@index([bookingDate])
}

// ─── Payments ─────────────────────────────────────────────────────────────────

model Payment {
  id                     String        @id @default(cuid())
  bookingId              String        @unique
  booking                Booking       @relation(fields: [bookingId], references: [id])
  clientId               String
  client                 User          @relation("ClientPayments", fields: [clientId], references: [id])
  stripePaymentIntentId  String?       @unique
  stripeChargeId         String?
  stripeTransferId       String?
  amount                 Int           // cents total charged
  depositAmount          Int           @default(0)
  tipAmount              Int           @default(0)
  platformFee            Int           @default(0)
  workerPayout           Int           @default(0)
  currency               String        @default("usd")
  status                 PaymentStatus @default(UNPAID)
  refundedAmount         Int           @default(0)
  receiptUrl             String?
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt

  @@index([clientId])
  @@index([status])
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

model Review {
  id              String       @id @default(cuid())
  bookingId       String       @unique
  booking         Booking      @relation(fields: [bookingId], references: [id])
  clientId        String
  workerId        String
  client          User         @relation("ReviewsGiven", fields: [clientId], references: [id])
  worker          User         @relation("ReviewsReceived", fields: [workerId], references: [id])
  rating          Int          // 1-5
  body            String?
  wouldBookAgain  Boolean      @default(true)
  status          ReviewStatus @default(PENDING)
  providerReply   String?
  repliedAt       DateTime?
  flaggedReason   String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([workerId, status])
  @@index([clientId])
  @@index([rating])
}

// ─── Shops ────────────────────────────────────────────────────────────────────

model Shop {
  id             String   @id @default(cuid())
  ownerId        String   @unique
  owner          User     @relation(fields: [ownerId], references: [id])
  name           String
  slug           String   @unique
  description    String?
  location       String?
  city           String?
  state          String?
  phone          String?
  website        String?
  instagram      String?
  logoUrl        String?
  coverUrl       String?
  platformFeePct Float    @default(0.10) // 10% default shop model
  workerRevShare Float    @default(0.20) // 20% to worker
  shopRevShare   Float    @default(0.70) // 70% to shop
  isActive       Boolean  @default(true)
  isVerified     Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  workers  ShopWorker[]
  bookings Booking[]

  @@index([slug])
}

model ShopWorker {
  id        String   @id @default(cuid())
  shopId    String
  workerId  String
  shop      Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  worker    User     @relation(fields: [workerId], references: [id], onDelete: Cascade)
  role      String   @default("stylist")
  isActive  Boolean  @default(true)
  joinedAt  DateTime @default(now())

  @@unique([shopId, workerId])
  @@index([shopId])
  @@index([workerId])
}

// ─── Notifications ────────────────────────────────────────────────────────────

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  title     String
  body      String
  data      Json?            // arbitrary metadata
  isRead    Boolean          @default(false)
  readAt    DateTime?
  createdAt DateTime         @default(now())

  @@index([userId, isRead])
  @@index([createdAt])
}

// ─── Saved Workers (favorites) ────────────────────────────────────────────────

model SavedWorker {
  id        String   @id @default(cuid())
  clientId  String
  workerId  String
  client    User     @relation(fields: [clientId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([clientId, workerId])
  @@index([clientId])
}

// ─── Saved Payment Methods ────────────────────────────────────────────────────

model SavedPaymentMethod {
  id                 String   @id @default(cuid())
  clientId           String
  client             User     @relation(fields: [clientId], references: [id], onDelete: Cascade)
  stripeCustomerId   String
  stripePaymentMethodId String @unique
  brand              String   // "visa" | "mastercard" | "amex"
  last4              String
  expMonth           Int
  expYear            Int
  isDefault          Boolean  @default(false)
  createdAt          DateTime @default(now())

  @@index([clientId])
}

// ─── Loyalty Program ──────────────────────────────────────────────────────────

model LoyaltyAccount {
  id              String          @id @default(cuid())
  clientId        String          @unique
  client          User            @relation(fields: [clientId], references: [id], onDelete: Cascade)
  totalPoints     Int             @default(0)
  lifetimePoints  Int             @default(0)
  tier            String          @default("bronze") // "bronze"|"silver"|"gold"|"platinum"
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  transactions    LoyaltyTransaction[]
}

model LoyaltyTransaction {
  id         String         @id @default(cuid())
  accountId  String
  account    LoyaltyAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  points     Int            // positive = earn, negative = redeem
  reason     String
  bookingId  String?
  createdAt  DateTime       @default(now())

  @@index([accountId])
}

// ─── Referrals ────────────────────────────────────────────────────────────────

model Referral {
  id           String    @id @default(cuid())
  sourceUserId String
  targetUserId String    @unique
  sourceUser   User      @relation("ReferralSource", fields: [sourceUserId], references: [id])
  targetUser   User      @relation("ReferralTarget", fields: [targetUserId], references: [id])
  code         String    @unique
  creditAmount Int       @default(1000)  // cents credit given
  isRedeemed   Boolean   @default(false)
  redeemedAt   DateTime?
  createdAt    DateTime  @default(now())

  @@index([sourceUserId])
  @@index([code])
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

model WaitlistEntry {
  id            String    @id @default(cuid())
  clientId      String
  workerId      String
  serviceId     String
  preferredDate DateTime?
  flexibleDays  Int       @default(3)
  notified      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  client        User      @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@unique([clientId, workerId, serviceId])
  @@index([workerId])
}
`)

/* ════════════════════════════════════════════════════════════
   2. .env.example
════════════════════════════════════════════════════════════ */
mk(`${WEB}/.env.example`, `# ═══════════════════════════════════════
# SalonShop — Environment Variables
# Copy to .env.local and fill in values
# ═══════════════════════════════════════

# ── App ──────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_APP_ENV=development

# ── Database (PostgreSQL) ─────────────
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/salonshop
DIRECT_URL=postgresql://USER:PASSWORD@localhost:5432/salonshop

# ── NextAuth ──────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# ── Google OAuth (optional) ───────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── Stripe ────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENT=0.10

# ── Stripe Connect ────────────────────
STRIPE_CONNECT_CLIENT_ID=ca_...

# ── AWS S3 (portfolio images) ─────────
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=salonshop-assets

# ── Cloudinary (alternative to S3) ───
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ── Resend (email) ────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@salonshop.app

# ── Twilio (SMS) ──────────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=+1...

# ── Pusher (real-time) ────────────────
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# ── Rate limiting ─────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
`)

/* ════════════════════════════════════════════════════════════
   3. Shared TypeScript types
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/types/index.ts`, `export type UserRole = 'CLIENT' | 'WORKER' | 'SHOP_OWNER' | 'ADMIN'
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
`)

/* ════════════════════════════════════════════════════════════
   4. API Routes (stubs with full type signatures)
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/app/api/auth/register/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/register
// Body: { name, email, password, role }
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    // TODO: hash password with bcrypt, save to DB via Prisma, send verification email
    // const user = await prisma.user.create({ data: { name, email, passwordHash: hash, role } })
    return NextResponse.json({ success: true, data: { message: 'Account created. Check your email.' } })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
`)

mk(`${WSRC}/app/api/workers/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// GET /api/workers?category=&city=&q=&page=&limit=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? ''
  const city     = searchParams.get('city') ?? ''
  const q        = searchParams.get('q') ?? ''
  const page     = parseInt(searchParams.get('page') ?? '1')
  const limit    = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

  // TODO: prisma.workerProfile.findMany({
  //   where: {
  //     isAcceptingClients: true,
  //     ...(category && { categories: { has: category } }),
  //     ...(city && { user: { profile: { city: { contains: city, mode: 'insensitive' } } } }),
  //   },
  //   include: { user: { include: { profile: true } }, services: true },
  //   orderBy: [{ isFeatured: 'desc' }, { averageRating: 'desc' }],
  //   skip: (page - 1) * limit,
  //   take: limit,
  // })

  return NextResponse.json({ success: true, data: { workers: [], total: 0, page, limit } })
}
`)

mk(`${WSRC}/app/api/workers/[slug]/availability/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// GET /api/workers/:slug/availability?date=2026-03-05
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const date = new URL(req.url).searchParams.get('date')
  if (!date) return NextResponse.json({ success: false, error: 'date required' }, { status: 400 })

  // TODO: 
  // 1. Load worker availability for that day-of-week
  // 2. Load existing confirmed bookings for that date
  // 3. Load time blocks (vacations/blocked time)
  // 4. Generate 30-minute slots, mark unavailable if overlapping
  
  const slots = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: true },
    { time: '10:00 AM', available: false }, // booked
    { time: '10:30 AM', available: true },
  ]
  return NextResponse.json({ success: true, data: { slots } })
}
`)

mk(`${WSRC}/app/api/bookings/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// POST /api/bookings — create booking + Stripe checkout session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serviceId, workerId, date, time, notes, tipCents = 0 } = body

    // TODO:
    // 1. Validate availability (locking slot)
    // 2. Calculate amounts: service price, deposit amount, platform fee
    // 3. Create pending Booking record
    // 4. Create Stripe PaymentIntent with transfer_data for Connect
    // 5. Return client_secret for frontend confirmation

    // Stripe Connect payment flow:
    // stripe.paymentIntents.create({
    //   amount: depositAmount + tipCents,
    //   currency: 'usd',
    //   application_fee_amount: platformFee,
    //   transfer_data: { destination: worker.stripeAccountId },
    // })

    return NextResponse.json({ success: true, data: { bookingId: 'placeholder', clientSecret: 'placeholder' } })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Booking failed' }, { status: 500 })
  }
}

// GET /api/bookings — list bookings for authenticated user
export async function GET(req: NextRequest) {
  // TODO: auth check, load bookings by role
  return NextResponse.json({ success: true, data: { bookings: [] } })
}
`)

mk(`${WSRC}/app/api/bookings/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// GET /api/bookings/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: fetch booking with includes
  return NextResponse.json({ success: true, data: null })
}

// PATCH /api/bookings/:id — cancel, reschedule, mark complete
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { action, ...data } = await req.json()
  // actions: "cancel" | "reschedule" | "complete" | "no_show"
  // TODO: auth check, status transitions, trigger notifications
  return NextResponse.json({ success: true, data: { updated: true } })
}
`)

mk(`${WSRC}/app/api/payments/webhook/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// POST /api/payments/webhook — Stripe webhook handler
// IMPORTANT: must disable body parsing for raw body access
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig     = req.headers.get('stripe-signature') ?? ''
  
  // TODO:
  // const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  // switch (event.type) {
  //   case 'payment_intent.succeeded':  → update Payment.status = PAID, Booking.paymentStatus = PAID
  //   case 'payment_intent.canceled':  → mark as cancelled
  //   case 'transfer.created':         → record worker payout
  //   case 'account.updated':          → update stripeAccountStatus
  // }
  
  return NextResponse.json({ received: true })
}
`)

mk(`${WSRC}/app/api/stripe/connect/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// POST /api/stripe/connect — begin Stripe Express onboarding
export async function POST(req: NextRequest) {
  // TODO:
  // 1. Auth check — must be WORKER or SHOP_OWNER
  // 2. Create or retrieve Stripe Connect Express account
  //    const account = await stripe.accounts.create({ type: 'express', country: 'US', capabilities: { transfers: { requested: true } } })
  // 3. Create account link
  //    const link = await stripe.accountLinks.create({ account: account.id, type: 'account_onboarding', refresh_url: ..., return_url: ... })
  // 4. Save stripeAccountId to WorkerProfile
  // 5. Return the onboarding URL
  return NextResponse.json({ success: true, data: { url: 'https://connect.stripe.com/...' } })
}

// GET /api/stripe/connect — get connect status
export async function GET(req: NextRequest) {
  // TODO: check account status via stripe.accounts.retrieve(stripeAccountId)
  return NextResponse.json({ success: true, data: { status: 'pending', chargesEnabled: false, payoutsEnabled: false } })
}
`)

mk(`${WSRC}/app/api/reviews/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// POST /api/reviews — submit a review (client only, after completed booking)
export async function POST(req: NextRequest) {
  const { bookingId, rating, body, wouldBookAgain } = await req.json()
  // TODO: verify booking is COMPLETED, client matches, no existing review
  // prisma.review.create({ data: { bookingId, clientId, workerId, rating, body, wouldBookAgain } })
  // Update WorkerProfile.averageRating, totalReviews
  return NextResponse.json({ success: true, data: { message: 'Review submitted for moderation' } })
}
`)

mk(`${WSRC}/app/api/loyalty/route.ts`, `import { NextRequest, NextResponse } from 'next/server'

// GET /api/loyalty — get loyalty account for authenticated client
export async function GET(req: NextRequest) {
  // TODO: prisma.loyaltyAccount.findUnique({ where: { clientId }, include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } } })
  return NextResponse.json({ success: true, data: { points: 0, tier: 'bronze', transactions: [] } })
}
`)

mk(`${WSRC}/app/api/referrals/route.ts`, `import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// GET /api/referrals — get referral link + stats for authenticated user
export async function GET(req: NextRequest) {
  // TODO: find or create referral record, return code + count of redemptions
  const code = nanoid(8).toUpperCase()
  return NextResponse.json({ success: true, data: { code, url: \`\${process.env.NEXT_PUBLIC_APP_URL}/join/\${code}\`, totalReferrals: 0, creditsEarned: 0 } })
}
`)

/* ════════════════════════════════════════════════════════════
   5. Shared Hooks
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/hooks/index.ts`, `export { useBooking }         from './useBooking'
export { useWorkerSearch }   from './useWorkerSearch'
export { useLoyalty }        from './useLoyalty'
export { useNotifications }  from './useNotifications'
export { useDebounce }       from './useDebounce'
`)

mk(`${WSRC}/hooks/useDebounce.ts`, `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}
`)

mk(`${WSRC}/hooks/useBooking.ts`, `'use client'
import { useState, useCallback } from 'react'
import type { BookingRequest } from '@/types'

interface BookingState { loading: boolean; error: string | null; bookingId: string | null }

export function useBooking() {
  const [state, setState] = useState<BookingState>({ loading: false, error: null, bookingId: null })

  const create = useCallback(async (req: BookingRequest) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res  = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setState({ loading: false, error: null, bookingId: json.data.bookingId })
      return json.data
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Booking failed'
      setState({ loading: false, error: msg, bookingId: null })
      throw e
    }
  }, [])

  return { ...state, create }
}
`)

mk(`${WSRC}/hooks/useWorkerSearch.ts`, `'use client'
import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'
import type { WorkerProfile } from '@/types'

interface SearchParams { q?: string; category?: string; city?: string; page?: number }

export function useWorkerSearch(params: SearchParams = {}) {
  const [workers, setWorkers]   = useState<WorkerProfile[]>([])
  const [total,   setTotal]     = useState(0)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState<string | null>(null)
  const debouncedQ = useDebounce(params.q ?? '', 350)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      setLoading(true)
      try {
        const sp = new URLSearchParams()
        if (debouncedQ)     sp.set('q',        debouncedQ)
        if (params.category) sp.set('category', params.category)
        if (params.city)     sp.set('city',     params.city)
        if (params.page)     sp.set('page',     String(params.page))
        const res  = await fetch(\`/api/workers?\${sp}\`, { signal: controller.signal })
        const json = await res.json()
        if (json.success) { setWorkers(json.data.workers); setTotal(json.data.total) }
        else setError(json.error)
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError('Search failed')
      } finally { setLoading(false) }
    }
    run()
    return () => controller.abort()
  }, [debouncedQ, params.category, params.city, params.page])

  return { workers, total, loading, error }
}
`)

mk(`${WSRC}/hooks/useLoyalty.ts`, `'use client'
import { useState, useEffect } from 'react'

interface LoyaltyData { points: number; tier: string; transactions: { points: number; reason: string; createdAt: string }[] }

export function useLoyalty() {
  const [data,    setData]    = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/loyalty')
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data) })
      .finally(() => setLoading(false))
  }, [])

  const tierProgress = () => {
    if (!data) return 0
    const thresholds = { bronze: 0, silver: 500, gold: 1500, platinum: 5000 }
    const next = { bronze: 500, silver: 1500, gold: 5000, platinum: 5000 }
    const cur  = thresholds[data.tier as keyof typeof thresholds] ?? 0
    const nxt  = next[data.tier as keyof typeof next] ?? 5000
    return Math.min(((data.points - cur) / (nxt - cur)) * 100, 100)
  }

  return { data, loading, tierProgress }
}
`)

mk(`${WSRC}/hooks/useNotifications.ts`, `'use client'
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
`)

/* ════════════════════════════════════════════════════════════
   6. Discover / Browse page
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/app/discover/page.tsx`, `import DiscoverContent from './_client'
export const metadata = { title: 'Discover Professionals — SalonShop' }
export default function DiscoverPage() { return <DiscoverContent /> }
`)

mk(`${WSRC}/app/discover/_client.tsx`, `'use client'
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
          <div className={\`absolute inset-0 opacity-20 bg-gradient-to-br \${w.avatarGrad}\`} />
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
            href={\`/book/\${w.slug}\`}
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
`)

/* ════════════════════════════════════════════════════════════
   7. Client Dashboard
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/app/(dashboard)/dashboard/client/page.tsx`, `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CalendarCheck, Heart, Star, CreditCard, Clock, RefreshCcw,
  Search, Sparkles, MapPin, TrendingUp, Gift, Users,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

const upcomingBookings = [
  { id: 'b1', worker: 'Alex Rivera', service: 'Balayage + Gloss', date: '2026-03-07', time: '10:00 AM', amount: 22000, status: 'CONFIRMED', avatar: 'AR', grad: 'from-brand-400 to-brand-600' },
  { id: 'b2', worker: 'Sofia Ramirez', service: 'Full Set Gel Nails', date: '2026-03-14', time: '2:00 PM', amount: 7500, status: 'CONFIRMED', avatar: 'SR', grad: 'from-rose-400 to-pink-600' },
]

const pastBookings = [
  { id: 'b3', worker: 'Alex Rivera', service: "Women's Cut & Style", date: '2026-02-10', amount: 8500, rating: 5 },
  { id: 'b4', worker: 'Jordan Okafor', service: "Men's Fade", date: '2026-01-28', amount: 4500, rating: 5 },
  { id: 'b5', worker: 'Destiny Williams', service: 'Silk Press', date: '2026-01-12', amount: 9000, rating: 4 },
]

const favorites = [
  { slug: 'alex-rivera',   name: 'Alex Rivera',   profession: 'Hair Stylist',   grad: 'from-brand-400 to-brand-600', initials: 'AR', rating: 4.97, nextSlot: 'Sat 11 AM' },
  { slug: 'sofiat-ramirez', name: 'Sofia Ramirez', profession: 'Nail Tech',       grad: 'from-rose-400 to-pink-600',  initials: 'SR', rating: 4.92, nextSlot: 'Fri 2 PM' },
  { slug: 'jordan-okafor', name: 'Jordan Okafor', profession: 'Master Barber',    grad: 'from-emerald-400 to-teal-600', initials: 'JO', rating: 4.99, nextSlot: 'Today 5 PM' },
]

const LOYALTY_POINTS   = 2340
const LOYALTY_TIER     = 'Silver'
const NEXT_TIER_AT     = 3000
const TIER_COLOR       = 'text-slate-400'

export default function ClientDashboard() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">My Dashboard</h1>
          <p className="text-white/45 text-sm mt-0.5">Welcome back, Alex</p>
        </div>
        <Link href="/discover" className="btn-primary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Search size={14} /> Book a service
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total bookings',  value: '18',                             sub: 'Lifetime',       icon: CalendarCheck, col: 'text-brand-400',  bg: 'bg-brand-500/10' },
          { label: 'Total spent',     value: formatCurrency(184500),           sub: 'All time',       icon: CreditCard,    col: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Saved styists',   value: favorites.length,                 sub: 'Favorites',      icon: Heart,         col: 'text-rose-400',   bg: 'bg-rose-500/10' },
          { label: 'Loyalty points',  value: LOYALTY_POINTS.toLocaleString(),  sub: \`\${LOYALTY_TIER} tier\`, icon: Gift, col: 'text-amber-400',  bg: 'bg-amber-500/10' },
        ].map(({ label, value, sub, icon: Icon, col, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className={\`w-8 h-8 rounded-lg \${bg} flex items-center justify-center mb-3\`}>
              <Icon size={15} className={col} />
            </div>
            <p className="text-white/50 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-2xl text-white mb-0.5">{value}</p>
            <p className={\`text-xs \${col}\`}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Loyalty card */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-amber-400" />
            <span className="text-white font-semibold">SalonShop Rewards</span>
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20', TIER_COLOR)}>{LOYALTY_TIER}</span>
          </div>
          <span className="text-white/35 text-xs">{LOYALTY_POINTS} pts</span>
        </div>
        <div className="mb-2 flex justify-between text-xs text-white/40">
          <span>Progress to Gold</span>
          <span>{NEXT_TIER_AT - LOYALTY_POINTS} pts away</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: \`\${(LOYALTY_POINTS / NEXT_TIER_AT) * 100}%\` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
          />
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-white/35">
          <span className="flex items-center gap-1"><Sparkles size={10} className="text-amber-400" /> 1 pt per $1 spent</span>
          <span className="flex items-center gap-1"><Gift size={10} className="text-amber-400" /> Redeem at checkout</span>
        </div>
      </div>

      {/* Upcoming / Past tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/65')}>
            {t === 'upcoming' ? 'Upcoming' : 'Past bookings'}
          </button>
        ))}
      </div>

      {/* Bookings */}
      {tab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <CalendarCheck size={32} className="mx-auto mb-3 text-white/15" />
              <p>No upcoming appointments</p>
              <Link href="/discover" className="btn-primary mt-4 inline-flex !py-2 !px-5 !text-sm">Book now</Link>
            </div>
          ) : upcomingBookings.map(b => (
            <div key={b.id} className="card flex items-center gap-4">
              <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-br', b.grad)}>{b.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{b.worker}</p>
                <p className="text-white/40 text-sm">{b.service}</p>
                <div className="flex items-center gap-3 mt-1 text-white/30 text-xs">
                  <span className="flex items-center gap-1"><Clock size={10} />{formatDate(b.date)} · {b.time}</span>
                  <span className="flex items-center gap-1"><CreditCard size={10} />{formatCurrency(b.amount)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 font-bold">Confirmed</span>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'past' && (
        <div className="space-y-3">
          {pastBookings.map(b => (
            <div key={b.id} className="card flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{b.worker}</p>
                <p className="text-white/40 text-sm">{b.service} · {formatDate(b.date)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={11} className={cn(s <= b.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10')} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-white font-semibold">{formatCurrency(b.amount)}</span>
                <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                  <RefreshCcw size={11} /> Rebook
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favorites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart size={15} className="text-rose-400" />
            <h2 className="font-display font-semibold text-white">Saved professionals</h2>
          </div>
          <Link href="/discover" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">Browse more</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {favorites.map(f => (
            <div key={f.slug} className="card flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br', f.grad)}>{f.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{f.name}</p>
                <p className="text-white/40 text-xs">{f.profession}</p>
                <p className={cn('text-xs mt-0.5', f.nextSlot.startsWith('Today') ? 'text-green-400' : 'text-white/35')}>{f.nextSlot}</p>
              </div>
              <Link href={\`/book/\${f.slug}\`} className="flex-shrink-0 text-brand-400 hover:text-brand-300">
                <CalendarCheck size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
`)

/* ════════════════════════════════════════════════════════════
   8. Loyalty & Referral dashboard widget / page
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/app/(dashboard)/dashboard/loyalty/page.tsx`, `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check, Star, Zap, Crown, TrendingUp, Users, Sparkles } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

const TIERS = [
  { name: 'Bronze',   min: 0,    max: 499,   color: 'text-amber-700',  bg: 'bg-amber-900/20',  border: 'border-amber-700/20',  perks: ['1 pt / $1 spent', 'Birthday bonus', 'Early booking access'] },
  { name: 'Silver',   min: 500,  max: 1499,  color: 'text-slate-400',  bg: 'bg-slate-700/20',  border: 'border-slate-500/20',  perks: ['1.25x points', 'Priority support', 'Free cancellation 12h'] },
  { name: 'Gold',     min: 1500, max: 4999,  color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', perks: ['1.5x points', 'Monthly $10 credit', 'Queue jump'] },
  { name: 'Platinum', min: 5000, max: 99999, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', perks: ['2x points', 'Dedicated support', 'Free add-on monthly', 'VIP events'] },
]

const HISTORY = [
  { id: 1, reason: 'Balayage appointment',  points: +220, date: 'Feb 28' },
  { id: 2, reason: 'Tip bonus (>$15)',       points: +50,  date: 'Feb 28' },
  { id: 3, reason: 'Referral — Jasmine R.', points: +200, date: 'Feb 20' },
  { id: 4, reason: 'Cut & Style',            points: +85,  date: 'Jan 28' },
  { id: 5, reason: 'Redeemed — $10 off',    points: -500, date: 'Jan 15' },
  { id: 6, reason: 'Birthday bonus',        points: +100, date: 'Jan 10' },
]

const CURRENT_POINTS = 2340
const CURRENT_TIER   = 'Silver'
const currentTier    = TIERS.find(t => t.name === CURRENT_TIER)!
const nextTier       = TIERS[TIERS.findIndex(t => t.name === CURRENT_TIER) + 1]
const progress       = (CURRENT_POINTS - currentTier.min) / ((nextTier?.min ?? currentTier.max) - currentTier.min)

const REFERRAL_CODE = 'ALEX-K3X2'
const REFERRAL_URL  = \`https://salonshop.app/join/\${REFERRAL_CODE}\`

export default function LoyaltyPage() {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(REFERRAL_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Rewards & Referrals</h1>
        <p className="text-white/45 text-sm mt-0.5">Earn points on every booking, redeem for credits</p>
      </div>

      {/* Points hero card */}
      <div className={\`rounded-2xl border p-6 \${currentTier.border} \${currentTier.bg}\`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={18} className={currentTier.color} />
              <span className={\`text-sm font-bold \${currentTier.color}\`}>{CURRENT_TIER} Member</span>
            </div>
            <p className="font-display font-black text-5xl text-white">{CURRENT_POINTS.toLocaleString()}</p>
            <p className="text-white/40 text-sm mt-1">points · ≈ {formatCurrency(Math.floor(CURRENT_POINTS / 100) * 100)} in credits</p>
          </div>
          <div className="text-right">
            <p className="text-white/30 text-xs mb-1">Lifetime earned</p>
            <p className="text-white font-bold text-lg">4,840 pts</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>{CURRENT_TIER}</span>
              <span>{nextTier.min - CURRENT_POINTS} pts to {nextTier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: \`\${progress * 100}%\` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={\`h-full rounded-full bg-gradient-to-r \${CURRENT_TIER === 'Silver' ? 'from-slate-400 to-slate-300' : CURRENT_TIER === 'Gold' ? 'from-yellow-400 to-amber-300' : 'from-purple-400 to-violet-300'}\`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tier benefits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map(tier => {
          const isCurrent = tier.name === CURRENT_TIER
          return (
            <div key={tier.name} className={cn('rounded-xl border p-4 transition-all', isCurrent ? \`\${tier.border} \${tier.bg} ring-1 ring-white/10\` : 'border-white/[0.06] bg-white/[0.02] opacity-60')}>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={14} className={tier.color} />
                <span className={\`text-sm font-bold \${tier.color}\`}>{tier.name}</span>
                {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 font-bold ml-auto">Current</span>}
              </div>
              <ul className="space-y-1.5">
                {tier.perks.map(p => (
                  <li key={p} className="flex items-center gap-1.5 text-xs text-white/50">
                    <Sparkles size={9} className={tier.color} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Referral card */}
      <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-brand-400" />
          <h2 className="font-display font-semibold text-white">Refer a friend, earn $10</h2>
        </div>
        <p className="text-white/45 text-sm mb-5">
          Give a friend $10 off their first booking. When they complete it, you get 200 bonus points ($10 credit).
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            <span className="text-white font-bold font-mono tracking-wider">{REFERRAL_CODE}</span>
            <span className="text-white/20 text-xs border-l border-white/10 pl-3 flex-1 truncate">{REFERRAL_URL}</span>
          </div>
          <button onClick={copyLink} className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all',
            copied ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-brand-500 hover:bg-brand-400 text-white'
          )}>
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy link</>}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Friends referred', value: '3' },
            { label: 'Credits earned',   value: formatCurrency(60000) },
            { label: 'Available credit', value: formatCurrency(35000) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-bold text-white text-lg">{value}</p>
              <p className="text-white/35 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points history */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-brand-400" />
            <h2 className="font-display font-semibold text-white text-sm">Points history</h2>
          </div>
        </div>
        <div className="space-y-3">
          {HISTORY.map(h => (
            <div key={h.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={\`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 \${h.points > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}\`}>
                  {h.points > 0 ? <Zap size={13} className="text-green-400" /> : <Gift size={13} className="text-red-400" />}
                </div>
                <div>
                  <p className="text-white text-sm">{h.reason}</p>
                  <p className="text-white/30 text-xs">{h.date}</p>
                </div>
              </div>
              <span className={cn('font-bold text-sm tabular-nums', h.points > 0 ? 'text-green-400' : 'text-red-400')}>
                {h.points > 0 ? '+' : ''}{h.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
`)

/* ════════════════════════════════════════════════════════════
   9. Upgrade Dashboard Layout — add client + loyalty nav
════════════════════════════════════════════════════════════ */
// We'll do this via targeted replace, not here

/* ════════════════════════════════════════════════════════════
   10. Worker Onboarding wizard
════════════════════════════════════════════════════════════ */
mk(`${WSRC}/app/onboarding/page.tsx`, `import OnboardingContent from './_client'
export const metadata = { title: 'Complete Your Profile — SalonShop' }
export default function OnboardingPage() { return <OnboardingContent /> }
`)

mk(`${WSRC}/app/onboarding/_client.tsx`, `'use client'
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
          animate={{ width: \`\${((stepIdx + 1) / totalSteps) * 100}%\` }}
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
`)

console.log('\nAll files written. Running nav layout update next...\n')
