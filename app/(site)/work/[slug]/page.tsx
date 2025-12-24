import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import VideoEmbed from '@/components/VideoEmbed'
import ImageGallery from '@/components/ImageGallery'
import TeamSection from '@/components/TeamSection'

// Use dynamic rendering - pages are generated on-demand
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  try {
    return await db.projects.findFirst({
      where: { slug, published: true },
    })
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

// Return empty array - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project Not Found' }
  
  return {
    title: `${project.title} | Miki Yaron`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  const images = [project.image1, project.image2, project.image3].filter(Boolean)
  const team = project.team || []
  const titleColor = project.color || '#ff6b35'

  return (
    <div className="container-wide pb-24">
      {/* Video Section */}
      <section className="mb-12">
        <VideoEmbed url={project.videoUrl} title={project.title} />
      </section>

      {/* Project Info */}
      <section className="mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ color: titleColor }}
        >
          {project.title}
        </h1>
        <p className="text-xl text-neutral-500 font-medium mb-8">
          {project.client}
        </p>
        <p className="text-xl text-neutral-700 max-w-4xl leading-relaxed">
          {project.description}
        </p>
      </section>

      {/* Images Gallery with Lightbox */}
      <section>
        <ImageGallery images={images} title={project.title} />
      </section>

      {/* Team Section */}
      {team.length > 0 && <TeamSection team={team} />}
    </div>
  )
}
