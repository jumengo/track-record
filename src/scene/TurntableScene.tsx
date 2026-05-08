import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { VinylTrack } from '../data/vinylTracks'
import { RecordPlayer } from './RecordPlayer'
import { VinylStack } from './VinylStack'

type TurntableSceneProps = {
  tracks: VinylTrack[]
  loadedTrackId: string
  onLoadedTrackChange: (trackId: string) => void
}

export function TurntableScene({ tracks, loadedTrackId, onLoadedTrackChange }: TurntableSceneProps) {
  const loadedTrack = useMemo(
    () => tracks.find((track) => track.id === loadedTrackId) ?? tracks[0],
    [loadedTrackId, tracks],
  )

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0.01, 2.9, 6], fov: 33 }}>
      <color attach="background" args={['#2b1f1b']} />
      <ambientLight intensity={0.72} />
      <spotLight
        intensity={1.1}
        angle={0.34}
        penumbra={0.52}
        castShadow
        position={[2.5, 5.2, 3.4]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.7} position={[-2.2, 3.4, -1.5]} />

      <group position={[0, -0.06, 0]} rotation={[0, 0, 0]}>
        <RecordPlayer loadedTrack={loadedTrack} isSpinning={true} />
        <VinylStack
          tracks={tracks}
          loadedTrackId={loadedTrackId}
          onTrackSelect={onLoadedTrackChange}
        />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#8f5a44" roughness={0.92} />
      </mesh>

      <Environment preset="city" />
    </Canvas>
  )
}
