import { NextRequest, NextResponse } from 'next/server'

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
