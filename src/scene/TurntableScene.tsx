import { useEffect, useMemo, useState } from 'react'
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
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null)
  const loadedTrack = useMemo(
    () => tracks.find((track) => track.id === loadedTrackId) ?? tracks[0],
    [loadedTrackId, tracks],
  )

  useEffect(() => {
    if (!loadingTrackId) return
    const timer = window.setTimeout(() => {
      onLoadedTrackChange(loadingTrackId)
      setLoadingTrackId(null)
    }, 640)
    return () => window.clearTimeout(timer)
  }, [loadingTrackId, onLoadedTrackChange])

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5.5, 0.01], fov: 34 }}>
      <color attach="background" args={['#2b1f1b']} />
      <ambientLight intensity={0.74} />
      <spotLight
        intensity={1.4}
        angle={0.36}
        penumbra={0.48}
        castShadow
        position={[0.9, 6, 1.2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.85} position={[-1.5, 3.2, -1.2]} />

      <group position={[0, -0.06, 0]}>
        <RecordPlayer loadedTrack={loadedTrack} isSpinning={loadingTrackId === null} />
        <VinylStack
          tracks={tracks}
          loadedTrackId={loadedTrackId}
          loadingTrackId={loadingTrackId}
          onTrackSelect={(trackId) => {
            if (trackId === loadedTrackId || trackId === loadingTrackId) return
            setLoadingTrackId(trackId)
          }}
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
