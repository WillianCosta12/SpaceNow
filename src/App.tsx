import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { StarField } from './components/ui/StarField'
import { APODSection } from './components/apod/APODSection'
import { MarsSection } from './components/mars/MarsSection'
import { ISSSection } from './components/iss/ISSSection'
import { motion } from 'framer-motion'
import { Telescope, Rocket } from 'lucide-react'

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-nebula-muted/10 via-transparent to-transparent pointer-events-none" />
      <div className="text-center px-6 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-2xl glass glow-purple">
            <Telescope className="w-10 h-10 text-nebula-light" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #F8FAFC 0%, #A78BFA 50%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SpaceNow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-star-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Explore o universo em tempo real. Fotos da NASA, superfície de Marte e a posição ao vivo da Estação Espacial Internacional.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#apod"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-nebula text-star font-semibold text-sm glow-purple transition-all hover:bg-nebula/90"
          >
            <Rocket className="w-4 h-4" />
            Explorar
          </motion.a>
          <a
            href="https://api.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-nebula-border text-nebula-light text-sm hover:bg-nebula-muted transition-all"
          >
            NASA Open APIs
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-2 mt-10"
        >
          {['NASA APOD', 'Mars Rover', 'ISS Tracker'].map((api) => (
            <span key={api} className="text-xs font-mono px-3 py-1 rounded-full border border-space-600 text-star-dim">
              {api}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-5 h-8 rounded-full border-2 border-nebula-border flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 rounded-full bg-nebula-light"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function App() {
  return (
    <div className="relative">
      <StarField />
      <Navbar />
      <main>
        <HeroSection />
        <APODSection />
        <MarsSection />
        <ISSSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
