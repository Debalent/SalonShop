import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createBookingSchema = z.object({
  providerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  addOnIds: z.array(z.string().uuid()).optional().default([]),
  startTime: z.string().datetime(),
  notes: z.string().optional(),
  payDeposit: z.boolean().default(false),
  paymentMethodId: z.string().optional(),
})

// GET /api/bookings — list bookings for logged-in user
export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const perPage = 20
  const offset = (page - 1) * perPage

  let query = supabase
    .from('appointments')
    .select('*, service(*), provider:profiles!provider_id(*), client:profiles!client_id(*), payment(*)', { count: 'exact' })
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order('start_time', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (status) query = query.eq('status', status)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data,
    count,
    page,
    perPage,
    totalPages: count ? Math.ceil(count / perPage) : 0,
  })
}

// POST /api/bookings — create a new booking
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const input = createBookingSchema.parse(body)

    // Fetch service details
    const { data: service, error: svcErr } = await supabase
      .from('services')
      .select('*')
      .eq('id', input.serviceId)
      .single()

    if (svcErr || !service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    // Calculate end time
    const startDate = new Date(input.startTime)
    const endDate = new Date(startDate.getTime() + service.duration * 60 * 1000)

    // Check availability (no overlapping appointments)
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('provider_id', input.providerId)
      .in('status', ['confirmed', 'pending', 'in_progress'])
      .or(`start_time.lt.${endDate.toISOString()},end_time.gt.${input.startTime}`)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'This time slot is no longer available' }, { status: 409 })
    }

    // Create the appointment
    const { data: appointment, error: apptErr } = await supabase
      .from('appointments')
      .insert({
        client_id: user.id,
        provider_id: input.providerId,
        service_id: input.serviceId,
        start_time: input.startTime,
        end_time: endDate.toISOString(),
        notes: input.notes,
        status: 'pending',
        total_amount: service.price,
        deposit_amount: Math.round(service.price * (service.deposit_percentage / 100)),
        deposit_paid: false,
        add_ons: input.addOnIds,
        reminder_sent: false,
        follow_up_sent: false,
      })
      .select()
      .single()

    if (apptErr) return NextResponse.json({ error: apptErr.message }, { status: 500 })

    return NextResponse.json({ data: appointment }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
