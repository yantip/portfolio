import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { updates } = body as { updates: { id: string; order: number }[] }

    // Update each project's order
    await db.projects.updateOrder(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to reorder projects:', error)
    return NextResponse.json(
      { error: 'Failed to reorder projects' },
      { status: 500 }
    )
  }
}
