import { useMemo } from 'react'
import { allSkills } from '../data/skills'
import { useCanvasLoop } from '../hooks/useCanvasLoop'

// A slowly rotating LiDAR scan: concentric ground returns plus one object per skill,
// each tagged like a labeled detection. Everything is seeded, so the scene is the same
// on every load. Add a skill to src/data/skills.js and it gets an object automatically.

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Object footprints (w × d), height, point count: car, pole, van, post.
const KINDS = [
  { w: 1.9, d: 0.9, h: 0.8, n: 90 },
  { w: 0.3, d: 0.3, h: 2.4, n: 50 },
  { w: 1.7, d: 1.0, h: 0.9, n: 90 },
  { w: 0.5, d: 0.5, h: 1.7, n: 60 },
]
// ─── Tunables ────────────────────────────────────────────────────────────────
// SPREAD_WIDE / SPREAD_NARROW: how far out the objects sit on a wide vs a narrow canvas.
//   1 = the original tight layout, 1.25 = a bit more room, 1.5+ = wide. The spread is
//   interpolated by the canvas's width in px (SPREAD_NARROW at NARROW_AT or less, SPREAD_WIDE
//   at WIDE_AT or more), so phones get a tighter scene where the tags have less room.
//   The camera zooms out as it grows so everything stays in frame.
// ROTATION_SPEED: radians per millisecond of the yaw rotation (0 = still). 0.00022 ≈ one turn per 28s.
// VERTICAL_CENTER: where the scan's centre sits in the canvas, 0 = top edge, 1 = bottom edge.
//   Lower it to move the whole scene up. Too low and the far tags clip at the top; ~0.45–0.55 works.
const SPREAD_WIDE = 1.25
const SPREAD_NARROW = 1.0
const NARROW_AT = 300
const WIDE_AT = 460
const ROTATION_SPEED = 0.00022
const VERTICAL_CENTER = 0.48
// BOTTOM_FADE: the lowest fraction of the canvas height over which points fade out, so the scan
//   dissolves before the bottom edge instead of running into the stat tiles below (0 = hard cut).
const BOTTOM_FADE = 0.2

// Base radial bands (before spread), cycled so neighbours in angle sit at different distances.
const BANDS = [3.4, 5.4, 7.3]
// Ground returns are built for the widest spread so the scan always reaches past the outermost object.
const RINGS = Math.ceil((Math.max(...BANDS) * Math.max(SPREAD_WIDE, SPREAD_NARROW) + 1.2) / 0.34)

const clamp01 = v => Math.max(0, Math.min(1, v))

function buildScene() {
  const rand = mulberry32(7)
  const ground = [] // [x, y, z]
  const cloud = [] // object points: [dx, dy, z, objectIndex]. Offsets are relative to the object's centre
  for (let ring = 1; ring <= RINGS; ring++) {
    const r = ring * 0.34 + 0.5
    const n = Math.floor(r * 24)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.13
      ground.push([r * Math.cos(a), r * Math.sin(a), 0])
    }
  }
  const count = allSkills.length
  const objects = allSkills.map((skill, i) => {
    const kind = KINDS[i % KINDS.length]
    const angle = (i / count) * Math.PI * 2 + 0.4
    const radius = BANDS[i % BANDS.length]
    const cx = radius * Math.cos(angle)
    const cy = radius * Math.sin(angle)
    for (let k = 0; k < kind.n; k++) {
      cloud.push([(rand() - 0.5) * kind.w, (rand() - 0.5) * kind.d, rand() * kind.h, i])
    }
    return { name: skill.name, color: skill.color, x: cx, y: cy, h: kind.h }
  })
  return { ground, cloud, objects }
}

const PITCH = 1.02
const COS_P = Math.cos(PITCH)
const SIN_P = Math.sin(PITCH)

export default function LidarViz({ className = '' }) {
  const scene = useMemo(buildScene, [])

  const { boxRef, canvasRef } = useCanvasLoop((ctx, W, H, t) => {
    const yaw = t * ROTATION_SPEED
    const cs = Math.cos(yaw)
    const sn = Math.sin(yaw)
    // Objects move outward/inward with the canvas width; their own size stays the same.
    const spread = SPREAD_NARROW + (SPREAD_WIDE - SPREAD_NARROW) * clamp01((W - NARROW_AT) / (WIDE_AT - NARROW_AT))
    const zoomOut = 1 + (spread - 1) * 0.6 // keeps the wider scene inside the canvas
    const U = W / (15.5 * zoomOut)
    const cx = W / 2
    const cy = H * VERTICAL_CENTER
    const F = 20
    const D = 15

    const proj = (x, y, z) => {
      const xr = x * cs - y * sn
      const yr = x * sn + y * cs
      const depth = yr * COS_P - z * SIN_P
      const up = yr * SIN_P + z * COS_P
      const p = F / (F + depth + D)
      return [cx + xr * p * U, cy - up * p * U, p]
    }

    const fadeAt = py => clamp01((H - py) / (H * BOTTOM_FADE))

    ctx.fillStyle = '#22D3EE'
    for (const q of scene.ground) {
      const [px, py, p] = proj(q[0], q[1], q[2])
      ctx.globalAlpha = Math.max(0.12, Math.min(0.6, p * 0.5 - 0.05)) * fadeAt(py)
      const sz = 1.15 * p * 1.4
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz)
    }
    ctx.fillStyle = '#9FF0FF'
    for (const q of scene.cloud) {
      const o = scene.objects[q[3]]
      const [px, py, p] = proj(o.x * spread + q[0], o.y * spread + q[1], q[2])
      ctx.globalAlpha = Math.min(1, 0.5 + q[2] * 0.35) * fadeAt(py)
      const sz = 1.5 * p * 1.4
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz)
    }

    // Tags scale down on narrow canvases and are clamped inside the canvas, so long names
    // like "TensorFlow" are never cut off; the leader line still points at the object.
    const fs = Math.max(8.5, Math.min(10.5, W / 42))
    const bh = Math.round(fs * 1.55)
    const edge = 2
    ctx.globalAlpha = 1
    ctx.font = `600 ${fs}px Inter, system-ui, sans-serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    for (const o of scene.objects) {
      const top = proj(o.x * spread, o.y * spread, o.h)
      const tag = proj(o.x * spread, o.y * spread, o.h + 1.5)
      const bw = ctx.measureText(o.name).width + fs * 1.9
      const bx = Math.max(edge, Math.min(W - edge - bw, tag[0] - 4))
      const by = Math.max(edge, Math.min(H * (1 - BOTTOM_FADE * 0.5) - bh, tag[1] - bh - 1))

      ctx.globalAlpha = 0.7
      ctx.strokeStyle = o.color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(top[0], top[1])
      ctx.lineTo(bx + 4, by + bh)
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(8,15,26,0.82)'
      ctx.fillRect(bx, by, bw, bh)
      ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1)
      ctx.fillStyle = o.color
      ctx.beginPath()
      ctx.arc(bx + fs * 0.7, by + bh / 2, 2.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillText(o.name, bx + fs * 1.35, by + bh / 2 + 0.5)
    }
  })

  return (
    <div
      ref={boxRef}
      className={`relative ${className}`}
      role="img"
      aria-label={`Rotating LiDAR point cloud with tagged objects: ${allSkills.map(s => s.name).join(', ')}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
