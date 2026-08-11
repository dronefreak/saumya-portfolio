import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { story } from '../data/experience'

function StoryNode({ node, index, total }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const isRight = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      className={`relative flex flex-col md:flex-row items-start gap-0 md:gap-8 ${
        isRight ? 'md:flex-row-reverse' : ''
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
    >
      {/* Timeline spine + node (desktop) */}
      <div className="hidden md:flex flex-col items-center w-16 flex-shrink-0">
        {/* Connector line above */}
        {index > 0 && (
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-cyan-400/30" />
        )}
        {/* Node circle */}
        <div className="relative z-10 w-10 h-10 rounded-full border-2 border-cyan-400/60 bg-navy-900 flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-sm text-cyan-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Outer pulse ring */}
          {index === total - 1 && (
            <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
          )}
        </div>
        {/* Connector line below */}
        {index < total - 1 && (
          <div className="flex-1 w-px bg-gradient-to-b from-cyan-400/30 to-transparent min-h-[60px]" />
        )}
      </div>

      {/* Mobile node indicator */}
      <div className="flex md:hidden items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full border border-cyan-400/50 bg-navy-900 flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-xs text-cyan-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex-1 h-px bg-cyan-400/20" />
      </div>

      {/* Card */}
      <div className={`flex-1 glass-card p-6 md:p-8 mb-6 md:mb-0 ${isRight ? 'md:mr-8' : 'md:ml-0'}`}>
        {/* Theme label */}
        <span className="section-label text-[10px] mb-3 block">{node.theme}</span>

        {/* Company + period */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-white leading-tight">
              {node.company}
            </h3>
            <p className="font-body text-sm text-white/50">{node.role} &nbsp;·&nbsp; {node.location}</p>
          </div>
          <span className="font-body text-xs text-cyan-400/70 border border-cyan-400/20 rounded-full px-3 py-1 flex-shrink-0">
            {node.period}
          </span>
        </div>

        {/* Headline */}
        <p className="font-display font-semibold text-base text-white/90 mb-3 leading-snug">
          "{node.headline}"
        </p>

        {/* Description */}
        <p className="font-body text-sm text-white/50 leading-relaxed mb-5">
          {node.description}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="glass-card px-4 py-2.5 flex-shrink-0" style={{ background: 'rgba(34,211,238,0.05)' }}>
            <div className="font-display font-bold text-xl text-cyan-400">{node.stat.value}</div>
            <div className="font-body text-xs text-white/40">{node.stat.label}</div>
          </div>
          <div className="flex-1">
            <p className="font-body text-xs text-white/35 italic leading-relaxed">
              {node.constraint}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {node.tags.map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block w-16 flex-shrink-0" />
    </motion.div>
  )
}

export default function Story() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  return (
    <section id="story" className="relative py-28">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headRef}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label block mb-4">The Arc</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-5">
            Six years.{' '}
            <span className="text-gradient-cyan">One constraint.</span>
          </h2>
          <p className="font-body text-base text-white/45 max-w-xl mx-auto leading-relaxed mb-4">
            Make it see, make it fast, make it safe.
          </p>
          <p className="font-body text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            What I actually care about: compressing models until they run on real edge hardware (pruning, quantization); benchmarks and codebases other people can trust, rerun, and get the same numbers from; and scene understanding for autonomous systems, UAVs first, now self-driving, where real-time and memory limits aren't optional.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {story.map((node, i) => (
            <StoryNode key={node.id} node={node} index={i} total={story.length} />
          ))}
        </div>

      </div>
    </section>
  )
}
