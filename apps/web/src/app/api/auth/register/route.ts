import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { UserRole } from '@/types'

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  role: z.enum(['client', 'provider', 'shop_owner']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password, role } = registerSchema.parse(body)

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, role },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: role as UserRole,
        is_verified: false,
        two_factor_enabled: false,
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    return NextResponse.json(
      { message: 'Account created. Please check your email to verify.', userId: authData.user?.id },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Register error:', message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
