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

async function fetchHFAggregate(username) {
  const [models, datasets, spaces] = await Promise.all([
    fetch(`${HF_API}/models?author=${username}&limit=100`).then(r => r.json()),
    fetch(`${HF_API}/datasets?author=${username}&limit=100`).then(r => r.json()),
    fetch(`${HF_API}/spaces?author=${username}&limit=100`).then(r => r.json()),
  ])

  const totalLikes =
    models.reduce((acc, m) => acc + (m.likes || 0), 0) +
    datasets.reduce((acc, d) => acc + (d.likes || 0), 0) +
    spaces.reduce((acc, sp) => acc + (sp.likes || 0), 0)

  const totalDownloads =
    models.reduce((acc, m) => acc + (m.downloads || 0), 0) +
    datasets.reduce((acc, d) => acc + (d.downloads || 0), 0)

  return {
    totalLikes,
    totalDownloads,
    modelCount: models.length,
    datasetCount: datasets.length,
    spaceCount: spaces.length,
    // Per-item breakdown if you ever want to render a leaderboard
    breakdown: {
      models: models
        .map(m => ({ id: m.id, likes: m.likes || 0, downloads: m.downloads || 0 }))
        .sort((a, b) => b.downloads - a.downloads),
      datasets: datasets
        .map(d => ({ id: d.id, likes: d.likes || 0, downloads: d.downloads || 0 }))
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

    const endpoint = type === 'dataset'
      ? `${HF_API}/datasets/${repoId}`
      : type === 'space'
      ? `${HF_API}/spaces/${repoId}`
      : `${HF_API}/models/${repoId}`

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
          downloads: data.downloads || 0,
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
