import Link from 'next/link'
import Providers from '@/components/Providers'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/admin" className="font-semibold text-lg">
              Admin Dashboard
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm text-neutral-500 hover:text-neutral-900"
                target="_blank"
              >
                View Site →
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </Providers>
  )
}
