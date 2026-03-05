import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = req.nextUrl

  const slug = searchParams.get('slug')
  const city = searchParams.get('city')
  const specialty = searchParams.get('specialty')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const page = parseInt(searchParams.get('page') ?? '1')
  const offset = (page - 1) * limit

  let query = supabase
    .from('profiles')
    .select(`
      id, first_name, last_name, slug, avatar_url, bio,
      provider_profiles (
        specialty, years_experience, city, state,
        average_rating, total_reviews, total_bookings,
        response_time_minutes, portfolio_images
      )
    `)
    .eq('role', 'provider')
    .eq('is_active', true)
    .range(offset, offset + limit - 1)

  if (slug) {
    query = query.eq('slug', slug)
  }
  if (city) {
    query = query.ilike('provider_profiles.city', `%${city}%`)
  }
  if (specialty) {
    query = query.ilike('provider_profiles.specialty', `%${specialty}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count, page, limit })
}
