export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200">
      <div className="container-wide py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-neutral-500">
          <p className="font-medium">© {currentYear}</p>
          <p className="font-bold text-neutral-900">thanks.</p>
          <a 
            href="mailto:hello@mikiyaron.com" 
            className="hover:text-neutral-900 transition-colors font-medium"
          >
            hello@mikiyaron.com
          </a>
        </div>
      </div>
    </footer>
  )
}
