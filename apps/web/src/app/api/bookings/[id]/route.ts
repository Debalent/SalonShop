import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export function generateStaticParams() {
  return []
}

const UpdateSchema = z.object({
  status: z.enum(['confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  internal_notes: z.string().max(2000).optional(),
  cancellation_reason: z.string().max(500).optional(),
})

/** PATCH /api/bookings/[id] */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  // Fetch appointment to verify ownership
  const { data: appt } = await supabase
    .from('appointments')
    .select('id, status, provider_id, client_id')
    .eq('id', params.id)
    .single()

  if (!appt) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

  const isProvider = appt.provider_id === user.id
  const isClient = appt.client_id === user.id

  if (!isProvider && !isClient) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Clients can only cancel pending appointments
  const { status } = parsed.data
  if (isClient && !isProvider) {
    if (status && status !== 'cancelled') {
      return NextResponse.json({ error: 'Clients may only cancel appointments' }, { status: 403 })
    }
    if (appt.status !== 'pending' && appt.status !== 'confirmed') {
      return NextResponse.json({ error: 'Appointment cannot be cancelled' }, { status: 422 })
    }
  }

  const updates: Record<string, unknown> = { ...parsed.data }
  if (status === 'cancelled') {
    updates.cancelled_at = new Date().toISOString()
    updates.cancelled_by = user.id
  }
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

/** DELETE /api/bookings/[id] — hard delete (provider only, pending/cancelled only) */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: appt } = await supabase
    .from('appointments')
    .select('id, provider_id, status')
    .eq('id', params.id)
    .single()

  if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (appt.provider_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!['pending', 'cancelled'].includes(appt.status)) {
    return NextResponse.json({ error: 'Only pending or cancelled appointments can be deleted' }, { status: 422 })
  }

  const { error } = await supabase.from('appointments').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
