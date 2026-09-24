import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { allSkills, sensors, pipeline, study, loopFrom } from '../data/skills'

// The Toolkit section: skills laid out along the actual workflow, literature review to robot,
// with a loop from `loopFrom` back to Study ("iterate"). Data lives in src/data/skills.js.
//
// xl+: every stage side by side; the loop is a dashed bracket ABOVE the row.
// Below xl: one vertical timeline; the same loop is a bracket down the LEFT side, with the
// label turned vertical. Either way the loop's ends are computed from the same geometry as the
// nodes (the grid's column centres, or the measured row positions), so they meet the dots exactly.

const byName = Object.fromEntries([...allSkills, ...sensors].map(s => [s.name, s]))
const CYAN = '#22D3EE'
const stages = [study, ...pipeline]
const loopIndex = Math.max(1, stages.findIndex(s => s.stage === loopFrom))
const LOOP = `${study.color}99` // dashed loop line color

// ─── Geometry shared by the nodes and the loop (px unless noted) ──────────────
const cols = stages.length
const GAP = 12 // grid gap between columns
// Half a column, and the distance between neighbouring column centres, as CSS calc() strings.
// Percentages are of the container width, so these track the grid at any width.
const COL_HALF = `calc((100% - ${(cols - 1) * GAP}px) / ${2 * cols})`
const COL_STEP = `((100% - ${(cols - 1) * GAP}px) / ${cols} + ${GAP}px)`
const WIDE_PT = 44 // top padding of the wide layout; nodes are centred in a 20px row below it
const NODE_TOP = WIDE_PT + 5 // top edge of a 10px node
const GAP_TO_NODE = 2 // loop lines stop this far short of a node
const LOOP_TOP = 6
const ARROW = 8 // arrowhead length
const BRACKET_X = 4 // narrow layout: x of the bracket's vertical line
const NODE_X = 25 // narrow layout: x of the node centres (see pl-12 and the -left-7 nodes below)

// item: a skill name (string) or { name, href }. Colors come from the skill data;
// anything unknown falls back to `fallbackColor`, or a neutral grey.
function Chip({ item, fallbackColor }) {
  const { name, href, color: ownColor } = typeof item === 'string' ? { name: item } : item
  const skill = byName[name]
  const color = ownColor ?? skill?.color ?? fallbackColor
  const className =
    'inline-flex items-center gap-2 rounded-full border border-cyan-400/[0.12] bg-white/[0.03] py-1 pl-2 pr-3 font-body text-xs text-white/80' +
    (href ? ' hover:border-cyan-400/30 hover:text-white transition-colors duration-200' : '')

  const content = (
    <>
      {skill?.path && !ownColor ? (
        <svg width="13" height="13" viewBox={skill.viewBox} fill={skill.color} aria-hidden="true">
          <path d={skill.path} />
        </svg>
      ) : (
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: color ?? 'rgba(240,249,255,0.35)',
            boxShadow: color ? `0 0 8px ${color}` : 'none',
          }}
          aria-hidden="true"
        />
      )}
      {name}
      {href && <span aria-hidden="true">↗</span>}
    </>
  )

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  )
}

function Node({ color = CYAN }) {
  return (
    <span
      className="block w-2.5 h-2.5 rounded-full border-2 bg-navy-900"
      style={{ borderColor: color, boxShadow: `0 0 10px ${color}80` }}
    />
  )
}

function Stage({ stage, index, horizontal }) {
  const color = stage.color ?? CYAN
  return (
    <motion.div
      data-stage={stage.stage}
      className={horizontal ? 'flex flex-col items-center text-center' : 'relative'}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      {horizontal ? (
        <div className="h-5 flex items-center">
          <Node color={color} />
        </div>
      ) : (
        <div className="absolute -left-7 top-1">
          <Node color={color} />
        </div>
      )}
      <h3
        className={`font-display font-semibold text-[11px] tracking-[0.16em] uppercase ${horizontal ? 'mt-4' : ''}`}
        style={{ color }}
      >
        {stage.stage}
      </h3>
      <p className="font-body text-xs text-white/40 mb-3">{stage.blurb}</p>
      <div className={`flex flex-wrap gap-1.5 ${horizontal ? 'justify-center' : ''}`}>
        {stage.items.map(item => (
          <Chip key={typeof item === 'string' ? item : item.name} item={item} fallbackColor={color} />
        ))}
      </div>
    </motion.div>
  )
}

