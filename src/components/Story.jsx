import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { story } from '../data/experience'

// Stable reference (module scope, built once) — the strip re-renders on every node hover,
// and a fresh array literal each time makes Framer Motion treat the pulse's `animate` target
// as having changed, independently resyncing each animated property and drifting them apart.
const PULSE_FADE = [0, 1, 1, 0]

// For the vertical rail's pulse: its colour is sampled from the same live gradient stops the
// line itself uses, which are plain hex strings built at runtime — nothing here can rely on
// Framer Motion's own colour interpolation, so this does it by hand.
function lerpRGB(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16)
  const b = parseInt(hexB.slice(1), 16)
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255
  return [Math.round(ar + (br - ar) * t), Math.round(ag + (bg - ag) * t), Math.round(ab + (bb - ab) * t)]
}

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
      className={`relative flex gap-0 md:gap-6 ${open ? 'items-start' : 'items-center'}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
    >
      {/* Marker (desktop) — sits on the shared rail the parent draws behind every row, so all
          five line up in one straight vertical line regardless of how tall each card is.
          Coloured per node (and diamond for the MSc thesis), matching the at-a-glance strip. */}
      <div className="hidden md:flex flex-col items-center w-10 flex-shrink-0 relative z-10">
        <div
          ref={markerRef}
          className={`bg-navy-900 flex items-center justify-center flex-shrink-0 ${
            node.kind === 'research' ? 'w-8 h-8 rotate-45' : 'w-10 h-10 rounded-full'
          }`}
          style={{ border: `2px solid ${node.accent}99` }}
        >
          <span
            className={`rounded-full ${node.kind === 'research' ? 'w-2 h-2 -rotate-45' : 'w-2.5 h-2.5'}`}
            style={{ background: `${node.accent}B3` }}
          />
          {/* Outer pulse ring — first card is the current role */}
          {index === 0 && (
            <span
              className={`absolute inset-0 border animate-ping ${node.kind === 'research' ? '' : 'rounded-full'}`}
              style={{ borderColor: `${node.accent}4D` }}
            />
          )}
        </div>
      </div>

      {/* Mobile node indicator */}
      <div className="flex md:hidden items-center gap-3 mb-4">
        <div
          className={`bg-navy-900 flex items-center justify-center flex-shrink-0 ${
            node.kind === 'research' ? 'w-7 h-7 rotate-45' : 'w-8 h-8 rounded-full'
          }`}
          style={{ border: `1px solid ${node.accent}80` }}
        >
          <span
            className={`rounded-full ${node.kind === 'research' ? 'w-1.5 h-1.5 -rotate-45' : 'w-2 h-2'}`}
            style={{ background: `${node.accent}B3` }}
          />
        </div>
        <div className="flex-1 h-px" style={{ background: `${node.accent}33` }} />
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
            <span
              className="font-body text-xs border rounded-full px-3 py-1 flex-shrink-0"
              style={{ color: node.accent, borderColor: `${node.accent}33` }}
            >
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
  const reduced = useReducedMotion()
  // The spine's own gradient runs through these same colours, evenly spaced — Framer Motion
  // defaults to evenly-spaced keyframes too, so animating `left` and `backgroundColor` through
  // these same arrays together makes the dot's colour match the gradient at wherever it is,
  // not just a fixed accent colour riding on top of it.
  // Memoised (see PULSE_FADE above) so hover-triggered re-renders don't desync the dot's
  // position from its colour.
  const accents = useMemo(() => story.map(n => n.accent), [])
  // Each node's horizontal centre as a % of the full strip width — the same coordinate system
  // the `total`-column node grid below uses, so the dot lands exactly on each node in turn.
  const pulsePositions = useMemo(() => accents.map((_, i) => `${((i + 0.5) / total) * 100}%`), [accents, total])
  const pulseShadows = useMemo(() => accents.map(c => `0 0 10px 2px ${c}CC`), [accents])
  const pulseTransition = useMemo(
    () => ({
      left: { duration: 4, repeat: Infinity, ease: 'linear' },
      backgroundColor: { duration: 4, repeat: Infinity, ease: 'linear' },
      boxShadow: { duration: 4, repeat: Infinity, ease: 'linear' },
      opacity: { duration: 4, repeat: Infinity, ease: 'linear', times: [0, 0.04, 0.96, 1] },
    }),
    []
  )

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
          background: `linear-gradient(90deg, ${accents.join(', ')})`,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />

      {/* Pulse travelling left (2016, oldest) to right (current role) along the spine, its
          colour matching the gradient at its current position — only once the spine itself
          has drawn in, so it never animates over an empty line. `left` is a % of the strip's
          full width (not the spine's own span), same coordinate system the node grid below
          uses, and vertical centring reuses the spine's own top-1/2/-translate-y-1/2 pair
          directly rather than a hand-computed pixel offset, so the two can't drift apart. */}
      {inView && !reduced && (
        <motion.span
          className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            left: pulsePositions,
            backgroundColor: accents,
            boxShadow: pulseShadows,
            // Fades only right at the loop seam (not at each node) so restarting left:100%→0%
            // doesn't look like an instant jump, without touching the constant-speed travel.
            opacity: PULSE_FADE,
          }}
          transition={pulseTransition}
        />
      )}

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
  const pulseDotRef = useRef(null)
  const markerRefs = useRef([])

  useLayoutEffect(() => {
    const container = listRef.current
    if (!container) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const PULSE_MS = 3500

    const measure = now => {
      const marks = markerRefs.current.filter(Boolean)
      const line = lineRef.current
      const pulseWrap = pulseWrapRef.current
      const dot = pulseDotRef.current
      if (marks.length < 2 || !line || !pulseWrap) return
      const containerBox = container.getBoundingClientRect()
      const rects = marks.map(el => el.getBoundingClientRect())
      const first = rects[0]
      const last = rects[rects.length - 1]
      const topPx = first.top - containerBox.top + first.height / 2
      const heightPx = last.top - first.top
      line.style.top = `${topPx}px`
      line.style.height = `${heightPx}px`
      pulseWrap.style.top = `${topPx}px`
      pulseWrap.style.height = `${heightPx}px`

      // Each node's own *measured* position along the rail, not an assumed even split — cards
      // can be taller or shorter than each other once expanded, so this keeps both the line's
      // colour stops and the pulse's colour lined up with their actual markers instead of
      // drifting once the rail height isn't evenly divided among them.
      const fracs = rects.map((r, i) =>
        heightPx > 0 ? ((r.top - containerBox.top + r.height / 2) - topPx) / heightPx : i / (rects.length - 1)
      )
      const colors = orderedStory.map(n => n.accent)
      line.style.background = `linear-gradient(to bottom, ${fracs.map((f, i) => `${colors[i]} ${(f * 100).toFixed(1)}%`).join(', ')})`

      if (!dot || reduced) return
      // Pulse: a bottom(oldest)→top(current) loop. `travel` is how far up the rail it's got to
      // (1 = bottom, 0 = top) — the inverse of the usual "progress" so it reads with the timeline.
      const t = (now % PULSE_MS) / PULSE_MS
      const travel = 1 - t
      let seg = 0
      while (seg < fracs.length - 2 && travel > fracs[seg + 1]) seg++
      const span = fracs[seg + 1] - fracs[seg]
      const localT = span > 0 ? Math.min(1, Math.max(0, (travel - fracs[seg]) / span)) : 0
      const [r, g, b] = lerpRGB(colors[seg], colors[seg + 1], localT)
      const opacity = t < 0.04 ? t / 0.04 : t > 0.96 ? (1 - t) / 0.04 : 1
      dot.style.top = `${travel * 100}%`
      dot.style.background = `rgb(${r}, ${g}, ${b})`
      dot.style.boxShadow = `0 0 10px 2px rgba(${r}, ${g}, ${b}, 0.8)`
      dot.style.opacity = opacity
    }

    // Measured every frame rather than only on resize/content-size changes: each card's
    // entrance animation (and the strip's click-to-expand) move the markers via a transform
    // and a height tween, neither of which ResizeObserver reliably catches mid-flight, so a
    // one-shot or resize-only measurement goes stale the moment those are still animating.
    // The cost of a few getBoundingClientRect calls a frame is cheap enough to just always run.
    let raf
    const loop = now => {
      measure(now)
      raf = requestAnimationFrame(loop)
    }
    loop(performance.now())
    return () => cancelAnimationFrame(raf)
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
            className="hidden md:block absolute left-5 w-px z-0"
            style={{ top: 0, height: 0 }}
          />
          <div
            ref={pulseWrapRef}
            className="hidden md:block absolute left-5 w-px z-0"
            style={{ top: 0, height: 0 }}
          >
            <span ref={pulseDotRef} className="story-pulse-dot" style={{ opacity: 0 }} />
          </div>

          <div>
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
