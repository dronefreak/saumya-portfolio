import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { publications, patents, authorStats } from '../data/publications'
import { useSemanticScholar } from '../hooks/useSemanticScholar'
import { useGitHubRepo } from '../hooks/useGitHubStats'
import { useHFModel } from '../hooks/useHFStats'

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

function PubRow({ pub, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  // Citation count from Semantic Scholar — no-op if semanticScholarLookup is absent
  const s2 = useSemanticScholar(pub.semanticScholarLookup || null)

  // GitHub stars + forks — no-op if githubRepo is absent
  const gh = useGitHubRepo('dronefreak', pub.githubRepo || null, 0, 0)

  // HF model downloads — no-op if hfRepoId is absent
  const hf = useHFModel(pub.hfRepoId || null, 'model', 0, 0)

  const hasStats = pub.semanticScholarLookup || pub.githubRepo || pub.hfRepoId

  return (
    <motion.div
      ref={ref}
      className={`glass-card p-6 flex flex-col md:flex-row md:items-start gap-5 glass-card-hover ${pub.highlight ? '' : ''}`}
      style={pub.highlight ? { borderColor: 'rgba(245,158,11,0.25)' } : {}}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      {/* Year + venue column */}
      <div className="flex-shrink-0 flex md:flex-col items-center md:items-end gap-3 md:gap-1 md:w-28 md:pt-0.5">
        {/* <span className="font-display font-bold text-sm text-cyan-400">{pub.year}</span> */}
        <span className={`font-body text-xs px-2.5 py-1 rounded-full border text-center ${
          pub.venueType === 'journal'
            ? 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
            : pub.venueType === 'conference'
            ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
            : 'text-white/40 border-white/10'
        }`}>
          {pub.venueShort || pub.venue}
        </span>
        {pub.note && (
          <span className="font-body text-[10px] text-white/25 text-right leading-snug hidden md:block">
            {pub.note}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-display font-semibold text-base leading-snug mb-2 ${pub.highlight ? 'text-white' : 'text-white/85'}`}>
          {pub.title}
        </h3>
        <p className="font-body text-sm text-white/40 mb-4 leading-relaxed">
          {pub.authors}
        </p>

        {/* Links */}
        <div className="flex gap-3 flex-wrap mb-4">
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
        </div>

        {/* Live stats row */}
        {hasStats && (
          <div className="flex items-center gap-4 pt-3 border-t border-white/[0.05]">
            {/* Citations */}
            {pub.semanticScholarLookup && (
              <span className={`flex items-center gap-1.5 text-white/35 text-xs font-body ${
                !s2.loaded ? 'animate-pulse opacity-50' : ''
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
                className={`flex items-center gap-1.5 text-white/35 text-xs font-body hover:text-cyan-400 transition-colors duration-200 ${
                  !gh.loaded ? 'animate-pulse opacity-50' : ''
                }`}
              >
                <StarIcon />
                {gh.stars?.toLocaleString()} stars
              </a>
            )}

            {/* GitHub forks */}
            {pub.githubRepo && gh.forks > 0 && (
              <span className={`flex items-center gap-1.5 text-white/35 text-xs font-body ${
                !gh.loaded ? 'animate-pulse opacity-50' : ''
              }`}>
                <ForkIcon />
                {gh.forks?.toLocaleString()} forks
              </span>
            )}

            {/* HF open-sourced model downloads */}
            {pub.hfRepoId && hf.downloads > 0 && (
              <a
                href={pub.links.huggingface}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-white/35 text-xs font-body hover:text-cyan-400 transition-colors duration-200 ${
                  !hf.loaded ? 'animate-pulse opacity-50' : ''
                }`}
              >
                <DownloadIcon />
                {hf.downloads?.toLocaleString()} HF downloads
              </a>
            )}
          </div>
        )}
      </div>

      {/* Venue type badge */}
      <div className="flex-shrink-0 self-start">
        <span className={`font-display font-bold text-[10px] rounded-full px-2.5 py-1 uppercase tracking-wide border ${
          pub.venueType === 'journal'
            ? 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
            : pub.venueType === 'conference'
            ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
            : 'text-white/40 border-white/10'
        }`}>
          {pub.venueType === 'journal' ? 'Journal' : pub.venueType === 'conference' ? 'Conference' : 'Preprint'}
        </span>
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
            <span><span className="font-display font-bold text-cyan-400">{authorStats.i10Index}</span> i10-index</span>
            <span className="text-white/15">|</span>
            <span><span className="font-display font-bold text-cyan-400">{authorStats.hIndex}</span> h-index</span>
            <span className="text-white/15">|</span>
            <span><span className="font-display font-bold text-cyan-400">{authorStats.highlyInfluentialCitations}</span> Highly Influential Citations</span>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          {publications.map((pub, i) => (
            <PubRow key={pub.id} pub={pub} index={i} />
          ))}

          {/* Patents */}
          {patents.map((p, i) => (
            <motion.div
              key={p.id}
              className="glass-card p-5 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: (publications.length + i) * 0.07 }}
            >
              <div className="flex-shrink-0">
                <span className="font-display font-bold text-[10px] text-white/30 border border-white/10 rounded-full px-2.5 py-1 uppercase tracking-wide">
                  Patent Pending
                </span>
              </div>
              <p className="font-body text-sm text-white/40 leading-relaxed">
                {p.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
