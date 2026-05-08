import { useMemo } from 'react'
import { TextureLoader } from 'three'
import type { VinylTrack } from '../data/vinylTracks'

type VinylStackProps = {
  tracks: VinylTrack[]
  loadedTrackId: string
  onTrackSelect: (trackId: string) => void
}

export function VinylStack({ tracks, loadedTrackId, onTrackSelect }: VinylStackProps) {
  return (
    <group position={[3.05, -0.32, 0.82]} rotation={[0, 0, 0]}>
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[1.44, 0.06, 1.02]} />
        <meshStandardMaterial color="#4f352d" roughness={0.88} metalness={0.06} />
      </mesh>

      {tracks.map((track, index) => {
        const stackIndex = index
        return (
          <StackVinyl
            key={track.id}
            track={track}
            stackIndex={stackIndex}
            isActive={loadedTrackId === track.id}
            onSelect={onTrackSelect}
          />
        )
      })}

      <AcrylicBin />
    </group>
  )
}

type StackVinylProps = {
  track: VinylTrack
  stackIndex: number
  isActive: boolean
  onSelect: (trackId: string) => void
}

function StackVinyl({ track, stackIndex, isActive, onSelect }: StackVinylProps) {
  const labelTexture = useMemo(() => new TextureLoader().load(track.labelAsset), [track.labelAsset])
  const y = 0.4 + stackIndex * 0.018
  const x = -0.1 + stackIndex * 0.01
  const z = 0.3 - stackIndex * 0.08
  const pitch = -0.08 + stackIndex * 0.01

  return (
    <group position={[x, y, z]} rotation={[pitch, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          onSelect(track.id)
        }}
      >
        <boxGeometry args={[0.98, 1.06, 0.018]} />
        <meshStandardMaterial color={isActive ? '#f4ead4' : '#e6dfd0'} metalness={0.03} roughness={0.92} />
      </mesh>

      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.9, 0.98]} />
        <meshBasicMaterial color={isActive ? '#efe6d1' : '#d6d2c8'} />
      </mesh>

      <mesh position={[0.16, -0.04, 0.013]}>
        <circleGeometry args={[0.12, 48]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>

      <mesh position={[-0.17, 0.18, 0.013]}>
        <boxGeometry args={[0.28, 0.02, 0.002]} />
        <meshBasicMaterial color={isActive ? '#1f2b48' : '#374566'} />
      </mesh>
    </group>
  )
}

function AcrylicBin() {
  return (
    <group position={[-0.05, 0.19, 0]}>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.84]} />
        <meshStandardMaterial color="#d7e3ef" transparent opacity={0.18} roughness={0.12} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.2, -0.41]}>
        <boxGeometry args={[1.1, 1.1, 0.02]} />
        <meshStandardMaterial color="#d7e3ef" transparent opacity={0.22} roughness={0.12} metalness={0.1} />
      </mesh>
      <mesh position={[-0.55, 0.2, 0]}>
        <boxGeometry args={[0.02, 1.1, 0.84]} />
        <meshStandardMaterial color="#d7e3ef" transparent opacity={0.2} roughness={0.12} metalness={0.1} />
      </mesh>
      <mesh position={[0.55, 0.2, 0]}>
        <boxGeometry args={[0.02, 1.1, 0.84]} />
        <meshStandardMaterial color="#d7e3ef" transparent opacity={0.2} roughness={0.12} metalness={0.1} />
      </mesh>
    </group>
  )
}
