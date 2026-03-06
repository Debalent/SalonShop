import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/register
// Body: { name, email, password, role }
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    // TODO: hash password with bcrypt, save to DB via Prisma, send verification email
    // const user = await prisma.user.create({ data: { name, email, passwordHash: hash, role } })
    return NextResponse.json({ success: true, data: { message: 'Account created. Check your email.' } })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
