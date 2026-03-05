import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event
  try {
    const body = await req.arrayBuffer()
    event = constructWebhookEvent(Buffer.from(body), sig)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    console.error('Webhook verification failed:', message)
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        const { appointmentId, isDeposit, tipAmount } = pi.metadata as {
          appointmentId: string
          isDeposit: string
          tipAmount: string
        }

        await supabase
          .from('payments')
          .update({
            status: 'succeeded',
            stripe_charge_id: pi.latest_charge as string,
          })
          .eq('stripe_payment_intent_id', pi.id)

        const updates: Record<string, unknown> = {
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        }
        if (isDeposit === 'true') updates.deposit_paid = true

        await supabase
          .from('appointments')
          .update(updates)
          .eq('id', appointmentId)

        // Log audit
        await supabase.from('audit_logs').insert({
          event_type: 'payment_succeeded',
          entity_type: 'appointment',
          entity_id: appointmentId,
          metadata: { paymentIntentId: pi.id, amount: pi.amount },
          timestamp: new Date().toISOString(),
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', pi.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object
        await supabase
          .from('payments')
          .update({
            status: 'refunded',
            refunded_amount: charge.amount_refunded,
          })
          .eq('stripe_charge_id', charge.id)
        break
      }

      case 'payout.paid': {
        const payout = event.data.object
        await supabase
          .from('payouts')
          .update({ status: 'paid' })
          .eq('stripe_payout_id', payout.id)
        break
      }

      case 'account.updated': {
        const account = event.data.object
        if (account.charges_enabled && account.payouts_enabled) {
          await supabase
            .from('profiles')
            .update({ stripe_onboarding_complete: true })
            .eq('stripe_account_id', account.id)
        }
        break
      }

      default:
        console.log(`Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Handler error'
    console.error('Webhook handler error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