// ─── The travelling dot ───────────────────────────────────────────────────────
// It runs the whole cycle: Study → every stage → the last stage → up and back along the loop → Study.
// The path is computed in px from the same geometry as the nodes and the loop, so it rides on them.

const arc = (cx, cy, r, from, to, steps = 6) =>
  Array.from({ length: steps }, (_, k) => {
    const a = from + ((to - from) * (k + 1)) / steps
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })

// Wide layout: along the node row to the last stage, up its side of the loop, back over the top, down into Study.
function widePath(W) {
  const colW = (W - (cols - 1) * GAP) / cols
  const x0 = colW / 2
  const x1 = x0 + loopIndex * (colW + GAP)
  const yN = WIDE_PT + 10
  const yT = LOOP_TOP
  const r = 14
  return [
    [x0, yN], [x1, yN], [x1, yT + r],
    ...arc(x1 - r, yT + r, r, 0, -Math.PI / 2),
    [x0 + r, yT],
    ...arc(x0 + r, yT + r, r, -Math.PI / 2, -Math.PI),
    [x0, yN],
  ]
}

// Narrow layout: down the timeline to the last stage, left onto the bracket, up it, right into Study.
function narrowPath(yStart, yEnd) {
  const r = 14
  const bx = BRACKET_X + r
  return [
    [NODE_X, yStart], [NODE_X, yEnd], [bx, yEnd],
    ...arc(bx, yEnd - r, r, Math.PI / 2, Math.PI),
    [BRACKET_X, yStart + r],
    ...arc(bx, yStart + r, r, Math.PI, (3 * Math.PI) / 2),
    [NODE_X, yStart],
  ]
}

// Cyan while it runs the stages (until it reaches the last one), gold once it takes the loop.
function TravelDot({ points }) {
  const anim = useMemo(() => {
    const dist = [0]
    for (let i = 1; i < points.length; i++) {
      dist.push(dist[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]))
    }
    const total = dist[dist.length - 1]
    const split = dist[1] / total // reaches the last stage here
    return {
      xs: points.map(p => p[0]),
      ys: points.map(p => p[1]),
      times: dist.map(d => d / total),
      split,
      duration: Math.max(6, total / 240), // ~240px per second
    }
  }, [points])

  const line = { duration: anim.duration, ease: 'linear', repeat: Infinity }
  const colorTimes = [0, anim.split, Math.min(1, anim.split + 0.03), 1]
  return (
    <motion.span
      className="absolute left-0 top-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none"
      aria-hidden="true"
      animate={{
        x: anim.xs,
        y: anim.ys,
        opacity: [0, 1, 1, 0],
        backgroundColor: [CYAN, CYAN, study.color, study.color],
        boxShadow: [`0 0 12px ${CYAN}`, `0 0 12px ${CYAN}`, `0 0 12px ${study.color}`, `0 0 12px ${study.color}`],
      }}
      transition={{
        x: { ...line, times: anim.times },
        y: { ...line, times: anim.times },
        opacity: { ...line, times: [0, 0.015, 0.985, 1] },
        backgroundColor: { ...line, times: colorTimes },
        boxShadow: { ...line, times: colorTimes },
      }}
    />
  )
}

const LABEL_CLASS = 'font-display font-semibold text-[10px] tracking-[0.22em] uppercase bg-navy-900'

