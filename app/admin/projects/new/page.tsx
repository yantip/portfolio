'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

export default function NewProjectPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-500">Loading...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
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
        <h1 className="text-2xl font-semibold mt-2">New Project</h1>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <ProjectForm />
      </div>
    </div>
  )
}


