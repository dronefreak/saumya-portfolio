export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-sm text-gradient-cyan">Saumya Saksena</span>
        <p className="font-body text-xs text-white/25 text-center">
          Perception & Edge AI &nbsp;·&nbsp; Paris, France
        </p>
        <p className="font-body text-xs text-white/20">
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
