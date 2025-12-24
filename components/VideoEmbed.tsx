'use client'

interface VideoEmbedProps {
  url: string
  title?: string
}

function getEmbedUrl(url: string): string {
  // Handle YouTube URLs
  const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`
  }

  // Handle Vimeo URLs
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`
  }

  // Return original if already an embed URL or unrecognized format
  return url
}

export default function VideoEmbed({ url, title = 'Project video' }: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(url)

  return (
    <div className="relative w-full aspect-video bg-neutral-100 overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  )
}


