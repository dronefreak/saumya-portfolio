import { useState, useEffect } from 'react'

// ─── Same caching layer as useGitHubStats ─────────────────────────────────────
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const HF_API = 'https://huggingface.co/api'

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

// ─── Internal fetcher ─────────────────────────────────────────────────────────
// HF API is public and unauthenticated for public repos.
// Downloads on Spaces are not exposed by the API — only models and datasets have them.
// Likes are available on models, datasets, and spaces.

// HF paginates via a `Link` response header (rel="next"), not a page param —
// follow it until exhausted so counts aren't silently capped at one page.
async function fetchAllHF(url) {
  let all = []
  let next = url
  while (next) {
    const res = await fetch(next)
    if (!res.ok) throw new Error(`HF API ${res.status}`)
    all = all.concat(await res.json())

    const link = res.headers.get('Link')
    const match = link && link.match(/<([^>]+)>;\s*rel="next"/)
    next = match ? match[1] : null
  }
  return all
}

// `downloads` on HF's plain API response is a rolling last-30-days count and
// fluctuates day to day. `downloadsAllTime` (only present via `expand[]=downloadsAllTime`)
// is the cumulative lifetime count — that's what we show everywhere on the portfolio.
const EXPAND_ALL_TIME = 'expand[]=downloads&expand[]=downloadsAllTime'

async function fetchHFAggregate(username) {
  const [models, datasets, spaces] = await Promise.all([
    fetchAllHF(`${HF_API}/models?author=${username}&limit=100&${EXPAND_ALL_TIME}`),
    fetchAllHF(`${HF_API}/datasets?author=${username}&limit=100&${EXPAND_ALL_TIME}`),
    fetchAllHF(`${HF_API}/spaces?author=${username}&limit=100`),
  ])

  const totalLikes =
    models.reduce((acc, m) => acc + (m.likes || 0), 0) +
    datasets.reduce((acc, d) => acc + (d.likes || 0), 0) +
    spaces.reduce((acc, sp) => acc + (sp.likes || 0), 0)

  const totalDownloads =
    models.reduce((acc, m) => acc + (m.downloadsAllTime ?? m.downloads ?? 0), 0) +
    datasets.reduce((acc, d) => acc + (d.downloadsAllTime ?? d.downloads ?? 0), 0)

  return {
    totalLikes,
    totalDownloads,
    modelCount: models.length,
    datasetCount: datasets.length,
    spaceCount: spaces.length,
    // Per-item breakdown if you ever want to render a leaderboard
    breakdown: {
      models: models
        .map(m => ({ id: m.id, likes: m.likes || 0, downloads: m.downloadsAllTime ?? m.downloads ?? 0 }))
        .sort((a, b) => b.downloads - a.downloads),
      datasets: datasets
        .map(d => ({ id: d.id, likes: d.likes || 0, downloads: d.downloadsAllTime ?? d.downloads ?? 0 }))
        .sort((a, b) => b.downloads - a.downloads),
      spaces: spaces
        .map(sp => ({ id: sp.id, likes: sp.likes || 0 }))
        .sort((a, b) => b.likes - a.likes),
    },
  }
}

// ─── Hook: aggregate stats for all repos owned by a user ──────────────────────
//
// Usage:
//   const { totalLikes, totalDownloads, modelCount, loaded } = useHFStats('dronefreak')
//
// Returns:
//   totalLikes     — sum of likes across models + datasets + spaces
//   totalDownloads — sum of downloads across models + datasets (spaces not tracked by HF API)
//   modelCount     — number of public models
//   datasetCount   — number of public datasets
//   spaceCount     — number of public spaces
//   breakdown      — per-item arrays sorted by downloads/likes, for leaderboard rendering
//   loaded         — false until the first fetch (or cache hit) resolves
//   error          — null on success, error message string on failure

export function useHFStats(username) {
  const [stats, setStats] = useState({
    totalLikes: null,
    totalDownloads: null,
    modelCount: null,
    datasetCount: null,
    spaceCount: null,
    breakdown: null,
    loaded: false,
    error: null,
  })

  useEffect(() => {
    if (!username) return

    const cacheKey = `hf_stats_${username}`
    const cached = getCached(cacheKey)
    if (cached) {
      setStats({ ...cached, loaded: true, error: null })
      return
    }

    fetchHFAggregate(username)
      .then(fresh => {
        setCache(cacheKey, fresh)
        setStats({ ...fresh, loaded: true, error: null })
      })
      .catch(err => {
        setStats(prev => ({ ...prev, loaded: true, error: err.message }))
      })
  }, [username])

  return stats
}

