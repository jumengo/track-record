import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TurntableScene } from './scene/TurntableScene'
import { TrackInfoPanel } from './components/TrackInfoPanel'
import { PlayerBar } from './components/PlayerBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import {
  flipSideId,
  getVinylSide,
  vinylTracks,
  type VinylSideId,
} from './data/vinylTracks'
import './styles/app.css'

function App() {
  const [loadedTrackId, setLoadedTrackId] = useState(vinylTracks[0].id)
  const [sideByTrackId, setSideByTrackId] = useState<Record<string, VinylSideId>>({})

  const currentTrack = useMemo(
    () => vinylTracks.find((track) => track.id === loadedTrackId) ?? vinylTracks[0],
    [loadedTrackId],
  )
  const activeSideId = sideByTrackId[loadedTrackId] ?? 'a'
  const activeSide = getVinylSide(currentTrack, activeSideId)

  const {
    isPlaying,
    currentTime,
    duration,
    playAudio,
    togglePlay,
    seek,
    formatTime,
  } = useAudioPlayer()

  const handleTogglePlay = () => {
    togglePlay(activeSide.audioAsset)
  }

  const handleTrackSelect = (trackId: string) => {
    setLoadedTrackId(trackId)
    const sideId = sideByTrackId[trackId] ?? 'a'
    const track = vinylTracks.find((item) => item.id === trackId) ?? vinylTracks[0]
    playAudio(getVinylSide(track, sideId).audioAsset)
  }

  const handleFlipSide = (trackId: string) => {
    const track = vinylTracks.find((item) => item.id === trackId) ?? vinylTracks[0]
    const nextSideId = flipSideId(sideByTrackId[trackId] ?? 'a')
    setLoadedTrackId(trackId)
    setSideByTrackId((prev) => ({ ...prev, [trackId]: nextSideId }))
    playAudio(getVinylSide(track, nextSideId).audioAsset)
  }

  return (
    <main className="app-shell">
      <section className="app-grid">
        <div className="scene-shell">
          <TurntableScene
            tracks={vinylTracks}
            loadedTrackId={loadedTrackId}
            sideByTrackId={sideByTrackId}
            isPlaying={isPlaying}
            onLoadedTrackChange={handleTrackSelect}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            className="info-panel-shell"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <TrackInfoPanel
              track={currentTrack}
              activeSide={activeSide}
              activeSideId={activeSideId}
              onFlipSide={handleFlipSide}
            />
          </motion.div>
        </AnimatePresence>
      </section>

      <PlayerBar
        songTitle={activeSide.songTitle}
        vinylTitle={currentTrack.title}
        sideLabel={`Side ${activeSideId.toUpperCase()}`}
        labelAsset={activeSide.labelAsset}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={handleTogglePlay}
        onSeek={seek}
        formatTime={formatTime}
      />
    </main>
  )
}

export default App
