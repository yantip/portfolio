import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

// POST - Initialize database (create tables)
// This should be called once when setting up the database
export async function POST() {
  try {
    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        client TEXT DEFAULT '',
        description TEXT DEFAULT '',
        video_url TEXT DEFAULT '',
        thumbnail TEXT DEFAULT '',
        image1 TEXT DEFAULT '',
        image2 TEXT DEFAULT '',
        image3 TEXT DEFAULT '',
        team JSONB DEFAULT '[]',
        color TEXT DEFAULT '#ff6b35',
        display_order INTEGER DEFAULT 0,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database', details: String(error) },
      { status: 500 }
    )
  }
}

// GET - Check database status
export async function GET() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      )
    `
    
    const tableExists = result.rows[0]?.exists || false

    if (tableExists) {
      const countResult = await sql`SELECT COUNT(*) as count FROM projects`
      const projectCount = countResult.rows[0]?.count || 0

      return NextResponse.json({
        status: 'connected',
        tableExists: true,
        projectCount: Number(projectCount),
      })
    }

    return NextResponse.json({
      status: 'connected',
      tableExists: false,
      message: 'Database connected but tables not initialized. POST to this endpoint to create tables.',
    })
  } catch (error) {
    console.error('Database check failed:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Failed to connect to database',
        details: String(error)
      },
      { status: 500 }
    )
  }
}

