'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  slug: string
  title: string
  published: boolean
  order: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        if (res.ok) {
          const data = await res.json()
          // Sort by order
          const sorted = data.sort((a: Project, b: Project) => a.order - b.order)
          setProjects(sorted)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newProjects = [...projects]
    const draggedProject = newProjects[draggedIndex]
    newProjects.splice(draggedIndex, 1)
    newProjects.splice(index, 0, draggedProject)
    
    setProjects(newProjects)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    setDraggedIndex(null)
    
    // Save new order to database
    setSaving(true)
    try {
      const updates = projects.map((project, index) => ({
        id: project.id,
        order: index,
      }))
      
      await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
    } catch (error) {
      console.error('Failed to save order:', error)
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-500">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Drag rows to reorder • {saving ? 'Saving...' : 'Changes auto-save'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            + New Project
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Sign Out
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-neutral-200">
          <p className="text-neutral-500 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="text-blue-600 hover:underline"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="w-10 px-2 py-3"></th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                  #
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-neutral-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {projects.map((project, index) => (
                <tr 
                  key={project.id} 
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`hover:bg-neutral-50 transition-colors ${
                    draggedIndex === index ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-2 py-3 cursor-grab active:cursor-grabbing">
                    <div className="text-neutral-400 hover:text-neutral-600 flex justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="4" cy="3" r="1.5" />
                        <circle cx="12" cy="3" r="1.5" />
                        <circle cx="4" cy="8" r="1.5" />
                        <circle cx="12" cy="8" r="1.5" />
                        <circle cx="4" cy="13" r="1.5" />
                        <circle cx="12" cy="13" r="1.5" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {project.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        project.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-blue-600 hover:underline text-sm mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
