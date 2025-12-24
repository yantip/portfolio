import { sql } from '@vercel/postgres'

interface TeamMember {
  role: string
  names: string[]
}

interface Project {
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
}

const seedProjects: Omit<Project, 'id'>[] = [
  {
    slug: 'brand-identity-google',
    title: 'Google Brand Identity',
    client: 'Google',
    description: 'A comprehensive brand identity project for Google, exploring new visual directions and motion design systems.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag',
    image1: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains',
    image2: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat',
    image3: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices',
    team: [
      { role: 'Client', names: ['Google'] },
      { role: 'Creative Director', names: ['Miki Yaron'] },
      { role: 'Design', names: ['Miki Yaron', 'Adam Gault'] },
      { role: 'Animation', names: ['Ted Kotsaftis', 'Mike Russo'] },
    ],
    color: '#4285f4',
    order: 1,
    published: true,
  },
  {
    slug: 'motion-design-nike',
    title: 'Nike Motion Campaign',
    client: 'Nike',
    description: 'Dynamic motion graphics and animation for Nike\'s seasonal campaign, featuring bold typography and energetic transitions.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs',
    image1: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/reindeer',
    image2: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man',
    image3: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes',
    team: [
      { role: 'Client', names: ['Nike'] },
      { role: 'Directed by', names: ['Block & Tackle'] },
      { role: 'Creative Director', names: ['Miki Yaron'] },
      { role: 'Lead Design', names: ['Mike Russo'] },
      { role: 'Animation', names: ['Ted Kotsaftis', 'Alex Winakor'] },
    ],
    color: '#ff6b35',
    order: 2,
    published: true,
  },
  {
    slug: 'yellowstone',
    title: 'Yellowstone',
    client: 'Paramount Networks',
    description: 'Main title sequence and brand package for Paramount\'s hit series Yellowstone, capturing the raw beauty of the American West.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/three-dogs',
    image1: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/girl-urban-view',
    image2: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/dessert',
    image3: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat',
    team: [
      { role: 'Client', names: ['Paramount Networks'] },
      { role: 'Creative Director', names: ['Miki Yaron', 'Adam Gault'] },
      { role: 'Producer', names: ['Megan Anderson'] },
      { role: 'Design', names: ['Mike Russo', 'Jess Hutchison'] },
      { role: 'Animation', names: ['Ted Kotsaftis', 'David Jouppi'] },
    ],
    color: '#c4a35a',
    order: 3,
    published: true,
  },
]

async function seed() {
  console.log('🌱 Starting database seed...')

  // Create table if not exists
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
  console.log('✅ Table created/verified')

  // Insert seed data
  for (const project of seedProjects) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
    const teamJson = JSON.stringify(project.team)
    
    try {
      await sql`
        INSERT INTO projects (
          id, slug, title, client, description, video_url, thumbnail,
          image1, image2, image3, team, color, display_order, published
        ) VALUES (
          ${id}, ${project.slug}, ${project.title}, ${project.client},
          ${project.description}, ${project.videoUrl}, ${project.thumbnail},
          ${project.image1}, ${project.image2}, ${project.image3},
          ${teamJson}::jsonb, ${project.color}, ${project.order}, ${project.published}
        )
        ON CONFLICT (slug) DO NOTHING
      `
      console.log(`✅ Inserted: ${project.title}`)
    } catch (error) {
      console.log(`⚠️ Skipped (already exists): ${project.title}`)
    }
  }

  console.log('🎉 Seed completed!')
}

seed().catch(console.error)

