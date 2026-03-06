import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// GET /api/referrals — get referral link + stats for authenticated user
export async function GET(req: NextRequest) {
  // TODO: find or create referral record, return code + count of redemptions
  const code = nanoid(8).toUpperCase()
  return NextResponse.json({ success: true, data: { code, url: `${process.env.NEXT_PUBLIC_APP_URL}/join/${code}`, totalReferrals: 0, creditsEarned: 0 } })
}
