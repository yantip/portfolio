'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
  title: string
}

export default function Lightbox({ images, initialIndex, onClose, title }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, goNext, goPrev])

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Close button */}
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl w-12 h-12 flex items-center justify-center transition-colors"
        onClick={onClose} 
        aria-label="Close"
      >
        ×
      </button>

      {/* Previous button */}
      <button 
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
        onClick={goPrev}
        aria-label="Previous image"
      >
        ←
      </button>

      {/* Image */}
      <div className="relative w-[85vw] h-[85vh]">
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="85vw"
          priority
        />
      </div>

      {/* Next button */}
      <button 
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
        onClick={goNext}
        aria-label="Next image"
      >
        →
      </button>

      {/* Image counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
