import ProjectCard from './ProjectCard'

interface Project {
  id: string
  slug: string
  title: string
  client: string
  thumbnail: string
  color?: string
}

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          slug={project.slug}
          title={project.title}
          client={project.client}
          thumbnail={project.thumbnail}
          color={project.color}
        />
      ))}
    </div>
  )
}
