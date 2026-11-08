import { Analytics } from '@vercel/analytics/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Story from './components/Story'
import Projects from './components/Projects'
import LiveDemos from './components/LiveDemos'
import Publications from './components/Publications'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-navy-900 text-white font-body min-h-screen overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <Story />
        <Projects />
        <LiveDemos />
        <Publications />
        <Contact />
      </main>
      <Footer />
      {/* Vercel Web Analytics — page views/visitors, collected only once this is deployed to
          Vercel; it's a no-op in local dev and on any other host. */}
      <Analytics />
    </div>
  )
}
