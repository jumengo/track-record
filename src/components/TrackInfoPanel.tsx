import type { VinylTrack } from '../data/vinylTracks'

type TrackInfoPanelProps = {
  track: VinylTrack
}

export function TrackInfoPanel({ track }: TrackInfoPanelProps) {
  return (
    <article className="info-panel">
      <p className="panel-kicker">Now Playing</p>
      <h2>{track.title}</h2>
      <p className="panel-description">{track.description}</p>
      <ul className="panel-list">
        {track.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="panel-blurb">{track.blurb}</p>
    </article>
  )
}
