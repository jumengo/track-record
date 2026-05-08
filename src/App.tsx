import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TurntableScene } from './scene/TurntableScene'
import { TrackInfoPanel } from './components/TrackInfoPanel'
import { vinylTracks } from './data/vinylTracks'
import './styles/app.css'

function App() {
  const [loadedTrackId, setLoadedTrackId] = useState(vinylTracks[0].id)
  const currentTrack = useMemo(
    () => vinylTracks.find((track) => track.id === loadedTrackId) ?? vinylTracks[0],
    [loadedTrackId],
  )

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Track Record</h1>
        <p>Drop a vinyl on the deck to explore my story.</p>
      </header>

      <section className="app-grid">
        <div className="scene-shell">
          <TurntableScene
            tracks={vinylTracks}
            loadedTrackId={loadedTrackId}
            onLoadedTrackChange={setLoadedTrackId}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <TrackInfoPanel track={currentTrack} />
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  )
}

export default App
