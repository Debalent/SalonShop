import { NextRequest, NextResponse } from 'next/server'

// GET /api/workers?category=&city=&q=&page=&limit=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? ''
  const city     = searchParams.get('city') ?? ''
  const q        = searchParams.get('q') ?? ''
  const page     = parseInt(searchParams.get('page') ?? '1')
  const limit    = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

  // TODO: prisma.workerProfile.findMany({
  //   where: {
  //     isAcceptingClients: true,
  //     ...(category && { categories: { has: category } }),
  //     ...(city && { user: { profile: { city: { contains: city, mode: 'insensitive' } } } }),
  //   },
  //   include: { user: { include: { profile: true } }, services: true },
  //   orderBy: [{ isFeatured: 'desc' }, { averageRating: 'desc' }],
  //   skip: (page - 1) * limit,
  //   take: limit,
  // })

  return NextResponse.json({ success: true, data: { workers: [], total: 0, page, limit } })
}
