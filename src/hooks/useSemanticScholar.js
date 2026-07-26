import { useState, useEffect } from 'react'

// Citations change slowly — 30 min cache is plenty
const CACHE_TTL = 30 * 60 * 1000
const S2_API = 'https://api.semanticscholar.org/graph/v1/paper'

function getCached(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { value, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return value
  } catch {
    return null
  }
}

function setCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }))
  } catch {}
}

function toPaperId(lookup) {
  return lookup.type === 'arxiv'
    ? `arXiv:${lookup.id}`
    : lookup.type === 'doi'
    ? `DOI:${lookup.id}`
    : lookup.id // type: 's2id' — use the ID directly, no prefix needed
}

function cacheKeyFor(paperId) {
  return `s2_${paperId.replace(/[:/.\-]/g, '_')}`
}

// ─── Request coalescing ────────────────────────────────────────────────────
//
// Semantic Scholar's unauthenticated tier rate-limits on burst concurrency,
// not just total volume — mounting N publication rows fires N simultaneous
// lookups and most of them come back 429. Every lookup requested within the
// same tick gets queued here and flushed as a single POST /paper/batch call,
// which the API allows regardless of how many papers are in it.

let pending = new Map() // paperId -> Set<callback>
let flushTimer = null

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(runBatch, 20)
}

function runBatch() {
  flushTimer = null
  const batch = pending
  pending = new Map()
  const ids = [...batch.keys()]
  if (ids.length === 0) return

  fetch(`${S2_API}/batch?fields=citationCount`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
    .then(r => r.json())
    .then(results => {
      ids.forEach((id, i) => {
        const entry = Array.isArray(results) ? results[i] : null
        const fresh = { citations: entry?.citationCount ?? null }
        setCache(cacheKeyFor(id), fresh)
        batch.get(id)?.forEach(cb => cb({ ...fresh, loaded: true }))
      })
    })
    .catch(() => {
      ids.forEach(id => {
        batch.get(id)?.forEach(cb => cb({ citations: null, loaded: true }))
      })
    })
}

// ─── Hook: citation count for a single paper ──────────────────────────────
//
// Usage:
//   const { citations, loaded } = useSemanticScholar({ type: 'doi', id: '10.1109/ICRA...' })
//   const { citations, loaded } = useSemanticScholar({ type: 'arxiv', id: '2011.00993' })
//
// Returns null for citations if the paper isn't indexed or the call fails.
// Semantic Scholar API: free, no key required. Lookups made across mounted
// components in the same tick are batched into one request (see above).

export function useSemanticScholar(lookup) {
  const [data, setData] = useState({ citations: null, loaded: false })

  useEffect(() => {
    if (!lookup?.id) return

    const paperId = toPaperId(lookup)
    const cacheKey = cacheKeyFor(paperId)
    const cached = getCached(cacheKey)
    if (cached) { setData({ ...cached, loaded: true }); return }

    let cancelled = false
    const cb = result => { if (!cancelled) setData(result) }

    if (!pending.has(paperId)) pending.set(paperId, new Set())
    pending.get(paperId).add(cb)
    scheduleFlush()

    return () => {
      cancelled = true
      pending.get(paperId)?.delete(cb)
    }
  }, [lookup?.type, lookup?.id])

  return data
}
