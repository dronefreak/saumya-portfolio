import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { story } from '../data/experience'

const ChevronIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

function StoryNode({ node, index, open, onToggle, markerRef }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const onKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <motion.div
      ref={ref}
      id={`story-${node.id}`}
      className="relative flex items-start gap-0 md:gap-6"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
    >
      {/* Marker (desktop) — sits on the shared rail the parent draws behind every row, so all
          five line up in one straight vertical line regardless of how tall each card is. */}
      <div className="hidden md:flex flex-col items-center w-10 flex-shrink-0 relative z-10">
        <div
          ref={markerRef}
          className="w-10 h-10 rounded-full border-2 border-cyan-400/60 bg-navy-900 flex items-center justify-center flex-shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/70" />
          {/* Outer pulse ring — first card is the current role */}
          {index === 0 && (
            <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
          )}
        </div>
      </div>

      {/* Mobile node indicator */}
      <div className="flex md:hidden items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full border border-cyan-400/50 bg-navy-900 flex items-center justify-center flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400/70" />
        </div>
        <div className="flex-1 h-px bg-cyan-400/20" />
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 glass-card p-6 md:p-8">
        {/* Clickable header — theme, company/period, headline. Always visible; toggles the rest.
            Each field is clamped and the headline reserves 2 lines' worth of height, so every
            card's collapsed header — and the card itself, at rest — is the same height. */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="cursor-pointer select-none"
        >
          {/* Theme label */}
          <span className="section-label text-[10px] mb-3 block line-clamp-1">{node.theme}</span>

          {/* Company + period */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-lg text-white leading-tight line-clamp-1" title={node.company}>
                {node.company}
              </h3>
              <p className="font-body text-sm text-white/50 line-clamp-1" title={`${node.role} · ${node.location}`}>
                {node.role} &nbsp;·&nbsp; {node.location}
              </p>
            </div>
            <span className="font-body text-xs text-cyan-400/70 border border-cyan-400/20 rounded-full px-3 py-1 flex-shrink-0">
              {node.period}
            </span>
          </div>

          {/* Headline + chevron — min-h-[44px] reserves 2 lines even when the headline is short */}
          <div className="flex items-start justify-between gap-3 min-h-[44px]">
            <p className="font-display font-semibold text-base text-white/90 leading-snug line-clamp-2">
              "{node.headline}"
            </p>
            <ChevronIcon
              className={`flex-shrink-0 mt-1 w-4 h-4 text-cyan-400/60 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Collapsible: description, stats, constraint, tags */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Description */}
              <p className="font-body text-sm text-white/50 leading-relaxed mt-4 mb-5">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Compact at-a-glance timeline: labels alternate above/below a single line.
// Desktop only — on mobile the numbered cards below already form a vertical timeline.
function StoryStrip({ onNavigate }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const total = story.length
  const [hovered, setHovered] = useState(null)

  const jumpTo = (e, id) => {
    e.preventDefault()
    onNavigate?.(id)
    // Let the card start growing before the browser computes the scroll target, so it centres
    // on roughly where the (now expanding) card ends up rather than its collapsed position.
    requestAnimationFrame(() => {
      document.getElementById(`story-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <div ref={ref} className="hidden md:block relative mb-16">
      {/* Spine — spans first-to-last node centre, gradient through the node colours */}
      <motion.div
        className="absolute top-1/2 h-px -translate-y-1/2 origin-left"
        style={{
          left: `${50 / total}%`,
          right: `${50 / total}%`,
          background: `linear-gradient(90deg, ${story.map(n => n.accent).join(', ')})`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />

      <div className="grid" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {story.map((node, i) => {
          const above = i % 2 === 0
          const isLast = i === total - 1
          const label = (
            <a
              href={`#story-${node.id}`}
              onClick={e => jumpTo(e, node.id)}
              className="group block text-center px-2"
            >
              <div className="font-display font-bold text-sm" style={{ color: node.accent }}>
                {node.period}
              </div>
              <div className="font-display font-semibold text-sm leading-snug text-white/85 underline decoration-transparent underline-offset-4 group-hover:text-white group-hover:decoration-current transition-colors duration-200">
                {node.company}
              </div>
              <div className="font-body text-[11px] text-white/40 leading-snug">{node.theme}</div>
            </a>
          )
          const stem = <div className="w-px h-5 mx-auto" style={{ background: node.accent, opacity: 0.5 }} />
          const isHovered = hovered === node.id

          // Achievements popover — lives in the empty slot opposite the label, so nothing shifts.
          const popover = node.hoverLines && (
            <div className={`absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none ${above ? 'top-2' : 'bottom-2'}`}>
              <motion.ul
                className="w-44 glass-card p-3 space-y-1.5 text-left"
                style={{ borderColor: `${node.accent}66` }}
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : above ? -6 : 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {node.hoverLines.map(line => (
                  <li key={line} className="flex gap-2 font-body text-[11px] leading-snug text-white/80">
                    <span className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: node.accent }} />
                    {line}
                  </li>
                ))}
              </motion.ul>
            </div>
          )

          return (
            <motion.div
              key={node.id}
              className={`relative flex flex-col items-center ${isHovered ? 'z-20' : ''}`}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              initial={{ opacity: 0, y: above ? 10 : -10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.15 }}
            >
              {/* Top slot */}
              <div className="relative h-28 flex flex-col justify-end">
                {above ? (<>{label}{stem}</>) : popover}
              </div>

              {/* Node */}
              <motion.div
                className="relative h-5 w-5 flex items-center justify-center"
                animate={{ scale: isHovered ? 1.6 : 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <span
                  className={`block bg-navy-900 border-2 transition-shadow duration-200 ${node.kind === 'research' ? 'w-3.5 h-3.5 rotate-45' : 'w-4 h-4 rounded-full'}`}
                  style={{
                    borderColor: node.accent,
                    boxShadow: isHovered ? `0 0 22px ${node.accent}CC` : `0 0 12px ${node.accent}66`,
                  }}
                />
                {isLast && (
                  <span
                    className="absolute inset-0 rounded-full border animate-ping"
                    style={{ borderColor: `${node.accent}66` }}
                  />
                )}
              </motion.div>

              {/* Bottom slot */}
              <div className="relative h-28 flex flex-col justify-start">
                {above ? popover : (<>{stem}{label}</>)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function Story() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  // Lifted here (not per-card) so the strip above can open a specific card on click.
  const [openIds, setOpenIds] = useState(() => new Set())
  const openCard = id => setOpenIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)))
  const toggleCard = id =>
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const orderedStory = [...story].reverse()

  // The shared rail: one line + one travelling pulse spanning the first marker's centre to the
  // last's, drawn behind the cards. Positioned imperatively (not via React state) so it tracks
  // continuously while a card's expand/collapse animation is mid-flight, not just before/after it.
  const listRef = useRef(null)
  const lineRef = useRef(null)
  const pulseWrapRef = useRef(null)
  const markerRefs = useRef([])

  useLayoutEffect(() => {
    const container = listRef.current
    if (!container) return

    const measure = () => {
      const marks = markerRefs.current.filter(Boolean)
      const line = lineRef.current
      const pulseWrap = pulseWrapRef.current
      if (marks.length < 2 || !line || !pulseWrap) return
      const containerBox = container.getBoundingClientRect()
      const first = marks[0].getBoundingClientRect()
      const last = marks[marks.length - 1].getBoundingClientRect()
      const top = `${first.top - containerBox.top + first.height / 2}px`
      const height = `${last.top - first.top}px`
      line.style.top = top
      line.style.height = height
      pulseWrap.style.top = top
      pulseWrap.style.height = height
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="story" className="relative py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label block mb-4">Experience</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-5">
            From drones{' '}
            <span className="text-gradient-cyan">to driverless vehicles.</span>
          </h2>
          <p className="font-body text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            What I actually care about: compressing models until they run on real edge hardware (pruning, quantization); benchmarks and codebases other people can trust, rerun, and get the same numbers from; and scene understanding for autonomous systems, UAVs first, now self-driving, where real-time and memory limits aren't optional.
          </p>
        </motion.div>

        {/* At-a-glance strip — clicking a node scrolls to and expands its card below */}
        <StoryStrip onNavigate={openCard} />

        {/* Timeline — every marker sits on one shared left-hand rail (desktop); mobile keeps its
            own simple per-card indicator, no shared line */}
        <div className="relative" ref={listRef}>
          <div
            ref={lineRef}
            className="hidden md:block absolute left-5 w-px z-0 bg-gradient-to-b from-cyan-400/40 via-cyan-400/25 to-cyan-400/10"
            style={{ top: 0, height: 0 }}
          />
          <div
            ref={pulseWrapRef}
            className="hidden md:block absolute left-5 w-px z-0"
            style={{ top: 0, height: 0 }}
          >
            <span className="story-pulse-dot" />
          </div>

          <div className="space-y-8 md:space-y-10">
            {orderedStory.map((node, i) => (
              <StoryNode
                key={node.id}
                node={node}
                index={i}
                open={openIds.has(node.id)}
                onToggle={() => toggleCard(node.id)}
                markerRef={el => {
                  markerRefs.current[i] = el
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
