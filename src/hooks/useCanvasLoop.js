import { useEffect, useRef } from 'react'

// Shared render loop for the canvas visualisations (hero LiDAR cloud, Toolkit constellation).
// Handles DPR scaling, resizing, pausing while off-screen, and prefers-reduced-motion
// (t is frozen at 0, so the scene renders as a still).
//
// Usage:
//   const { boxRef, canvasRef } = useCanvasLoop((ctx, W, H, t) => { ... })
//   <div ref={boxRef}><canvas ref={canvasRef} className="absolute inset-0 w-full h-full" /></div>
export function useCanvasLoop(draw) {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const drawRef = useRef(draw)
  drawRef.current = draw // always call the latest draw without restarting the loop

  useEffect(() => {
    const box = boxRef.current
    const cv = canvasRef.current
    if (!box || !cv) return
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    let visible = true
    let raf

    const size = () => {
      const r = box.getBoundingClientRect()
      if (!r.width) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width
      H = r.height
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ro = new ResizeObserver(size)
    ro.observe(box)
    size()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(box)

    const frame = t => {
      if (W > 0 && visible) {
        ctx.clearRect(0, 0, W, H)
        drawRef.current(ctx, W, H, reduce ? 0 : t)
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return { boxRef, canvasRef }
}
