import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  createPaymentIntent,
  createOrRetrieveCustomer,
  createSetupIntent,
  createConnectAccount,
  createAccountLink,
} from '@/lib/stripe'
import { z } from 'zod'

const paymentIntentSchema = z.object({
  appointmentId: z.string().uuid(),
  payDeposit: z.boolean().default(false),
  tip: z.number().min(0).default(0),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { appointmentId, payDeposit, tip } = paymentIntentSchema.parse(body)

    // Fetch appointment
    const { data: appt, error: apptErr } = await supabase
      .from('appointments')
      .select('*, provider:profiles!provider_id(*), service(*)')
      .eq('id', appointmentId)
      .eq('client_id', user.id)
      .single()

    if (apptErr || !appt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Ensure provider has Stripe account
    if (!appt.provider?.stripe_account_id) {
      return NextResponse.json({ error: 'Provider payment account not configured' }, { status: 422 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const customerId = await createOrRetrieveCustomer(
      user.email!,
      `${profile?.first_name} ${profile?.last_name}`,
      user.id
    )

    const baseAmount = payDeposit ? appt.deposit_amount : appt.total_amount
    const totalWithTip = baseAmount + tip

    const paymentIntent = await createPaymentIntent({
      amount: totalWithTip,
      customerId,
      connectedAccountId: appt.provider.stripe_account_id,
      metadata: {
        appointmentId,
        clientId: user.id,
        providerId: appt.provider_id,
        serviceId: appt.service_id,
        isDeposit: String(payDeposit),
        tipAmount: String(tip),
      },
    })

    // Create payment record
    await supabase.from('payments').insert({
      appointment_id: appointmentId,
      amount: baseAmount,
      deposit_amount: payDeposit ? baseAmount : 0,
      tip_amount: tip,
      platform_fee: Math.round(totalWithTip * 0.02),
      provider_payout: Math.round(totalWithTip * 0.98),
      currency: 'usd',
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id,
      metadata: { payDeposit: String(payDeposit) },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalWithTip,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Payment error'
    console.error('Payment intent error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
