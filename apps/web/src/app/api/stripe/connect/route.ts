import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createConnectAccount, createAccountLink } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id, email, role')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  if (!['provider', 'shop_owner'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only providers can connect Stripe' }, { status: 403 })
  }

  let accountId = profile.stripe_account_id

  if (!accountId) {
    accountId = await createConnectAccount(profile.email ?? user.email!)
    await supabase
      .from('profiles')
      .update({ stripe_account_id: accountId })
      .eq('id', user.id)
  }

  const url = await createAccountLink(accountId)
  return NextResponse.json({ url })
}
