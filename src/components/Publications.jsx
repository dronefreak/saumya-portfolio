import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { publications, patents, authorStats } from '../data/publications'
import { useSemanticScholar } from '../hooks/useSemanticScholar'
import { useGitHubRepo } from '../hooks/useGitHubStats'
import { useHFModel, useHFCollection } from '../hooks/useHFStats'

const CitationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
  </svg>
)

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const ForkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
    <path d="M6 9v2a2 2 0 002 2h8a2 2 0 002-2V9M12 13v2"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21s-6.7-4.35-9.33-8.2C.98 10.2 1.4 6.6 4.2 4.9c2.3-1.4 5.1-.7 6.8 1.3.4.5.7 1 1 1.5.3-.5.6-1 1-1.5 1.7-2 4.5-2.7 6.8-1.3 2.8 1.7 3.22 5.3 1.53 7.9C18.7 16.65 12 21 12 21Z"/>
  </svg>
)

const venueTypeMeta = {
  journal: { label: 'Journal', className: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  conference: { label: 'Conference', className: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
  preprint: { label: 'arXiv', className: 'text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10' },
}

const venueType = t => venueTypeMeta[t] || venueTypeMeta.preprint

// One bright color per conference/journal/venue "family" (ISPRS, ICRA, IRC, IFAC, arXiv, ...)
// so e.g. IRC 2018 and IRC 2019 read as the same venue at a glance.
const venueNameColors = {
  ISPRS: 'text-teal-400 border-teal-400/30 bg-teal-400/10',
  ICRA: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
  IRC: 'text-lime-400 border-lime-400/30 bg-lime-400/10',
  IFAC: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  arXiv: 'text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10',
}

const venueNameClass = venueShort => {
  const family = (venueShort || '').replace(/\s*\d{4}$/, '').trim()
  return venueNameColors[family] || 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
}

function PubCard({ pub, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  // Citation count from Semantic Scholar — no-op if semanticScholarLookup is absent
  const s2 = useSemanticScholar(pub.semanticScholarLookup || null)

  // GitHub stars + forks — no-op if githubRepo is absent
  const gh = useGitHubRepo('dronefreak', pub.githubRepo || null, 0, 0)

  // HF model downloads — no-op if hfRepoId is absent
  const hfSingle = useHFModel(pub.hfRepoId || null, 'model', 0, 0)

  // If hfCollectionSlug is set, show the model zoo's aggregate downloads instead
  // of this one repo's — e.g. CABiNet's downloads shown as the whole UAVid zoo total.
  const hfCollection = useHFCollection(pub.hfCollectionSlug || null, 0, 0)
  const hf = pub.hfCollectionSlug ? hfCollection : hfSingle

  const hasStats = pub.semanticScholarLookup || pub.githubRepo || pub.hfRepoId

  return (
    <motion.div
      ref={ref}
      className="glass-card glass-card-hover p-6 flex flex-col h-full"
      style={pub.highlight ? { borderColor: 'rgba(245,158,11,0.25)' } : {}}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
    >
      {/* Top row: venue-type badge + short venue/year */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={`font-display font-bold text-[10px] rounded-full px-2.5 py-1 uppercase tracking-wide border ${venueType(pub.venueType).className}`}>
          {venueType(pub.venueType).label}
        </span>
        <span className={`font-display font-bold text-[10px] rounded-full px-2.5 py-1 uppercase tracking-wide border ${venueNameClass(pub.venueShort || pub.venue)}`}>
          {pub.venueShort || pub.venue}
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-display font-bold text-lg leading-snug mb-3 ${pub.highlight ? 'text-white' : 'text-white/85'}`}>
        {pub.title}
      </h3>

      {/* Authors */}
      <p className="font-body text-sm text-white/40 leading-relaxed mb-5 flex-1">
        {pub.authors}
      </p>

      {/* Links */}
      <div className="flex gap-2 flex-wrap mb-5">
        {pub.links.doi && (
          <a
            href={pub.links.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-cyan-400/80 border border-cyan-400/25 bg-cyan-400/08 rounded-md px-3 py-1.5 hover:bg-cyan-400/15 hover:text-cyan-400 transition-colors duration-200"
          >
            DOI ↗
          </a>
        )}
        {pub.links.arxiv && (
          <a
            href={pub.links.arxiv}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-cyan-400/80 border border-cyan-400/25 bg-cyan-400/08 rounded-md px-3 py-1.5 hover:bg-cyan-400/15 hover:text-cyan-400 transition-colors duration-200"
          >
            arXiv ↗
          </a>
        )}
        {pub.links.github && (
          <a
            href={pub.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-cyan-400/80 border border-cyan-400/25 bg-cyan-400/08 rounded-md px-3 py-1.5 hover:bg-cyan-400/15 hover:text-cyan-400 transition-colors duration-200"
          >
            Code ↗
          </a>
        )}
        {pub.links.huggingface && (
          <a
            href={pub.links.huggingface}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-cyan-400/80 border border-cyan-400/25 bg-cyan-400/08 rounded-md px-3 py-1.5 hover:bg-cyan-400/15 hover:text-cyan-400 transition-colors duration-200"
          >
            HF ↗
          </a>
        )}
        {pub.links.huggingface_demo && (
          <a
            href={pub.links.huggingface_demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-cyan-400/80 border border-cyan-400/25 bg-cyan-400/08 rounded-md px-3 py-1.5 hover:bg-cyan-400/15 hover:text-cyan-400 transition-colors duration-200"
          >
            Demo ↗
          </a>
        )}
      </div>

      {/* Live stats row */}
      {hasStats && (
        <div className="flex items-center gap-4 flex-wrap pt-4 border-t border-white/[0.06] mt-auto">
          {/* Citations */}
          {pub.semanticScholarLookup && (
            <span className={`flex items-center gap-1.5 text-white/40 text-xs font-body ${
              !s2.loaded ? 'animate-pulse opacity-60' : ''
            }`}>
              <CitationIcon />
              {s2.citations !== null
                ? `${s2.citations.toLocaleString()} citations`
                : s2.loaded ? 'N/A' : 'citations'
              }
            </span>
          )}

          {/* GitHub stars */}
          {pub.githubRepo && gh.stars > 0 && (
            <a
              href={pub.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-white/40 text-xs font-body hover:text-cyan-400 transition-colors duration-200 ${
                !gh.loaded ? 'animate-pulse opacity-60' : ''
              }`}
            >
              <StarIcon />
              {gh.stars?.toLocaleString()} GitHub stars
            </a>
          )}

          {/* GitHub forks */}
          {pub.githubRepo && gh.forks > 0 && (
            <span className={`flex items-center gap-1.5 text-white/40 text-xs font-body ${
              !gh.loaded ? 'animate-pulse opacity-60' : ''
            }`}>
              <ForkIcon />
              {gh.forks?.toLocaleString()} GitHub forks
            </span>
          )}

          {/* HF open-sourced model downloads — collection aggregate when hfCollectionSlug is set */}
          {pub.hfRepoId && hf.downloads > 0 && (
            <a
              href={pub.hfCollectionSlug
                ? `https://huggingface.co/collections/${pub.hfCollectionSlug}`
                : pub.links.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-white/40 text-xs font-body hover:text-cyan-400 transition-colors duration-200 ${
                !hf.loaded ? 'animate-pulse opacity-60' : ''
              }`}
            >
              <DownloadIcon />
              {hf.downloads?.toLocaleString()} HF downloads
            </a>
          )}

          {/* HF likes — collection aggregate when hfCollectionSlug is set */}
          {pub.hfRepoId && hf.likes > 0 && (
            <a
              href={pub.hfCollectionSlug
                ? `https://huggingface.co/collections/${pub.hfCollectionSlug}`
                : pub.links.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-white/40 text-xs font-body hover:text-cyan-400 transition-colors duration-200 ${
                !hf.loaded ? 'animate-pulse opacity-60' : ''
              }`}
            >
              <HeartIcon />
              {hf.likes?.toLocaleString()} HF likes
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

function PatentCard({ patent, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className="glass-card glass-card-hover p-6 flex flex-col h-full"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="font-display font-bold text-[10px] rounded-full px-2.5 py-1 uppercase tracking-wide border text-violet-400 border-violet-400/30 bg-violet-400/10">
          {patent.status === 'pending' ? 'Patent Pending' : 'Patent'}
        </span>
        {patent.patentNumber && (
          <span className="font-body text-[10px] text-white/30 text-right leading-snug">
            {patent.patentNumber}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-lg leading-snug mb-3 text-white/85">
        {patent.title}
      </h3>

      {(patent.inventors || patent.assignee) && (
        <p className="font-body text-sm text-white/40 leading-relaxed mb-5 flex-1">
          {patent.inventors}
          {patent.inventors && patent.assignee && <br />}
          {patent.assignee}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-white/[0.06] mt-auto">
        {patent.year && (
          <span className="font-body text-xs text-white/40">{patent.year}</span>
        )}
        {patent.link && (
          <a
            href={patent.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold text-cyan-400/80 border border-cyan-400/25 bg-cyan-400/08 rounded-md px-3 py-1.5 hover:bg-cyan-400/15 hover:text-cyan-400 transition-colors duration-200"
          >
            Google Patents ↗
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Publications() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  return (
    <section id="publications" className="relative py-28">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          ref={headRef}
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label block mb-4">Research</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Papers &{' '}
              <span className="text-gradient-cyan">patents.</span>
            </h2>
            <a
              href="https://scholar.google.com/citations?user=BxQ0KDEAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2.5 px-5 w-fit"
            >
              Google Scholar ↗
            </a>
          </div>

          {/* Semantic Scholar author metrics */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6 font-body text-sm text-white/45">
            <span><span className="font-display font-bold text-cyan-400">{authorStats.publications}</span> Publications</span>
            <span className="text-white/15">|</span>
            <span><span className="font-display font-bold text-cyan-400">{authorStats.citations}</span> Citations</span>
            <span className="text-white/15">|</span>
            <span><span className="font-display font-bold text-cyan-400">{authorStats.hIndex}</span> h-index</span>
            <span className="text-white/15">|</span>
            <span><span className="font-display font-bold text-cyan-400">{authorStats.i10Index}</span> i10-index</span>
            <span className="text-white/15">|</span>
            <span><span className="font-display font-bold text-cyan-400">{patents.length}</span> Patents</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {publications.map((pub, i) => (
            <PubCard key={pub.id} pub={pub} index={i} />
          ))}
        </div>

        {patents.length > 0 && (
          <div className="mt-14">
            <span className="section-label block mb-5">Patents</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {patents.map((p, i) => (
                <PatentCard key={p.id} patent={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
