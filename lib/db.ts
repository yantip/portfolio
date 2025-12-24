import { sql } from '@vercel/postgres'

export interface TeamMember {
  role: string
  names: string[]
}

export interface Project {
  id: string
  slug: string
  title: string
  client: string
  description: string
  videoUrl: string
  thumbnail: string
  image1: string
  image2: string
  image3: string
  team: TeamMember[]
  color: string
  order: number
  published: boolean
  createdAt: string
  updatedAt: string
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Initialize database tables
export async function initializeDatabase() {
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
}

// Convert database row to Project type
function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    client: (row.client as string) || '',
    description: (row.description as string) || '',
    videoUrl: (row.video_url as string) || '',
    thumbnail: (row.thumbnail as string) || '',
    image1: (row.image1 as string) || '',
    image2: (row.image2 as string) || '',
    image3: (row.image3 as string) || '',
    team: (row.team as TeamMember[]) || [],
    color: (row.color as string) || '#ff6b35',
    order: (row.display_order as number) || 0,
    published: row.published as boolean,
    createdAt: (row.created_at as Date)?.toISOString() || new Date().toISOString(),
    updatedAt: (row.updated_at as Date)?.toISOString() || new Date().toISOString(),
  }
}

export const db = {
  projects: {
    findMany: async (options?: { 
      where?: { published?: boolean }
      orderBy?: { order: 'asc' | 'desc' } 
    }): Promise<Project[]> => {
      let query = 'SELECT * FROM projects'
      const conditions: string[] = []

      if (options?.where?.published !== undefined) {
        conditions.push(`published = ${options.where.published}`)
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ')
      }

      if (options?.orderBy?.order) {
        query += ` ORDER BY display_order ${options.orderBy.order.toUpperCase()}`
      }

      const result = await sql.query(query)
      return result.rows.map(rowToProject)
    },

    findUnique: async (options: { where: { id?: string; slug?: string } }): Promise<Project | null> => {
      let result
      if (options.where.id) {
        result = await sql`SELECT * FROM projects WHERE id = ${options.where.id}`
      } else if (options.where.slug) {
        result = await sql`SELECT * FROM projects WHERE slug = ${options.where.slug}`
      } else {
        return null
      }
      
      if (result.rows.length === 0) return null
      return rowToProject(result.rows[0])
    },

    findFirst: async (options: { 
      where: { slug: string; published?: boolean } 
    }): Promise<Project | null> => {
      let result
      if (options.where.published !== undefined) {
        result = await sql`
          SELECT * FROM projects 
          WHERE slug = ${options.where.slug} AND published = ${options.where.published}
          LIMIT 1
        `
      } else {
        result = await sql`
          SELECT * FROM projects 
          WHERE slug = ${options.where.slug}
          LIMIT 1
        `
      }
      
      if (result.rows.length === 0) return null
      return rowToProject(result.rows[0])
    },

    create: async (options: { 
      data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> 
    }): Promise<Project> => {
      const id = generateId()
      const now = new Date().toISOString()
      const teamJson = JSON.stringify(options.data.team || [])
      
      const result = await sql`
        INSERT INTO projects (
          id, slug, title, client, description, video_url, thumbnail,
          image1, image2, image3, team, color, display_order, published,
          created_at, updated_at
        ) VALUES (
          ${id}, ${options.data.slug}, ${options.data.title}, ${options.data.client || ''},
          ${options.data.description || ''}, ${options.data.videoUrl || ''}, ${options.data.thumbnail || ''},
          ${options.data.image1 || ''}, ${options.data.image2 || ''}, ${options.data.image3 || ''},
          ${teamJson}::jsonb, ${options.data.color || '#ff6b35'}, ${options.data.order || 0},
          ${options.data.published ?? true}, ${now}, ${now}
        )
        RETURNING *
      `
      
      return rowToProject(result.rows[0])
    },

    update: async (options: { 
      where: { id: string }
      data: Partial<Omit<Project, 'id' | 'createdAt'>> 
    }): Promise<Project | null> => {
      const now = new Date().toISOString()
      const updates: string[] = ['updated_at = $1']
      const values: unknown[] = [now]
      let paramIndex = 2

      const fieldMappings: Record<string, string> = {
        slug: 'slug',
        title: 'title',
        client: 'client',
        description: 'description',
        videoUrl: 'video_url',
        thumbnail: 'thumbnail',
        image1: 'image1',
        image2: 'image2',
        image3: 'image3',
        color: 'color',
        order: 'display_order',
        published: 'published',
      }

      for (const [key, dbField] of Object.entries(fieldMappings)) {
        if (options.data[key as keyof typeof options.data] !== undefined) {
          updates.push(`${dbField} = $${paramIndex}`)
          values.push(options.data[key as keyof typeof options.data])
          paramIndex++
        }
      }

      if (options.data.team !== undefined) {
        updates.push(`team = $${paramIndex}::jsonb`)
        values.push(JSON.stringify(options.data.team))
        paramIndex++
      }

      values.push(options.where.id)
      
      const query = `
        UPDATE projects 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `
      
      const result = await sql.query(query, values)
      
      if (result.rows.length === 0) return null
      return rowToProject(result.rows[0])
    },

    delete: async (options: { where: { id: string } }): Promise<boolean> => {
      const result = await sql`
        DELETE FROM projects WHERE id = ${options.where.id}
        RETURNING id
      `
      return result.rows.length > 0
    },

    updateOrder: async (updates: { id: string; order: number }[]): Promise<void> => {
      for (const update of updates) {
        await sql`
          UPDATE projects 
          SET display_order = ${update.order}, updated_at = NOW()
          WHERE id = ${update.id}
        `
      }
    },
  },
}
