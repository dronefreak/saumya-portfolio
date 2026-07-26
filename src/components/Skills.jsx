import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { skills } from '../data/skills'

function SkillTile({ skill, delay }) {
  return (
    <motion.div
      className="glass-card glass-card-hover group flex flex-col items-center justify-center gap-1.5 p-2.5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay }}
    >
      <svg
        width="16"
        height="16"
        viewBox={skill.viewBox}
        fill={skill.color}
        className="opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
      >
        <path d={skill.path} />
      </svg>
      <span className="font-display text-[10px] text-white/45 group-hover:text-white/70 transition-colors duration-200 text-center leading-tight">
        {skill.name}
      </span>
    </motion.div>
  )
}

export default function Skills() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, amount: 0.4 })

  return (
    <section id="skills" className="relative py-28">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          ref={headRef}
          className="mb-14"
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
            What actually ships the work above, from model training to production deployment.
          </p>
        </motion.div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {skills.map((skill, i) => (
            <SkillTile key={skill.name} skill={skill} delay={(i % 8) * 0.03} />
          ))}
        </div>

      </div>
    </section>
  )
}
