import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addMinutes, format, parseISO, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns'

export function generateStaticParams() {
  return []
}

/** GET /api/providers/[id]/availability?date=YYYY-MM-DD&service_id=xxx */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { searchParams } = req.nextUrl

  const dateStr = searchParams.get('date')
  const serviceId = searchParams.get('service_id')

  if (!dateStr || !serviceId) {
    return NextResponse.json({ error: 'date and service_id are required' }, { status: 400 })
  }

  // Fetch service duration
  const { data: service, error: serviceErr } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  if (serviceErr || !service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  // Fetch provider profile for buffer & hours
  const { data: providerProfile } = await supabase
    .from('provider_profiles')
    .select('booking_buffer_minutes')
    .eq('user_id', params.id)
    .single()

  const buffer = providerProfile?.booking_buffer_minutes ?? 15
  const slotDuration = service.duration_minutes + buffer

  // Fetch business hours for the target day
  const dayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as string
  const { data: hoursRecord } = await supabase
    .from('business_hours')
    .select('is_open, open_time, close_time')
    .eq('user_id', params.id)
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!hoursRecord || !hoursRecord.is_open) {
    return NextResponse.json({ slots: [] })
  }

  // Fetch existing appointments that day
  const dayStart = startOfDay(parseISO(dateStr)).toISOString()
  const dayEnd = endOfDay(parseISO(dateStr)).toISOString()

  const { data: existingAppts } = await supabase
    .from('appointments')
    .select('starts_at, ends_at')
    .eq('provider_id', params.id)
    .gte('starts_at', dayStart)
    .lte('starts_at', dayEnd)
    .in('status', ['pending', 'confirmed', 'in_progress'])

  // Generate 30-min slots between open and close
  const [openH, openM] = hoursRecord.open_time.split(':').map(Number)
  const [closeH, closeM] = hoursRecord.close_time.split(':').map(Number)

  const baseDate = parseISO(dateStr)
  let current = setMinutes(setHours(baseDate, openH), openM)
  const closeTime = setMinutes(setHours(baseDate, closeH), closeM)

  const slots: { time: string; available: boolean }[] = []

  while (addMinutes(current, service.duration_minutes) <= closeTime) {
    const slotEnd = addMinutes(current, slotDuration)

    const overlaps = (existingAppts ?? []).some((appt) => {
      const apptStart = new Date(appt.starts_at)
      const apptEnd = new Date(appt.ends_at)
      return current < apptEnd && slotEnd > apptStart
    })

    slots.push({
      time: format(current, 'HH:mm'),
      available: !overlaps,
    })

    current = addMinutes(current, 30)
  }

  return NextResponse.json({ slots, date: dateStr, service_duration: service.duration_minutes })
}