// ─── Hook: aggregate stats for a HF Collection (fixed list of repos) ──────────
//
// Usage:
//   const { downloads, likes, modelCount, loaded } = useHFCollection('dronefreak/visdrone-detection-model-zoo')
//
// Collections aren't paginated by the API, so the collection itself is a single fetch —
// but its `/api/collections/{slug}` response ignores `expand`, so it only ever hands back
// the rolling last-30-days `downloads` per item. To get all-time counts, each item (model
// or dataset — spaces don't track downloads) gets a follow-up fetch with `expand[]=downloadsAllTime`.
// Likes ARE accurate straight off the collection response, so those don't need a follow-up.

export function useHFCollection(collectionSlug, staticDownloads = 0, staticLikes = 0) {
  const [stats, setStats] = useState({
    downloads: staticDownloads,
    likes: staticLikes,
    modelCount: null,
    loaded: false,
  })

  useEffect(() => {
    if (!collectionSlug) return

    const cacheKey = `hf_collection_${collectionSlug.replace('/', '_')}`
    const cached = getCached(cacheKey)
    if (cached) {
      setStats({ ...cached, loaded: true })
      return
    }

    fetch(`${HF_API}/collections/${collectionSlug}`)
      .then(r => r.json())
      .then(async data => {
        const items = data.items || []
        const likes = items.reduce((acc, item) => acc + (item.likes || 0), 0)

        // Downloadable item types only — spaces have no download counter.
        const downloadCounts = await Promise.all(
          items
            .filter(item => item.type === 'model' || item.type === 'dataset')
            .map(item => {
              const endpoint = item.type === 'dataset' ? 'datasets' : 'models'
              return fetch(`${HF_API}/${endpoint}/${item.id}?${EXPAND_ALL_TIME}`)
                .then(r => r.json())
                .then(d => d.downloadsAllTime ?? d.downloads ?? 0)
                .catch(() => item.downloads || 0)
            })
        )

        const fresh = {
          downloads: downloadCounts.reduce((acc, n) => acc + n, 0),
          likes,
          modelCount: items.length,
        }
        setCache(cacheKey, fresh)
        setStats({ ...fresh, loaded: true })
      })
      .catch(() => {
        setStats(prev => ({ ...prev, loaded: true }))
      })
  }, [collectionSlug])

  return stats
}

// ─── Hook: stats for a single model or dataset ────────────────────────────────
//
// Usage:
//   const { likes, downloads, loaded } = useHFModel('dronefreak/visdrone-yolov8x', 'model')
//
// type: 'model' | 'dataset' | 'space'
// staticLikes / staticDownloads: shown while loading or if API fails

export function useHFModel(repoId, type = 'model', staticLikes = 0, staticDownloads = 0) {
  const [stats, setStats] = useState({
    likes: staticLikes,
    downloads: staticDownloads,
    loaded: false,
  })

  useEffect(() => {
    if (!repoId) return

    // Spaces don't track downloads, so no point requesting the all-time expand there.
    const endpoint = type === 'dataset'
      ? `${HF_API}/datasets/${repoId}?${EXPAND_ALL_TIME}`
      : type === 'space'
      ? `${HF_API}/spaces/${repoId}`
      : `${HF_API}/models/${repoId}?${EXPAND_ALL_TIME}`

    const cacheKey = `hf_${type}_${repoId.replace('/', '_')}`
    const cached = getCached(cacheKey)
    if (cached) {
      setStats({ ...cached, loaded: true })
      return
    }

    fetch(endpoint)
      .then(r => r.json())
      .then(data => {
        const fresh = {
          likes: data.likes || 0,
          downloads: data.downloadsAllTime ?? data.downloads ?? 0,
        }
        setCache(cacheKey, fresh)
        setStats({ ...fresh, loaded: true })
      })
      .catch(() => {
        setStats({ likes: staticLikes, downloads: staticDownloads, loaded: true })
      })
  }, [repoId, type, staticLikes, staticDownloads])

  return stats
}
