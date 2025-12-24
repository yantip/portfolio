'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

interface TeamMember {
  role: string
  names: string[]
}

interface ProjectData {
  id: string
  title: string
  slug: string
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

export default function EditProjectPage() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${params.id}`)
        if (!res.ok) {
          throw new Error('Project not found')
        }
        const data = await res.json()
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated' && params.id) {
      fetchProject()
    }
  }, [status, params.id])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-500">Loading...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin" className="text-blue-600 hover:underline">
          Back to projects
        </Link>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back to projects
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Edit: {project.title}</h1>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <ProjectForm initialData={project} isEditing />
      </div>
    </div>
  )
}
