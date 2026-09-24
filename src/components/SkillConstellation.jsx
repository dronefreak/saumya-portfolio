import { useMemo, useRef } from 'react'
import { allSkills } from '../data/skills'
import { useCanvasLoop } from '../hooks/useCanvasLoop'

// Skills as glowing nodes joined by the tools they actually work with. Signals travel
// along the links; hovering a node lights up its connections and dims the rest.
// Positions are normalised (0–1) and hand-placed in loose clusters (ML, edge deploy, robotics, MLOps).

const LAYOUT = {
  Python: [0.48, 0.3],
  PyTorch: [0.26, 0.2],
  TensorFlow: [0.7, 0.2],
  NumPy: [0.3, 0.46],
  ONNX: [0.5, 0.56],
  TensorRT: [0.28, 0.74],
  ROS: [0.09, 0.52],
  RTMaps: [0.14, 0.88],
  MLflow: [0.72, 0.5],
  Jenkins: [0.9, 0.72],
  Git: [0.66, 0.84],
}

const LINKS = [
  ['Python', 'PyTorch'], ['Python', 'TensorFlow'], ['Python', 'NumPy'], ['PyTorch', 'NumPy'],
  ['PyTorch', 'ONNX'], ['TensorFlow', 'ONNX'], ['ONNX', 'TensorRT'],
  ['TensorRT', 'ROS'], ['ROS', 'RTMaps'], ['Python', 'ROS'], ['TensorRT', 'RTMaps'],
  ['PyTorch', 'MLflow'], ['TensorFlow', 'MLflow'], ['NumPy', 'MLflow'],
  ['MLflow', 'Jenkins'], ['Jenkins', 'Git'], ['MLflow', 'Git'],
]

export default function SkillConstellation({ className = '' }) {
  const hover = useRef({ x: -1, y: -1 })

  // Merge layout + skill data once; skills missing from LAYOUT are simply not drawn.
  const nodes = useMemo(
    () =>
      allSkills
        .filter(s => LAYOUT[s.name])
        .map(s => ({
          name: s.name,
          color: s.color,
          fx: LAYOUT[s.name][0],
          fy: LAYOUT[s.name][1],
          logo: s.path ? new Path2D(s.path) : null,
        })),
    []
  )
  const index = useMemo(() => Object.fromEntries(nodes.map((n, i) => [n.name, i])), [nodes])
  const links = useMemo(
    () => LINKS.filter(([a, b]) => a in index && b in index).map(([a, b]) => [index[a], index[b]]),
    [index]
  )

  const { boxRef, canvasRef } = useCanvasLoop((ctx, W, H, t) => {
    const pos = nodes.map((n, i) => [
      n.fx * W + Math.sin(t * 0.0006 + i * 1.7) * 6,
      n.fy * H + Math.cos(t * 0.0005 + i * 2.3) * 6,
    ])

    let hot = -1
    let best = 34
    const { x: mx, y: my } = hover.current
    pos.forEach((p, i) => {
      const d = Math.hypot(p[0] - mx, p[1] - my)
      if (d < best) {
        best = d
        hot = i
      }
    })
    const lit = new Set()
    if (hot >= 0) {
      lit.add(hot)
      links.forEach(([a, b]) => {
        if (a === hot) lit.add(b)
        if (b === hot) lit.add(a)
      })
    }

    links.forEach(([a, b], k) => {
      const on = hot < 0 || a === hot || b === hot
      ctx.strokeStyle = on ? `rgba(34,211,238,${hot < 0 ? 0.2 : 0.55})` : 'rgba(34,211,238,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pos[a][0], pos[a][1])
      ctx.lineTo(pos[b][0], pos[b][1])
      ctx.stroke()
      if (on) {
        const u = (t * 0.00035 + k * 0.37) % 1
        ctx.fillStyle = 'rgba(34,211,238,0.9)'
        ctx.beginPath()
        ctx.arc(pos[a][0] + (pos[b][0] - pos[a][0]) * u, pos[a][1] + (pos[b][1] - pos[a][1]) * u, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    ctx.font = '500 12px "Space Grotesk", Inter, system-ui, sans-serif'
    ctx.textBaseline = 'middle'
    nodes.forEach((n, i) => {
      const [x, y] = pos[i]
      const r = i === hot ? 17 : 14
      ctx.globalAlpha = hot >= 0 && !lit.has(i) ? 0.3 : 1

      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6)
      g.addColorStop(0, `${n.color}55`)
      g.addColorStop(1, `${n.color}00`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r * 2.6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#0B1626'
      ctx.strokeStyle = n.color
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = n.color
      if (n.logo) {
        const s = (r * 1.15) / 24
        ctx.save()
        ctx.translate(x - 12 * s, y - 12 * s)
        ctx.scale(s, s)
        ctx.fill(n.logo)
        ctx.restore()
      } else {
        ctx.beginPath()
        ctx.arc(x, y, r * 0.32, 0, Math.PI * 2)
        ctx.fill()
      }

      const left = n.fx > 0.72
      ctx.textAlign = left ? 'right' : 'left'
      ctx.fillStyle = i === hot ? '#F0F9FF' : n.color
      ctx.fillText(n.name, x + (left ? -(r + 8) : r + 8), y)
      ctx.globalAlpha = 1
    })
  })

  const onMove = e => {
    const r = boxRef.current.getBoundingClientRect()
    hover.current = { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onLeave = () => {
    hover.current = { x: -1, y: -1 }
  }

  return (
    <div
      ref={boxRef}
      className={`relative ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label={`Skills constellation: ${nodes.map(n => n.name).join(', ')}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
