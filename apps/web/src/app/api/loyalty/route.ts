import { NextRequest, NextResponse } from 'next/server'

// GET /api/loyalty — get loyalty account for authenticated client
export async function GET(req: NextRequest) {
  // TODO: prisma.loyaltyAccount.findUnique({ where: { clientId }, include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } } })
  return NextResponse.json({ success: true, data: { points: 0, tier: 'bronze', transactions: [] } })
}
