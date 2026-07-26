import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { projects } from '../data/projects'
import { useGitHubRepo } from '../hooks/useGitHubStats'
import { useHFModel } from '../hooks/useHFStats'

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const ForkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
    <path d="M6 9v2a2 2 0 002 2h8a2 2 0 002-2V9M12 13v2"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
)

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  // GitHub stats — hook is a no-op when githubRepo is null
  const { stars, forks } = useGitHubRepo(
    'dronefreak',
    project.githubRepo,
    project.staticStars,
    project.staticForks
  )

  // HuggingFace stats — hook is a no-op when hfRepoId is null
  const hf = useHFModel(
    project.hfRepoId || null,
    project.hfRepoType || 'model',
    0,
    project.hfDownloads || 0,
    project.hfLikes || 0
  )

  const categoryColors = {
    'Computer Vision': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Research': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    'Perception': 'text-red-400 bg-red-400/10 border-red-400/20',
    'Brain-Computer Interface': 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20',
    'Open Source': 'text-green-400 bg-green-400/10 border-green-400/20',
  }

  const catColor = categoryColors[project.category] || 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'

  return (
    <motion.div
      ref={ref}
      className="glass-card glass-card-hover p-6 flex flex-col h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: 'easeOut' }}
    >
      {/* Top row: category badge + optional pub badge */}
      <div className="flex items-start justify-between mb-4">
        <span className={`tag-pill border text-xs ${catColor}`}>
          {project.category}
        </span>
        {project.badge && (
          <span className="font-display font-bold text-xs text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1">
            {project.badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-lg text-white leading-snug mb-3">
        {project.title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm text-white/50 leading-relaxed mb-5 flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tags.map(tag => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      {/* Stats + Links */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">

        {/* Stats */}
        <div className="flex items-center gap-3">
          {/* GitHub stars + forks */}
          {project.githubRepo && stars !== null && (
            <>
              <span className="flex items-center gap-1.5 text-white/40 text-xs font-body">
                <StarIcon /> {stars?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-white/40 text-xs font-body">
                <ForkIcon /> {forks?.toLocaleString()}
              </span>
            </>
          )}

          {/* HuggingFace downloads — live via useHFModel */}
          {project.hfRepoId && (
            <span className={`flex items-center gap-1.5 text-white/40 text-xs font-body ${
              !hf.loaded ? 'animate-pulse opacity-60' : ''
            }`}>
              <DownloadIcon /> {hf.downloads?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-cyan-400 transition-colors duration-200"
              aria-label="GitHub"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          )}
          {project.links.paper && (
            <a
              href={project.links.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-amber-400 transition-colors duration-200 text-xs font-display font-semibold"
            >
              arXiv ↗
            </a>
          )}
          {project.links.huggingface && (
            <a
              href={project.links.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-cyan-400 transition-colors duration-200 text-xs font-display font-semibold"
            >
              HF ↗
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display font-semibold text-cyan-400 border border-cyan-400/30 bg-cyan-400/08 rounded-md px-2.5 py-1 hover:bg-cyan-400/15 transition-colors duration-200"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  return (
    <section id="projects" className="relative py-28">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          ref={headRef}
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label block mb-4">Featured Work</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Prototyped. Built.{' '}
              <span className="text-gradient-cyan">Shipped.</span>
            </h2>
            <a
              href="https://github.com/dronefreak"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2.5 px-5 w-fit"
            >
              All projects ↗
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
