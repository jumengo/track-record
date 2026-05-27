import { useEffect } from 'react'
import { PlayerBar } from './components/PlayerBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { getVinylSide, vinylTracks } from './data/vinylTracks'
import { TurntableScene } from './scene/TurntableScene'
import { contactEmail, linkedInUrl } from './config/contact'
import './styles/app.css'
import './styles/landing.css'

const landingTrack = vinylTracks.find((track) => track.id === 'identity') ?? vinylTracks[0]
const landingSide = getVinylSide(landingTrack, 'a')
const landingVinylSubtitle = '"Gold" by Owl City x "Tomorrow" by Fly By Midnight'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
      />
    </svg>
  )
}

export default function LandingApp() {
  const {
    isPlaying,
    currentTime,
    duration,
    loadAudio,
    togglePlay,
    seek,
    setMuted,
    formatTime,
  } = useAudioPlayer()

  useEffect(() => {
    loadAudio(landingSide.audioAsset, false)
    setMuted(false)
  }, [loadAudio, setMuted])

  const handleTonearmEngagedChange = (engaged: boolean) => {
    setMuted(engaged)
  }

  const handleTogglePlay = () => {
    togglePlay(landingSide.audioAsset)
  }

  return (
    <main className="landing-shell">
      <div className="landing-hero">
        <div className="landing-scene">
          <TurntableScene
            mode="landing"
            vinylCenterText="In progress..."
            isSpinning={isPlaying}
            onTonearmEngagedChange={handleTonearmEngagedChange}
          />
        </div>

        <nav className="landing-links" aria-label="Contact">
          <a
            className="landing-link"
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            className="landing-link"
            href={`mailto:${contactEmail}`}
            aria-label={`Email ${contactEmail}`}
          >
            <EmailIcon />
          </a>
        </nav>
      </div>

      <PlayerBar
        songTitle={landingSide.songTitle}
        vinylTitle={landingTrack.title}
        sideLabel="Side A"
        vinylSubtitle={landingVinylSubtitle}
        labelAsset={landingSide.labelAsset}
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
