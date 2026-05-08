import { useMemo, useState } from 'react'
import { TextureLoader } from 'three'
import { a } from '@react-spring/three'
import type { VinylTrack } from '../data/vinylTracks'
import { useVinylMotion } from '../animations/useVinylMotion'

type VinylStackProps = {
  tracks: VinylTrack[]
  loadedTrackId: string
  loadingTrackId: string | null
  onTrackSelect: (trackId: string) => void
}

export function VinylStack({
  tracks,
  loadedTrackId,
  loadingTrackId,
  onTrackSelect,
}: VinylStackProps) {
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null)

  return (
    <group position={[2.35, -0.22, -0.35]}>
      <mesh receiveShadow position={[0, -0.13, 0]}>
        <boxGeometry args={[1.1, 0.14, 1.1]} />
        <meshStandardMaterial color="#2b2024" roughness={0.72} metalness={0.1} />
      </mesh>

      {tracks.map((track, index) => {
        const state =
          loadingTrackId === track.id
            ? 'loading'
            : loadedTrackId === track.id
              ? 'loaded'
              : hoveredTrackId === track.id
                ? 'hovered'
                : 'idle'
        return (
          <StackVinyl
            key={track.id}
            track={track}
            stackIndex={tracks.length - index - 1}
            state={state}
            onHover={setHoveredTrackId}
            onSelect={onTrackSelect}
          />
        )
      })}
    </group>
  )
}

type StackVinylProps = {
  track: VinylTrack
  stackIndex: number
  state: 'idle' | 'hovered' | 'loading' | 'loaded'
  onHover: (trackId: string | null) => void
  onSelect: (trackId: string) => void
}

function StackVinyl({ track, stackIndex, state, onHover, onSelect }: StackVinylProps) {
  const spring = useVinylMotion({ state, stackIndex })
  const labelTexture = useMemo(() => new TextureLoader().load(track.labelAsset), [track.labelAsset])

  return (
    <a.group position={spring.position as any} rotation={spring.rotation as any} scale={spring.scale as any}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={(event) => {
          event.stopPropagation()
          onHover(track.id)
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          onHover(null)
        }}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(track.id)
        }}
      >
        <cylinderGeometry args={[0.52, 0.52, 0.024, 90]} />
        <meshStandardMaterial color="#0f0d13" metalness={0.22} roughness={0.3} />
      </mesh>

      <mesh rotation={[0, 0, 0.005]} position={[0, 0.013, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.004, 64]} />
        <meshStandardMaterial color="#2c2740" metalness={0.15} roughness={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.145, 64]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </a.group>
  )
}