export default function SkillPipeline() {
  const reduced = useReducedMotion()

  // Below xl the bracket runs between the Study node and the loopFrom node. Their positions
  // depend on how the chips wrap, so measure them (and re-measure when the list resizes).
  const listRef = useRef(null)
  const wideRef = useRef(null)
  const [span, setSpan] = useState(null)
  const [wideW, setWideW] = useState(0)
  useLayoutEffect(() => {
    const el = wideRef.current
    if (!el) return
    const measure = () => setWideW(el.offsetWidth) // 0 while hidden below xl
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const from = list.querySelector(`[data-stage="${loopFrom}"]`)
      const to = list.querySelector(`[data-stage="${study.stage}"]`)
      if (!from || !to || !list.offsetHeight) return // hidden at xl+, measured when it shows
      // A node is 10px tall at top-1 (4px) of its stage, so its centre is 9px down.
      const yStart = to.offsetTop + 9
      const yEnd = from.offsetTop + 9
      const bottom = list.offsetHeight - yEnd
      // Keep the same object when nothing moved, so the travelling dot is not restarted needlessly.
      setSpan(prev => (prev && prev.top === yStart && prev.bottom === bottom ? prev : { top: yStart, bottom, yStart, yEnd }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [])

  // Memoised so the dot's animation only restarts when the geometry actually changes.
  const widePoints = useMemo(() => (wideW > 0 ? widePath(wideW) : null), [wideW])
  const narrowPoints = useMemo(() => (span ? narrowPath(span.yStart, span.yEnd) : null), [span])

  return (
    <>
      {/* xl+: all stages on one line; the loop is a bracket above the row, from loopFrom back to Study */}
      <div ref={wideRef} className="relative hidden xl:block" style={{ paddingTop: WIDE_PT }}>
        <div
          className="absolute h-px"
          style={{
            top: WIDE_PT + 9.5, // 1px line centred on the nodes' centre line
            left: COL_HALF,
            right: COL_HALF,
            background: `linear-gradient(90deg, ${study.color}99, rgba(34,211,238,0.5) 14%, rgba(34,211,238,0.1))`,
          }}
        />
        {!reduced && widePoints && <TravelDot points={widePoints} />}

        {/* The loop's box runs from the Study node's centre line to the loopFrom node's, and from
            LOOP_TOP down to just above the nodes. Its lines are centred on those edges. */}
        <div
          className="absolute"
          style={{
            top: LOOP_TOP,
            height: NODE_TOP - GAP_TO_NODE - LOOP_TOP,
            left: COL_HALF,
            width: `calc(${loopIndex} * ${COL_STEP})`,
          }}
          aria-hidden="true"
        >
          <div
            className="absolute"
            style={{
              inset: '-0.75px -0.75px 0 -0.75px',
              border: `1.5px dashed ${LOOP}`,
              borderBottom: 0,
              borderRadius: '14px 14px 0 0',
            }}
          />
          {/* arrowhead: tip on the box's bottom edge, centred on the Study node */}
          <span
            className="absolute left-0 bottom-0 -translate-x-1/2"
            style={{
              borderTop: `${ARROW}px solid ${study.color}`,
              borderLeft: '5.5px solid transparent',
              borderRight: '5.5px solid transparent',
            }}
          />
          <span
            className={`${LABEL_CLASS} absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-2`}
            style={{ color: study.color }}
          >
            Iterate
          </span>
        </div>

        <div className="relative grid" style={{ gap: GAP, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {stages.map((stage, i) => (
            <Stage key={stage.stage} stage={stage} index={i} horizontal />
          ))}
        </div>
      </div>

      {/* below xl: one stage per row down a vertical line; the loop is a bracket on the left that
          runs into the node dots, with its label turned vertical */}
      <div ref={listRef} className="relative xl:hidden pl-12 space-y-7">
        <div
          className="absolute top-2 bottom-2 w-px"
          style={{
            left: NODE_X - 0.5,
            background: `linear-gradient(to bottom, ${study.color}99, rgba(34,211,238,0.5) 12%, rgba(34,211,238,0.1))`,
          }}
        />
        {!reduced && narrowPoints && <TravelDot points={narrowPoints} />}

        {span && (
          <div
            className="absolute"
            style={{
              top: span.top,
              bottom: span.bottom,
              left: BRACKET_X,
              width: NODE_X - 5 - GAP_TO_NODE - BRACKET_X, // stops GAP_TO_NODE short of the node's left edge
            }}
            aria-hidden="true"
          >
            <div
              className="absolute"
              style={{
                inset: '-0.75px 0 -0.75px -0.75px',
                border: `1.5px dashed ${LOOP}`,
                borderRight: 0,
                borderRadius: '14px 0 0 14px',
              }}
            />
            {/* arrowhead: tip on the box's right edge, centred on the Study node's row */}
            <span
              className="absolute right-0 top-0 -translate-y-1/2"
              style={{
                borderLeft: `${ARROW}px solid ${study.color}`,
                borderTop: '5.5px solid transparent',
                borderBottom: '5.5px solid transparent',
              }}
            />
            <span
              className={`${LABEL_CLASS} absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 py-2 px-[3px]`}
              style={{ color: study.color, writingMode: 'vertical-rl' }}
            >
              Iterate
            </span>
          </div>
        )}

        {stages.map((stage, i) => (
          <Stage key={stage.stage} stage={stage} index={i} horizontal={false} />
        ))}
      </div>
    </>
  )
}
