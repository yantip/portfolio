'use client'

import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  slug: string
  title: string
  client: string
  thumbnail: string
  color?: string
}

export default function ProjectCard({ slug, title, client, thumbnail, color = '#ffffff' }: ProjectCardProps) {
  return (
    <Link 
      href={`/work/${slug}`}
      className="group block aspect-video relative overflow-hidden bg-neutral-900"
    >
      {/* Image */}
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      
      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500 ease-out" />
      
      {/* Title and Client - visible on hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
        <h3 
          className="text-2xl font-semibold mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out"
          style={{ color }}
        >
          {title}
        </h3>
        <p className="text-white/80 text-base transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out">
          {client}
        </p>
      </div>
    </Link>
  )
}
