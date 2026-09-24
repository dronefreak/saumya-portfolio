import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SkillPipeline from './SkillPipeline'

export default function Skills() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  return (
    <section id="skills" className="relative py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* The header lines up with the other sections (their max-w-6xl content box); the pipeline below
            is allowed the wider container so its eight columns fit. */}
        <div className="mx-auto max-w-[1104px]">
          <motion.div
            ref={headRef}
            className="mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label block mb-4">Toolkit</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
              Languages, frameworks,{' '}
              <span className="text-gradient-cyan">and the glue in between.</span>
            </h2>
            <p className="font-body text-base text-white/45 max-w-xl leading-relaxed">
              What actually ships the work above, from literature review to production deployment.
            </p>
          </motion.div>
        </div>

        <SkillPipeline />

      </div>
    </section>
  )
}
