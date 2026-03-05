import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ReviewSchema = z.object({
  appointment_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(2000).optional(),
})

/** GET /api/reviews?provider_id=xxx&page=1&limit=20 */
export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = req.nextUrl

  const providerId = searchParams.get('provider_id')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const page = parseInt(searchParams.get('page') ?? '1')
  const offset = (page - 1) * limit

  let query = supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(first_name, last_name, avatar_url)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (providerId) {
    query = query.eq('provider_id', providerId)
  }

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

/** POST /api/reviews — create a review after completed appointment */
export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = ReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { appointment_id, provider_id, rating, title, body: reviewBody } = parsed.data

  // Verify appointment belongs to reviewer and is completed
  const { data: appt } = await supabase
    .from('appointments')
    .select('id, status, client_id')
    .eq('id', appointment_id)
    .eq('provider_id', provider_id)
    .single()

  if (!appt || appt.status !== 'completed') {
    return NextResponse.json({ error: 'Appointment not found or not yet completed' }, { status: 403 })
  }

  if (appt.client_id !== user.id) {
    return NextResponse.json({ error: 'You cannot review this appointment' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      appointment_id,
      reviewer_id: user.id,
      provider_id,
      rating,
      title,
      body: reviewBody,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You have already reviewed this appointment' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
