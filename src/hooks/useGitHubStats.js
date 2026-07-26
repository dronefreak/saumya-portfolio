import { useState, useEffect } from 'react'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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

export function useGitHubRepo(owner, repo, staticStars, staticForks) {
  const [stats, setStats] = useState({ stars: staticStars, forks: staticForks, loaded: false })

  useEffect(() => {
    if (!repo) return

    const cacheKey = `gh_${owner}_${repo}`
    const cached = getCached(cacheKey)
    if (cached) {
      setStats({ ...cached, loaded: true })
      return
    }

    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then(r => r.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          const fresh = { stars: data.stargazers_count, forks: data.forks_count }
          setCache(cacheKey, fresh)
          setStats({ ...fresh, loaded: true })
        }
      })
      .catch(() => {
        setStats({ stars: staticStars, forks: staticForks, loaded: true })
      })
  }, [owner, repo, staticStars, staticForks])

  return stats
}

export function useGitHubProfile(owner) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const cacheKey = `gh_profile_${owner}`
    const cached = getCached(cacheKey)
    if (cached) { setProfile(cached); return }

    fetch(`https://api.github.com/users/${owner}`)
      .then(r => r.json())
      .then(data => {
        const fresh = {
          followers: data.followers,
          public_repos: data.public_repos,
          avatar_url: data.avatar_url,
        }
        setCache(cacheKey, fresh)
        setProfile(fresh)
      })
      .catch(() => {})
  }, [owner])

  return profile
}

// ─── Hook: aggregate stars and forks across all public repos ──────────────────
//
// Usage:
//   const { totalStars, totalForks, repoCount, loaded } = useGitHubTotalStars('dronefreak')
//
// Paginates automatically — handles >100 repos correctly.
// Unauthenticated GitHub API: 60 req/hr. Each call uses 1 req per 100 repos.
// With the 5-min cache this is effectively 1 req per session for most visitors.

export function useGitHubTotalStars(username) {
  const [stats, setStats] = useState({
    totalStars: null,
    totalForks: null,
    repoCount: null,
    loaded: false,
  })

  useEffect(() => {
    if (!username) return

    const cacheKey = `gh_total_stars_${username}`
    const cached = getCached(cacheKey)
    if (cached) { setStats({ ...cached, loaded: true }); return }

    async function fetchAllRepos() {
      let page = 1
      let all = []
      while (true) {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`
        )
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        const batch = await res.json()
        all = all.concat(batch)
        if (batch.length < 100) break
        page++
      }
      return all
    }

    fetchAllRepos()
      .then(repos => {
        const fresh = {
          totalStars: repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0),
          totalForks:  repos.reduce((acc, r) => acc + (r.forks_count || 0), 0),
          repoCount:   repos.length,
        }
        setCache(cacheKey, fresh)
        setStats({ ...fresh, loaded: true })
      })
      .catch(() => {
        // Leave nulls in place — fmtCount will show the fallback
        setStats(prev => ({ ...prev, loaded: true }))
      })
  }, [username])

  return stats
}
