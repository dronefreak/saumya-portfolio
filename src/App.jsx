import Nav from './components/Nav'
import Hero from './components/Hero'
import Story from './components/Story'
import Skills from './components/Skills'
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
        {/* <Skills /> */}
        <Projects />
        <LiveDemos />
        <Publications />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
