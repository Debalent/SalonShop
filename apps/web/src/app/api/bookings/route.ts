import { NextRequest, NextResponse } from 'next/server'

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
