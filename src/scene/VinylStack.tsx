import { useMemo, useState } from 'react'
import { a, useSpring } from '@react-spring/three'
import { TextureLoader } from 'three'
import type { VinylTrack } from '../data/vinylTracks'

type VinylStackProps = {
  tracks: VinylTrack[]
  loadedTrackId: string
  onTrackSelect: (trackId: string) => void
}

const TABLE_SURFACE_Y = 0.009

export function VinylStack({ tracks, loadedTrackId, onTrackSelect }: VinylStackProps) {
  return (
    <group position={[-1.7, -0.731, 2]}>
      {tracks.map((track, index) => (
        <StackVinyl
          key={track.id}
          track={track}
          stackIndex={index}
          isActive={loadedTrackId === track.id}
          onSelect={onTrackSelect}
        />
      ))}
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
  const [hovered, setHovered] = useState(false)
  const labelTexture = useMemo(() => new TextureLoader().load(track.labelAsset), [track.labelAsset])
  const x = stackIndex * 1.08
  const baseZ = stackIndex % 2 === 0 ? 0 : 0.16
  const yRot = -0.1 + stackIndex * 0.07
  const isRaised = hovered || isActive

  const { z } = useSpring({
    z: isRaised ? baseZ - 0.16 : baseZ,
    config: { tension: 220, friction: 24 },
  })

  return (
    <a.group position-x={x} position-y={TABLE_SURFACE_Y} position-z={z} rotation={[0, yRot, 0]}>
      <mesh
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(track.id)
        }}
      >
        <boxGeometry args={[0.98, 0.018, 0.98]} />
        <meshStandardMaterial color={isActive ? '#f4ead4' : '#e6dfd0'} metalness={0.03} roughness={0.92} />
      </mesh>

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial color={isActive ? '#efe6d1' : '#d6d2c8'} />
      </mesh>

      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 48]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>

      {/* <mesh position={[-0.17, 0.011, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.28, 0.02, 0.002]} />
        <meshBasicMaterial color={isActive ? '#1f2b48' : '#374566'} />
      </mesh> */}
    </a.group>
  )
}
