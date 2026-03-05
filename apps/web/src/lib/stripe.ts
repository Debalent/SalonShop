import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PLATFORM_FEE_PERCENT = 0.02 // 2%

export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerId,
  paymentMethodId,
  connectedAccountId,
  metadata = {},
}: {
  amount: number
  currency?: string
  customerId?: string
  paymentMethodId?: string
  connectedAccountId: string
  metadata?: Record<string, string>
}) {
  const applicationFeeAmount = Math.round(amount * PLATFORM_FEE_PERCENT)

  return stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    payment_method: paymentMethodId,
    application_fee_amount: applicationFeeAmount,
    transfer_data: { destination: connectedAccountId },
    confirm: !!paymentMethodId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirm`,
    metadata: { platform: 'salonshop', ...metadata },
    automatic_payment_methods: paymentMethodId ? undefined : { enabled: true },
  })
}

export async function createConnectAccount(email: string): Promise<string> {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    settings: {
      payouts: {
        schedule: { interval: 'daily' },
        debit_negative_balances: true,
      },
    },
  })
  return account.id
}

export async function createAccountLink(accountId: string): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/connect/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/connect/success`,
    type: 'account_onboarding',
  })
  return link.url
}

export async function createOrRetrieveCustomer(
  email: string,
  name: string,
  userId: string
): Promise<string> {
  const existing = await stripe.customers.search({
    query: `metadata['userId']:'${userId}'`,
    limit: 1,
  })
  if (existing.data.length) return existing.data[0].id
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId, platform: 'salonshop' },
  })
  return customer.id
}

export async function createSetupIntent(customerId: string): Promise<string> {
  const si = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session',
  })
  return si.client_secret!
}

export async function issueRefund(
  chargeId: string,
  amount?: number
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    charge: chargeId,
    amount,
    reason: 'requested_by_customer',
  })
}

export async function createTransfer(
  amount: number,
  destination: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Transfer> {
  return stripe.transfers.create({
    amount,
    currency: 'usd',
    destination,
    metadata: { platform: 'salonshop', ...metadata },
  })
}

export async function getPayoutBalance(accountId: string) {
  return stripe.balance.retrieve({ stripeAccount: accountId })
}

export function constructWebhookEvent(payload: Buffer, sig: string) {
  return stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
