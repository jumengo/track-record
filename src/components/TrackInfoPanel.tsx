import type { VinylSide, VinylSideId, VinylTrack } from '../data/vinylTracks'

type TrackInfoPanelProps = {
  track: VinylTrack
  activeSide: VinylSide
  activeSideId: VinylSideId
  onFlipSide: (trackId: string) => void
}

export function TrackInfoPanel({ track, activeSide, activeSideId, onFlipSide }: TrackInfoPanelProps) {
  return (
    <article className="info-panel">
      <div className="panel-top-row">
        <p className="panel-kicker">Now Playing · Side {activeSideId.toUpperCase()}</p>
        <button
          type="button"
          className="panel-flip-btn"
          onClick={() => onFlipSide(track.id)}
          aria-label={`Flip to side ${activeSideId === 'a' ? 'B' : 'A'}`}
        >
          <span className={`panel-flip-side ${activeSideId === 'a' ? 'is-active' : ''}`}>A</span>
          <span className="panel-flip-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 8h10M7 8l2.5-2.5M7 8l2.5 2.5M17 16H7M17 16l-2.5 2.5M17 16l-2.5-2.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={`panel-flip-side ${activeSideId === 'b' ? 'is-active' : ''}`}>B</span>
        </button>
      </div>
      <h2>{track.title}</h2>
      <p className="panel-subtitle">{activeSide.subtitle}</p>
      <p className="panel-description">{activeSide.description}</p>
      <ul className="panel-list">
        {activeSide.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="panel-blurb">{activeSide.blurb}</p>
    </article>
  )
}
