import { NextRequest, NextResponse } from 'next/server'

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
