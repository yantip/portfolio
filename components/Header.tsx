'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="container-wide py-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="hover:opacity-70 transition-opacity"
        >
          <Image
            src="/miki-logo.svg"
            alt="Miki Yaron"
            width={80}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-16">
          <ul className="flex items-center gap-16">
            <li>
              <Link
                href="/"
                className={`text-base font-medium tracking-wide transition-opacity ${
                  isActive('/') && !pathname.startsWith('/about')
                    ? 'opacity-100'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                Work
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`text-base font-medium tracking-wide transition-opacity ${
                  isActive('/about')
                    ? 'opacity-100'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                About
              </Link>
            </li>
          </ul>
          
          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/mikiyaron/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Instagram"
          >
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </nav>
    </header>
  )
}
