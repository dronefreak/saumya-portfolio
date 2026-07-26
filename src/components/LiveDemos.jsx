import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { demos } from '../data/demos'

function DemoCard({ demo, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-dot flex-shrink-0" />
              <span className="section-label text-[10px]">Live Demo</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white leading-tight">
              {demo.title}
            </h3>
          </div>
          <a
            href={demo.spaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-white/40 hover:text-cyan-400 transition-colors flex-shrink-0 mt-1"
          >
            Open in Hugging Face ↗
          </a>
        </div>
        <p className="font-body text-sm text-white/50 leading-relaxed mb-4">
          {demo.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {demo.tags.map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </div>

      {/* Iframe embed */}
      <div className="relative" style={{ height: '500px' }}>
        {/* Loading placeholder */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-800/50 gap-3">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-white/30 text-sm font-body">Loading Space…</span>
          </div>
        )}
        <iframe
          src={demo.embedUrl}
          title={demo.title}
          width="100%"
          height="100%"
          className="border-0"
          onLoad={() => setLoaded(true)}
          loading="lazy"
          allow="camera;microphone"
        />
      </div>
    </motion.div>
  )
}

export default function LiveDemos() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  return (
    <section id="demos" className="relative py-28">
      {/* Section background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          ref={headRef}
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label block mb-4">Interactive</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Try it.{' '}
            <span className="text-gradient-cyan">Right here.</span>
          </h2>
          <p className="font-body text-base text-white/45 max-w-lg leading-relaxed">
            Live demos running on Hugging Face Spaces. Upload your own images (no sign-in required).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {demos.map((demo, i) => (
            <DemoCard key={demo.id} demo={demo} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
