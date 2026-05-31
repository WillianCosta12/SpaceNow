import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Telescope, Menu, X } from 'lucide-react'

const links = [
  { label: 'Foto do Dia', href: '#apod' },
  { label: 'Marte',       href: '#mars' },
  { label: 'ISS',         href: '#iss'  },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-nebula-border' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-star hover:text-nebula-light transition-colors">
          <Telescope className="w-5 h-5 text-nebula-light" />
          SpaceNow
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-star-muted hover:text-star transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://api.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1.5 rounded-full border border-nebula-border text-nebula-light hover:bg-nebula-muted transition-colors"
          >
            NASA API
          </a>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-star-muted">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-nebula-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-star-muted hover:text-star">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  )
}
