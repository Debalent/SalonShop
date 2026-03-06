import { NextRequest, NextResponse } from 'next/server'

// GET /api/bookings/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: fetch booking with includes
  return NextResponse.json({ success: true, data: null })
}

// PATCH /api/bookings/:id — cancel, reschedule, mark complete
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { action, ...data } = await req.json()
  // actions: "cancel" | "reschedule" | "complete" | "no_show"
  // TODO: auth check, status transitions, trigger notifications
  return NextResponse.json({ success: true, data: { updated: true } })
}
