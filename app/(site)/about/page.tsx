import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Miki Yaron',
  description: 'Learn more about Miki Yaron - Art Director, Designer, and Animator.',
}

const clients = [
  'Google',
  'Apple',
  'Nike',
  'FX Networks',
  'Pinterest',
  'Netflix',
  'Sesame Street',
  'Warner Bros',
  'Universal',
  'Buck',
  'Elastic',
  'Block & Tackle',
]

export default function AboutPage() {
  return (
    <div className="container-wide pb-24">
      {/* Hero Headline */}
      <section className="py-16 md:py-20 border-b border-neutral-200">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight">
          <span className="text-[#ff6b35] italic">Hey there,</span>{' '}
          <span className="font-bold">friend-o</span>
        </h1>
      </section>

      {/* Bio Section */}
      <section className="py-16 max-w-4xl">
        <p className="text-xl leading-relaxed mb-8 font-medium">
          The name&apos;s Miki - I am a freelance Art Director / Designer / Animator 
          residing in the creative world. For the past several years I have been making 
          and moving things for clients large and small. Throughout this time I&apos;ve had 
          the opportunity to utilize and expand my craft in a range of different 
          environments including tech, media, film, broadcast & commercial.
        </p>
        <p className="text-xl leading-relaxed mb-8">
          More recently, I spent several years in house, working alongside talented teams 
          where I had the privilege to play an integral role in leading projects & 
          spearheading creative processes for some illustrious & longstanding clients.
        </p>
        <p className="text-xl leading-relaxed mb-8">
          I enjoy making work with playful tones, intentional choices & a touch of mischief.
        </p>
        <p className="text-xl leading-relaxed">
          I also enjoy milkshakes. Let&apos;s create something meaningful |{' '}
          <a 
            href="mailto:hello@mikiyaron.com" 
            className="text-[#ff6b35] font-semibold hover:underline"
          >
            hello@mikiyaron.com
          </a>
        </p>
      </section>

      {/* Clients Section */}
      <section className="py-12 border-t border-neutral-200">
        <h2 className="text-base font-bold tracking-wide uppercase mb-10">
          Select Clients & Studios
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
          {clients.map((client) => (
            <li key={client} className="text-neutral-600 text-lg">
              {client}
            </li>
          ))}
        </ul>
      </section>

      {/* Back to Work */}
      <section className="py-12 border-t border-neutral-200">
        <p className="text-base text-neutral-400 mb-6 font-medium">Back to neat stuff.</p>
        <Link 
          href="/"
          className="inline-block text-[#ff6b35] font-semibold text-lg hover:underline"
        >
          ← View all work
        </Link>
      </section>
    </div>
  )
}
