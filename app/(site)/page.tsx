import { db } from '@/lib/db'
import ProjectGrid from '@/components/ProjectGrid'

export const revalidate = 60

async function getProjects() {
  const projects = await db.projects.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })
  return projects
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div className="container-wide">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <p className="text-3xl md:text-4xl lg:text-5xl max-w-4xl leading-snug">
          I'm Miki Yaron, a <span className="font-bold">Filmmaker / Director</span>
          <br />
          Here are some videos I directed
        </p>
      </section>

      {/* Year Range Label */}
      <div className="mb-6">
        <span className="text-base text-neutral-400 font-medium">2020 - 2024</span>
      </div>

      {/* Projects Grid */}
      <section className="pb-24">
        <ProjectGrid projects={projects} />
      </section>
    </div>
  )
}
