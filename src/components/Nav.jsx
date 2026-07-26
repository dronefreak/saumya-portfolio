import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Story', href: '#story' },
  // { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#projects' },
  { label: 'Research', href: '#publications' },
  { label: 'Live Demos', href: '#demos' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={e => handleLink(e, '#hero')}
          className="font-display font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-gradient-cyan whitespace-nowrap"
        >
          Saumya Saksena
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={e => handleLink(e, link.href)}
                className="font-body text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          onClick={e => handleLink(e, '#contact')}
          className="hidden md:inline-flex btn-secondary text-sm py-2 px-4"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-navy-900/95 backdrop-blur-xl border-b border-white/[0.06]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {links.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={e => handleLink(e, link.href)}
                    className="block font-body text-base text-white/70 hover:text-white py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={e => handleLink(e, '#contact')}
                  className="btn-primary text-sm py-2.5 px-5 mt-2"
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
