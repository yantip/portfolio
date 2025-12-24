import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

// GET all projects (for admin)
export async function GET() {
  try {
    const projects = await db.projects.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, videoUrl, thumbnail, image1, image2, image3, slug, client, team, color, order, published } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    const project = await db.projects.create({
      data: {
        title,
        slug,
        client: client || '',
        description: description || '',
        videoUrl: videoUrl || '',
        thumbnail: thumbnail || '',
        image1: image1 || '',
        image2: image2 || '',
        image3: image3 || '',
        team: team || [],
        color: color || '#ff6b35',
        order: order || 0,
        published: published ?? true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
