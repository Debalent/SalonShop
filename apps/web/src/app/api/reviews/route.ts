import { NextRequest, NextResponse } from 'next/server'

// POST /api/reviews — submit a review (client only, after completed booking)
export async function POST(req: NextRequest) {
  const { bookingId, rating, body, wouldBookAgain } = await req.json()
  // TODO: verify booking is COMPLETED, client matches, no existing review
  // prisma.review.create({ data: { bookingId, clientId, workerId, rating, body, wouldBookAgain } })
  // Update WorkerProfile.averageRating, totalReviews
  return NextResponse.json({ success: true, data: { message: 'Review submitted for moderation' } })
}
