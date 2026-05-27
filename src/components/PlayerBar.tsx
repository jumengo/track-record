import { useLayoutEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'

type PlayerBarProps = {
  songTitle: string
  vinylTitle: string
  sideLabel: string
  vinylSubtitle?: string
  labelAsset: string
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onSeek: (time: number) => void
  formatTime: (seconds: number) => string
}

function VinylSubtitleMarquee({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [scrollDistance, setScrollDistance] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    const textEl = textRef.current
    if (!container || !textEl) return

    const measure = () => {
      const distance = textEl.scrollWidth - container.clientWidth
      const overflows = distance > 1
      setShouldScroll(overflows)
      setScrollDistance(overflows ? distance : 0)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [text])

  return (
    <div
      ref={containerRef}
      className={`player-vinyl-marquee${shouldScroll ? ' is-scrolling' : ''}`}
      aria-label={text}
    >
      <span
        ref={textRef}
        className="player-vinyl-marquee-text"
        style={
          shouldScroll
            ? ({ '--scroll-distance': `${scrollDistance}px` } as CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  )
}

export function PlayerBar({
  songTitle,
  vinylTitle,
  sideLabel,
  vinylSubtitle,
  labelAsset,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  formatTime,
}: PlayerBarProps) {
  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(event.target.value))
  }

  return (
    <footer className="player-bar">
      <div className="player-track">
        <img className="player-art" src={labelAsset} alt="" />
        <div className="player-meta">
          <p className="player-song">{songTitle}</p>
          {vinylSubtitle ? (
            <VinylSubtitleMarquee text={vinylSubtitle} />
          ) : (
            <p className="player-vinyl">
              {vinylTitle} · {sideLabel}
            </p>
          )}
        </div>
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="player-play-btn"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <div className="player-progress-wrap">
          <span className="player-time">{formatTime(currentTime)}</span>
          <input
            className="player-progress"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            disabled={duration === 0}
            aria-label="Seek"
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>
    </footer>
  )
}
