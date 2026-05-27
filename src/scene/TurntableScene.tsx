import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useProgress } from '@react-three/drei'
import type { OrthographicCamera } from 'three'
import type { VinylSideId, VinylTrack } from '../data/vinylTracks'
import { RecordPlayer, arcLabelFontReady } from './RecordPlayer'
import { VinylStack } from './VinylStack'

type TurntableSceneFullProps = {
  mode?: 'full'
  showVinylStack?: boolean
  tracks: VinylTrack[]
  loadedTrackId: string
  sideByTrackId: Record<string, VinylSideId>
  isPlaying: boolean
  onLoadedTrackChange: (trackId: string) => void
}

type TurntableSceneLandingProps = {
  mode: 'landing'
  vinylCenterText?: string
  isSpinning?: boolean
  onTonearmEngagedChange?: (engaged: boolean) => void
}

export type TurntableSceneProps = TurntableSceneFullProps | TurntableSceneLandingProps

const SCENE_BG = '#c48872'

function TopDownCamera({
  distance,
  target = [0, 0, 0],
  zoom,
}: {
  distance: number
  target?: [number, number, number]
  zoom?: number
}) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  useLayoutEffect(() => {
    camera.up.set(0, 0, -1)
    camera.position.set(0, distance, 0)
    camera.lookAt(...target)

    if (zoom != null && (camera as OrthographicCamera).isOrthographicCamera) {
      ;(camera as OrthographicCamera).zoom = zoom
    }

    camera.updateProjectionMatrix()
  }, [camera, distance, target, zoom, size.width, size.height])

  return null
}

function SceneLighting() {
  return (
    <>
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
    </>
  )
}

function SceneAtmosphere() {
  return (
    <>
      <SceneLighting />
      <Environment preset="city" />
    </>
  )
}

function SceneReadySignal({ onReady }: { onReady: () => void }) {
  const { active } = useProgress()
  const [fontLoaded, setFontLoaded] = useState(false)
  const framesAfterReady = useRef(0)
  const signaled = useRef(false)

  useEffect(() => {
    let cancelled = false
    arcLabelFontReady.then(() => {
      if (!cancelled) setFontLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useFrame(() => {
    if (signaled.current || !fontLoaded || active) {
      framesAfterReady.current = 0
      return
    }

    framesAfterReady.current += 1
    if (framesAfterReady.current >= 2) {
      signaled.current = true
      onReady()
    }
  })

  return null
}

export function TurntableScene(props: TurntableSceneProps) {
  const [isReady, setIsReady] = useState(false)
  const isLanding = props.mode === 'landing'

  const loadedTrack = useMemo(() => {
    if (isLanding) return undefined
    return (
      props.tracks.find((track) => track.id === props.loadedTrackId) ?? props.tracks[0]
    )
  }, [isLanding, props])

  const loadedSideId = isLanding ? 'a' : (props.sideByTrackId[props.loadedTrackId] ?? 'a')
  const isSpinning = isLanding ? (props.isSpinning ?? true) : props.isPlaying
  const vinylCenterText = isLanding ? (props.vinylCenterText ?? 'In progress...') : undefined
  const showVinylStack = !isLanding && (props.showVinylStack ?? true)
  const sceneBackground = isLanding ? SCENE_BG : '#2b1f1b'
  const cameraDistance = isLanding ? 10 : 6
  const cameraZoom = isLanding ? 108 : undefined
  const cameraTarget = useMemo<[number, number, number]>(
    () => (isLanding ? [0, 0, -0.5] : [0, 0, 0]),
    [isLanding],
  )

  return (
    <div
      className={
        isReady ? 'turntable-scene-wrap turntable-scene-wrap--ready' : 'turntable-scene-wrap'
      }
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        orthographic={isLanding}
        camera={
          isLanding
            ? { zoom: cameraZoom, near: 0.1, far: 100, position: [0, 10, 0] }
            : { fov: 32, near: 0.1, far: 100 }
        }
        gl={{ alpha: false }}
      >
        <SceneReadySignal onReady={() => setIsReady(true)} />
        <TopDownCamera distance={cameraDistance} target={cameraTarget} zoom={cameraZoom} />
        <color attach="background" args={[sceneBackground]} />

        <Suspense fallback={null}>
          <SceneAtmosphere />
        </Suspense>

        <group position={[0, -0.06, 0]}>
          <RecordPlayer
            loadedTrack={loadedTrack}
            loadedSideId={loadedSideId}
            vinylCenterText={vinylCenterText}
            isSpinning={isSpinning}
            onTonearmEngagedChange={
              isLanding ? props.onTonearmEngagedChange : undefined
            }
          />
          {showVinylStack && !isLanding ? (
            <VinylStack
              tracks={props.tracks}
              loadedTrackId={props.loadedTrackId}
              onTrackSelect={props.onLoadedTrackChange}
            />
          ) : null}
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
          <planeGeometry args={[5.5, 5.5]} />
          <meshStandardMaterial color="#8f5a44" roughness={0.92} />
        </mesh>
      </Canvas>
    </div>
  )
}
