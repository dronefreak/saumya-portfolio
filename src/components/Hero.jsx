import { motion } from 'framer-motion'
import { useState, useEffect, Fragment } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useHFStats } from '../hooks/useHFStats'
import { useGitHubTotalStars } from '../hooks/useGitHubStats'
import LidarViz from './LidarViz'
import { authorStats, patents } from '../data/publications'

// Formats a live number — returns fallback string while still loading (null)
function fmtCount(n, fallback) {
  if (n === null || n === undefined) return fallback
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`
  return `${n}`
}

// Full number with thousands separators (e.g. 116,482) — no K+ rounding
function fmtFull(n, fallback) {
  if (n === null || n === undefined) return fallback
  return n.toLocaleString('en-US')
}

const ROLES = [
  'Perception Architect',
  'Robotics Engineer',
  'Computer Vision Engineer',
  'Embedded AI Architect',
]

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  return reduced
}

function RoleTypewriter() {
  const reduced = useReducedMotionPreference()

  return (
    <>
      <span aria-hidden="true">
        {reduced ? (
          ROLES[0]
        ) : (
          <TypeAnimation
            sequence={ROLES.flatMap(role => [role, 1800])}
            wrapper="span"
            speed={50}
            deletionSpeed={65}
            repeat={Infinity}
            cursor
          />
        )}
      </span>
      <span className="sr-only">{ROLES.join(', ')}</span>
    </>
  )
}

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/dronefreak',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'HuggingFace',
    href: 'https://huggingface.co/dronefreak',
    icon: (
      <svg width="18" height="18" viewBox="0 0 95 88" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFD21E" d="M47.21 76.5a34.75 34.75 0 1 0 0-69.5 34.75 34.75 0 0 0 0 69.5Z" />
        <path fill="#FF9D0B" d="M81.96 41.75a34.75 34.75 0 1 0-69.5 0 34.75 34.75 0 0 0 69.5 0Zm-73.5 0a38.75 38.75 0 1 1 77.5 0 38.75 38.75 0 0 1-77.5 0Z" />
        <path fill="#3A3B45" d="M58.5 32.3c1.28.44 1.78 3.06 3.07 2.38a5 5 0 1 0-6.76-2.07c.61 1.15 2.55-.72 3.7-.32ZM34.95 32.3c-1.28.44-1.79 3.06-3.07 2.38a5 5 0 1 1 6.76-2.07c-.61 1.15-2.56-.72-3.7-.32Z" />
        <path fill="#FF323D" d="M46.96 56.29c9.83 0 13-8.76 13-13.26 0-2.34-1.57-1.6-4.09-.36-2.33 1.15-5.46 2.74-8.9 2.74-7.19 0-13-6.88-13-2.38s3.16 13.26 13 13.26Z" />
        <path fill="#3A3B45" fillRule="evenodd" clipRule="evenodd" d="M39.43 54a8.7 8.7 0 0 1 5.3-4.49c.4-.12.81.57 1.24 1.28.4.68.82 1.37 1.24 1.37.45 0 .9-.68 1.33-1.35.45-.7.89-1.38 1.32-1.25a8.61 8.61 0 0 1 5 4.17c3.73-2.94 5.1-7.74 5.1-10.7 0-2.34-1.57-1.6-4.09-.36l-.14.07c-2.31 1.15-5.39 2.67-8.77 2.67s-6.45-1.52-8.77-2.67c-2.6-1.29-4.23-2.1-4.23.29 0 3.05 1.46 8.06 5.47 10.97Z" />
        <path fill="#FF9D0B" d="M70.71 37a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM24.21 37a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM17.52 48c-1.62 0-3.06.66-4.07 1.87a5.97 5.97 0 0 0-1.33 3.76 7.1 7.1 0 0 0-1.94-.3c-1.55 0-2.95.59-3.94 1.66a5.8 5.8 0 0 0-.8 7 5.3 5.3 0 0 0-1.79 2.82c-.24.9-.48 2.8.8 4.74a5.22 5.22 0 0 0-.37 5.02c1.02 2.32 3.57 4.14 8.52 6.1 3.07 1.22 5.89 2 5.91 2.01a44.33 44.33 0 0 0 10.93 1.6c5.86 0 10.05-1.8 12.46-5.34 3.88-5.69 3.33-10.9-1.7-15.92-2.77-2.78-4.62-6.87-5-7.77-.78-2.66-2.84-5.62-6.25-5.62a5.7 5.7 0 0 0-4.6 2.46c-1-1.26-1.98-2.25-2.86-2.82A7.4 7.4 0 0 0 17.52 48Zm0 4c.51 0 1.14.22 1.82.65 2.14 1.36 6.25 8.43 7.76 11.18.5.92 1.37 1.31 2.14 1.31 1.55 0 2.75-1.53.15-3.48-3.92-2.93-2.55-7.72-.68-8.01.08-.02.17-.02.24-.02 1.7 0 2.45 2.93 2.45 2.93s2.2 5.52 5.98 9.3c3.77 3.77 3.97 6.8 1.22 10.83-1.88 2.75-5.47 3.58-9.16 3.58-3.81 0-7.73-.9-9.92-1.46-.11-.03-13.45-3.8-11.76-7 .28-.54.75-.76 1.34-.76 2.38 0 6.7 3.54 8.57 3.54.41 0 .7-.17.83-.6.79-2.85-12.06-4.05-10.98-8.17.2-.73.71-1.02 1.44-1.02 3.14 0 10.2 5.53 11.68 5.53.11 0 .2-.03.24-.1.74-1.2.33-2.04-4.9-5.2-5.21-3.16-8.88-5.06-6.8-7.33.24-.26.58-.38 1-.38 3.17 0 10.66 6.82 10.66 6.82s2.02 2.1 3.25 2.1c.28 0 .52-.1.68-.38.86-1.46-8.06-8.22-8.56-11.01-.34-1.9.24-2.85 1.31-2.85Z" />
        <path fill="#FFD21E" d="M38.6 76.69c2.75-4.04 2.55-7.07-1.22-10.84-3.78-3.77-5.98-9.3-5.98-9.3s-.82-3.2-2.69-2.9c-1.87.3-3.24 5.08.68 8.01 3.91 2.93-.78 4.92-2.29 2.17-1.5-2.75-5.62-9.82-7.76-11.18-2.13-1.35-3.63-.6-3.13 2.2.5 2.79 9.43 9.55 8.56 11-.87 1.47-3.93-1.71-3.93-1.71s-9.57-8.71-11.66-6.44c-2.08 2.27 1.59 4.17 6.8 7.33 5.23 3.16 5.64 4 4.9 5.2-.75 1.2-12.28-8.53-13.36-4.4-1.08 4.11 11.77 5.3 10.98 8.15-.8 2.85-9.06-5.38-10.74-2.18-1.7 3.21 11.65 6.98 11.76 7.01 4.3 1.12 15.25 3.49 19.08-2.12Z" />
        <path fill="#FF9D0B" d="M77.4 48c1.62 0 3.07.66 4.07 1.87a5.97 5.97 0 0 1 1.33 3.76 7.1 7.1 0 0 1 1.95-.3c1.55 0 2.95.59 3.94 1.66a5.8 5.8 0 0 1 .8 7 5.3 5.3 0 0 1 1.78 2.82c.24.9.48 2.8-.8 4.74a5.22 5.22 0 0 1 .37 5.02c-1.02 2.32-3.57 4.14-8.51 6.1-3.08 1.22-5.9 2-5.92 2.01a44.33 44.33 0 0 1-10.93 1.6c-5.86 0-10.05-1.8-12.46-5.34-3.88-5.69-3.33-10.9 1.7-15.92 2.78-2.78 4.63-6.87 5.01-7.77.78-2.66 2.83-5.62 6.24-5.62a5.7 5.7 0 0 1 4.6 2.46c1-1.26 1.98-2.25 2.87-2.82A7.4 7.4 0 0 1 77.4 48Zm0 4c-.51 0-1.13.22-1.82.65-2.13 1.36-6.25 8.43-7.76 11.18a2.43 2.43 0 0 1-2.14 1.31c-1.54 0-2.75-1.53-.14-3.48 3.91-2.93 2.54-7.72.67-8.01a1.54 1.54 0 0 0-.24-.02c-1.7 0-2.45 2.93-2.45 2.93s-2.2 5.52-5.97 9.3c-3.78 3.77-3.98 6.8-1.22 10.83 1.87 2.75 5.47 3.58 9.15 3.58 3.82 0 7.73-.9 9.93-1.46.1-.03 13.45-3.8 11.76-7-.29-.54-.75-.76-1.34-.76-2.38 0-6.71 3.54-8.57 3.54-.42 0-.71-.17-.83-.6-.8-2.85 12.05-4.05 10.97-8.17-.19-.73-.7-1.02-1.44-1.02-3.14 0-10.2 5.53-11.68 5.53-.1 0-.19-.03-.23-.1-.74-1.2-.34-2.04 4.88-5.2 5.23-3.16 8.9-5.06 6.8-7.33-.23-.26-.57-.38-.98-.38-3.18 0-10.67 6.82-10.67 6.82s-2.02 2.1-3.24 2.1a.74.74 0 0 1-.68-.38c-.87-1.46 8.05-8.22 8.55-11.01.34-1.9-.24-2.85-1.31-2.85Z" />
        <path fill="#FFD21E" d="M56.33 76.69c-2.75-4.04-2.56-7.07 1.22-10.84 3.77-3.77 5.97-9.3 5.97-9.3s.82-3.2 2.7-2.9c1.86.3 3.23 5.08-.68 8.01-3.92 2.93.78 4.92 2.28 2.17 1.51-2.75 5.63-9.82 7.76-11.18 2.13-1.35 3.64-.6 3.13 2.2-.5 2.79-9.42 9.55-8.55 11 .86 1.47 3.92-1.71 3.92-1.71s9.58-8.71 11.66-6.44c2.08 2.27-1.58 4.17-6.8 7.33-5.23 3.16-5.63 4-4.9 5.2.75 1.2 12.28-8.53 13.36-4.4 1.08 4.11-11.76 5.3-10.97 8.15.8 2.85 9.05-5.38 10.74-2.18 1.69 3.21-11.65 6.98-11.76 7.01-4.31 1.12-15.26 3.49-19.08-2.12Z" />
      </svg>
    ),
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=BxQ0KDEAAAAJ',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sksaksena',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Reddit',
    href: 'https://www.reddit.com/user/Naive-Explanation940/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
      </svg>
    ),
  },
]

export default function Hero() {
  const hf = useHFStats('dronefreak')
  const gh = useGitHubTotalStars('dronefreak')

  // loading: true  → value pulses while the API call is in flight
  // loading: false → static, never pulses
  // Fallback strings show instantly and are replaced once each API resolves.
  // Grouped by meaning so the ribbon reads Career | Hugging Face | GitHub.
  const statGroups = [
    {
      title: 'Career',
      items: [
        {
          value: '8+',
          label: 'Years',
          href: 'https://www.linkedin.com/in/sksaksena',
          loading: false,
        },
        {
          value: `${authorStats.publications}+`, // single source of truth: src/data/publications.js
          label: 'Publications',
          href: 'https://scholar.google.com/citations?user=BxQ0KDEAAAAJ',
          loading: false,
        },
        {
          value: `${patents.length}`, // no "+": exactly the published patents in src/data/publications.js
          label: 'Patents',
          href: '#patents', // on-page anchor to the Patents cards
          loading: false,
        },
      ],
    },
    {
      title: 'Hugging Face',
      items: [
        {
          value: fmtCount(hf.modelCount, '35+'),
          label: 'Models',
          href: 'https://huggingface.co/dronefreak',
          loading: !hf.loaded,
        },
        {
          value: fmtFull(hf.totalDownloads, '35+'),
          label: 'Downloads',
          href: 'https://huggingface.co/dronefreak',
          loading: !hf.loaded,
        },
        {
          value: fmtCount(hf.totalLikes, '35+'),
          label: 'Likes',
          href: 'https://huggingface.co/dronefreak',
          loading: !hf.loaded,
        },
      ],
    },
    {
      title: 'GitHub',
      items: [
        {
          value: fmtCount(gh.totalStars, '700+'),
          label: 'Stars',
          href: 'https://github.com/dronefreak',
          loading: !gh.loaded,
        },
        {
          value: fmtCount(gh.totalForks, '700+'),
          label: 'Forks',
          href: 'https://github.com/dronefreak',
          loading: !gh.loaded,
        },
        {
          value: fmtCount(gh.repoCount, '30+'),
          label: 'Repos',
          href: 'https://github.com/dronefreak?tab=repositories',
          loading: !gh.loaded,
        },
      ],
    },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid-navy bg-grid opacity-100"
        style={{ backgroundSize: '48px 48px' }}
      />
      {/* Radial fade over grid */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #080F1A 100%)',
        }}
      />
      {/* Top-left glow */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center gap-10 md:gap-12">

          {/* Left: text content */}
          <div className="flex-1 max-w-2xl">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="badge-cyan mb-8 w-fit">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-dot inline-block"
                />
                Perception &nbsp;·&nbsp; Navya Mobility &nbsp;·&nbsp; Paris
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Perception that{' '}
              <span className="text-gradient-cyan block sm:inline">
                keeps machines safe.
              </span>
            </motion.h1>

            {/* Role typewriter */}
            <motion.div
              className="font-mono text-sm md:text-base text-cyan-400/70 mb-6 flex items-center gap-2 h-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
            >
              <span className="text-cyan-400/40" aria-hidden="true">&gt;</span>
              <RoleTypewriter />
            </motion.div>

            {/* Subheadline — keyword strip */}
            <motion.p
              className="font-body text-sm md:text-base text-white/55 leading-relaxed max-w-xl mb-10 flex flex-wrap items-center gap-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {[
                'Real-Time Perception',
                'Edge AI',
                'Autonomous Vehicles',
              ].map((kw, i, arr) => (
                <span key={kw} className="flex items-center">
                  <span className="text-white/65">{kw}</span>
                  {i < arr.length - 1 && (
                    <span className="text-cyan-400/30 mx-2.5 select-none">|</span>
                  )}
                </span>
              ))}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <a
                href="#projects"
                onClick={e => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-primary"
              >
                View Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-secondary"
              >
                Get in touch
              </a>
            </motion.div>


            {/* Social links */}
            <motion.div
              className="flex flex-wrap items-center gap-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              {socialLinks.map((link, i) => (
                <Fragment key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 pr-1.5 whitespace-nowrap text-white/45 hover:text-cyan-400 transition-colors duration-200"
                  >
                    <span
                      className={
                        link.label === 'HuggingFace'
                          ? 'block opacity-45 group-hover:opacity-100 transition-opacity duration-200'
                          : 'block'
                      }
                    >
                      {link.icon}
                    </span>
                    <span className="font-body text-xs sm:text-sm">{link.label}</span>
                  </a>
                  {i < socialLinks.length - 1 && (
                    <span className="text-white/20 select-none pr-1.5" aria-hidden="true">|</span>
                  )}
                </Fragment>
              ))}
            </motion.div>
          </div>

          {/* Right: instrument panel — radar with live stats underneath */}
          <motion.div
            className="glass-card p-5 md:p-6 w-full md:max-w-lg md:justify-self-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-2 font-display font-semibold text-[10px] tracking-[0.14em] uppercase">
              <span className="text-white/35">Skills &amp; stats</span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-dot inline-block" />
                Live
              </span>
            </div>

            <LidarViz className="w-full aspect-[1/0.76]" />

            {/* One row per group: label outside the tiles (beside them on wide screens, above on narrow),
                simple one-word labels inside. Each tile still links out. */}
            <div className="mt-4 space-y-3">
              {statGroups.map(group => (
                <div
                  key={group.title}
                  className="grid grid-cols-3 gap-2 lg:grid-cols-[84px_repeat(3,minmax(0,1fr))] lg:items-center"
                >
                  <h3 className="col-span-3 lg:col-span-1 font-display font-semibold text-[10px] tracking-[0.14em] uppercase text-cyan-400">
                    {group.title}
                  </h3>
                  {group.items.map(stat => (
                    <a
                      key={stat.label}
                      href={stat.href || undefined}
                      target={stat.href && !stat.href.startsWith('#') ? '_blank' : undefined}
                      rel={stat.href && !stat.href.startsWith('#') ? 'noopener noreferrer' : undefined}
                      className={`group flex flex-col justify-center text-center rounded-lg border border-cyan-400/[0.12] bg-white/[0.02] px-1.5 py-3 transition-colors duration-200 ${
                        stat.href ? 'cursor-pointer hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]' : 'cursor-default'
                      }`}
                    >
                      <div
                        className={`font-display font-bold text-lg xl:text-xl leading-tight tabular-nums text-gradient-cyan group-hover:scale-105 transition-transform duration-200 ${
                          stat.loading ? 'animate-pulse opacity-60' : ''
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div className="font-body text-[9px] text-white/40 uppercase tracking-wider leading-tight mt-1">
                        {stat.label}
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        {/* <span className="text-white/25 text-xs font-body tracking-widest uppercase">Scroll</span> */}
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-cyan-400/40 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
