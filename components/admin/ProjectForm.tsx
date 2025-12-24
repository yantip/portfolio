'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface TeamMember {
  role: string
  names: string[]
}

interface ProjectData {
  id?: string
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

interface ProjectFormProps {
  initialData?: ProjectData
  isEditing?: boolean
}

const COLOR_PRESETS = [
  { name: 'Red', value: '#f7291e' },
  { name: 'Cyan', value: '#55b8d8' },
  { name: 'Pink', value: '#f587d9' },
  { name: 'Blue', value: '#367cf8' },
  { name: 'Orange', value: '#e97020' },
  { name: 'Green', value: '#74fd68' },
  { name: 'Yellow', value: '#ebbf2b' },
  { name: 'White', value: '#ffffff' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProjectForm({ initialData, isEditing }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draggedTeamIndex, setDraggedTeamIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState<ProjectData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    client: initialData?.client || '',
    description: initialData?.description || '',
    videoUrl: initialData?.videoUrl || '',
    thumbnail: initialData?.thumbnail || '',
    image1: initialData?.image1 || '',
    image2: initialData?.image2 || '',
    image3: initialData?.image3 || '',
    team: initialData?.team || [],
    color: initialData?.color || '#f7291e',
    order: initialData?.order || 0,
    published: initialData?.published ?? true,
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }))
  }

  const handleAddTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { role: '', names: [''] }],
    }))
  }

  const handleRemoveTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }))
  }

  const handleTeamRoleChange = (index: number, role: string) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === index ? { ...member, role } : member
      ),
    }))
  }

  // Handle adding a name to a team member
  const handleAddName = (teamIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === teamIndex ? { ...member, names: [...member.names, ''] } : member
      ),
    }))
  }

  // Handle changing a specific name
  const handleNameChange = (teamIndex: number, nameIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === teamIndex
          ? {
              ...member,
              names: member.names.map((n, ni) => (ni === nameIndex ? value : n)),
            }
          : member
      ),
    }))
  }

  // Handle removing a name
  const handleRemoveName = (teamIndex: number, nameIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === teamIndex
          ? {
              ...member,
              names: member.names.filter((_, ni) => ni !== nameIndex),
            }
          : member
      ),
    }))
  }

  // Team drag and drop handlers
  const handleTeamDragStart = (index: number) => {
    setDraggedTeamIndex(index)
  }

  const handleTeamDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedTeamIndex === null || draggedTeamIndex === index) return

    const newTeam = [...formData.team]
    const draggedItem = newTeam[draggedTeamIndex]
    newTeam.splice(draggedTeamIndex, 1)
    newTeam.splice(index, 0, draggedItem)
    
    setFormData((prev) => ({ ...prev, team: newTeam }))
    setDraggedTeamIndex(index)
  }

  const handleTeamDragEnd = () => {
    setDraggedTeamIndex(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Clean up empty names before submitting
    const cleanedTeam = formData.team
      .map(member => ({
        ...member,
        names: member.names.filter(n => n.trim() !== '')
      }))
      .filter(member => member.role.trim() !== '' || member.names.length > 0)

    const dataToSubmit = {
      ...formData,
      team: cleanedTeam,
    }

    try {
      const url = isEditing
        ? `/api/projects/${initialData?.id}`
        : '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save project')
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug *
          </label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Client / Subtitle */}
      <div>
        <label htmlFor="client" className="block text-sm font-medium mb-1">
          Subtitle (shown on homepage thumbnail)
        </label>
        <input
          id="client"
          type="text"
          value={formData.client}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, client: e.target.value }))
          }
          placeholder="e.g., Nike, Google, Personal Project"
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Project Color (for title)
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, color: preset.value }))}
              className={`w-10 h-10 rounded-full transition-all ${
                formData.color.toLowerCase() === preset.value.toLowerCase()
                  ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: preset.value,
                border: preset.value === '#ffffff' ? '2px solid #e5e5e5' : 'none'
              }}
              title={preset.name}
            />
          ))}
          <div className="flex items-center gap-2 ml-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              className="w-24 px-2 py-1 border border-neutral-300 rounded text-sm"
              placeholder="#f7291e"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Video URL */}
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium mb-1">
          Video URL (YouTube or Vimeo)
        </label>
        <input
          id="videoUrl"
          type="url"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
          }
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Thumbnail */}
      <ImageUpload
        label="Thumbnail (Homepage Grid)"
        value={formData.thumbnail}
        onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
      />

      {/* Project Images */}
      <div className="space-y-4">
        <h3 className="font-medium">Project Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageUpload
            label="Image 1"
            value={formData.image1}
            onChange={(url) => setFormData((prev) => ({ ...prev, image1: url }))}
          />
          <ImageUpload
            label="Image 2"
            value={formData.image2}
            onChange={(url) => setFormData((prev) => ({ ...prev, image2: url }))}
          />
          <ImageUpload
            label="Image 3"
            value={formData.image3}
            onChange={(url) => setFormData((prev) => ({ ...prev, image3: url }))}
          />
        </div>
      </div>

      {/* Team Credits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Team Credits</h3>
          <button
            type="button"
            onClick={handleAddTeamMember}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Credit
          </button>
        </div>
        
        {formData.team.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4 text-center bg-neutral-50 rounded-md">
            No team credits added yet. Click &quot;Add Credit&quot; to add roles and names.
          </p>
        ) : (
          <div className="space-y-3">
            {formData.team.map((member, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={() => handleTeamDragStart(index)}
                onDragOver={(e) => handleTeamDragOver(e, index)}
                onDragEnd={handleTeamDragEnd}
                className={`bg-neutral-50 p-4 rounded-md border-2 transition-colors ${
                  draggedTeamIndex === index ? 'border-blue-400 bg-blue-50' : 'border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 pt-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="4" cy="3" r="1.5" />
                      <circle cx="12" cy="3" r="1.5" />
                      <circle cx="4" cy="8" r="1.5" />
                      <circle cx="12" cy="8" r="1.5" />
                      <circle cx="4" cy="13" r="1.5" />
                      <circle cx="12" cy="13" r="1.5" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Role */}
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleTeamRoleChange(index, e.target.value)}
                        placeholder="e.g., Director, Designer"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Names */}
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Names</label>
                      <div className="space-y-2">
                        {member.names.map((name, nameIndex) => (
                          <div key={nameIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => handleNameChange(index, nameIndex, e.target.value)}
                              placeholder="e.g., John Doe"
                              className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {member.names.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveName(index, nameIndex)}
                                className="text-red-500 hover:text-red-600 text-sm px-2"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddName(index)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          + Add another name
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Credit Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(index)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order and Published */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="order" className="block text-sm font-medium mb-1">
            Display Order
          </label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center pt-7">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, published: e.target.checked }))
              }
              className="mr-2 w-4 h-4"
            />
            <span className="text-sm">Published</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-neutral-600 hover:text-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
