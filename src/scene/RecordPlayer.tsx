import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { a, useSpring } from '@react-spring/three'
import { Text, useTexture } from '@react-three/drei'
import { preloadFont } from 'troika-three-text'
import { Vector3, type Group } from 'three'
import type { VinylSideId, VinylTrack } from '../data/vinylTracks'
import { getVinylSide } from '../data/vinylTracks'

const ARC_LABEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .'
const ARC_LABEL_FONT =
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'

export const arcLabelFontReady = new Promise<void>((resolve) => {
  preloadFont({ font: ARC_LABEL_FONT, characters: ARC_LABEL_CHARS }, resolve)
})

const TONEARM_ARM_ROTATION: [number, number, number] = [5, 0, 0]
const TONEARM_REST_SPIN_Y = -0.5
const TONEARM_SWING_RADIANS = (20 * Math.PI) / 180
const TONEARM_POST_TOP_Y = 0.1 + 0.56 / 2
const TONEARM_ORIGIN = new Vector3(0.57, 0.72, -0.08)
const TONEARM_PIVOT = new Vector3(0.87, 0.26 + TONEARM_POST_TOP_Y, -0.63)
const TONEARM_ARM_OFFSET = (() => {
  const offset = TONEARM_ORIGIN.clone().sub(TONEARM_PIVOT)
  offset.applyAxisAngle(new Vector3(0, 1, 0), -TONEARM_REST_SPIN_Y)
  return [offset.x, offset.y, offset.z] as [number, number, number]
})()

type RecordPlayerProps = {
  loadedTrack?: VinylTrack
  loadedSideId?: VinylSideId
  vinylCenterText?: string
  isSpinning: boolean
  onTonearmEngagedChange?: (engaged: boolean) => void
}

export function RecordPlayer({
  loadedTrack,
  loadedSideId = 'a',
  vinylCenterText,
  isSpinning,
  onTonearmEngagedChange,
}: RecordPlayerProps) {
  const spinningRecordRef = useRef<Group>(null)
  const activeSide =
    loadedTrack != null ? getVinylSide(loadedTrack, loadedSideId) : null

  useFrame((_, delta) => {
    if (!spinningRecordRef.current || !isSpinning) return
    spinningRecordRef.current.rotation.y -= delta * 1.65
  })

  return (
    <group position={[0, -0.56, -0.5]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 0.26, 2.62]} />
        <meshStandardMaterial color="#7a4f38" metalness={0.1} roughness={0.75} />
      </mesh>

      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.08, 2.36]} />
        <meshStandardMaterial color="#e6d8bd" metalness={0.06} roughness={0.88} />
      </mesh>

      <mesh position={[-0.32, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.92, 0.08, 100]} />
        <meshStandardMaterial color="#222227" metalness={0.4} roughness={0.34} />
      </mesh>

      <group ref={spinningRecordRef} position={[-0.32, 0.28, 0]}>
        <RecordDiscBase />
        {vinylCenterText ? (
          <ArcLabelText text={vinylCenterText} radius={0.16} y={0.031} />
        ) : activeSide ? (
          <>
            <Suspense fallback={null}>
              <RecordLabelTexture labelAsset={activeSide.labelAsset} />
            </Suspense>
            <ArcLabelText text={activeSide.subtitle} radius={0.16} y={0.031} />
          </>
        ) : null}
        <RecordSpindle />
      </group>

      <TonearmAssembly onTonearmEngagedChange={onTonearmEngagedChange} />

      <ControlKnob position={[0.95, 0.21, 0.58]} />
      <ControlKnob position={[0.95, 0.21, 0.13]} />
    </group>
  )
}

function TonearmAssembly({
  onTonearmEngagedChange,
}: {
  onTonearmEngagedChange?: (engaged: boolean) => void
}) {
  const [engaged, setEngaged] = useState(false)
  const { rotationY } = useSpring({
    rotationY: engaged ? TONEARM_REST_SPIN_Y + TONEARM_SWING_RADIANS : TONEARM_REST_SPIN_Y,
    config: { tension: 140, friction: 16 },
  })

  const toggleTonearm = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    setEngaged((value) => {
      const next = !value
      onTonearmEngagedChange?.(next)
      return next
    })
  }

  return (
    <group position={[0.87, 0.26, -0.63]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow onClick={toggleTonearm}>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 60]} />
        <meshStandardMaterial color="#2a2a30" metalness={0.4} roughness={0.32} />
      </mesh>

      <mesh position={[0, 0.05, 0]} castShadow onClick={toggleTonearm}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 50]} />
        <meshStandardMaterial color="#212228" metalness={0.48} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.1, 0]} castShadow onClick={toggleTonearm}>
        <cylinderGeometry args={[0.08, 0.08, 0.56, 40]} />
        <meshStandardMaterial color="#d8d8db" metalness={0.7} roughness={0.2} />
      </mesh>

      <group position={[0, TONEARM_POST_TOP_Y, 0]}>
        <a.group rotation-y={rotationY}>
          <group position={TONEARM_ARM_OFFSET} rotation={TONEARM_ARM_ROTATION}>
            <mesh castShadow onClick={toggleTonearm}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 24]} />
              <meshStandardMaterial color="#c6c8cc" metalness={0.78} roughness={0.21} />
            </mesh>
          </group>
        </a.group>
      </group>
    </group>
  )
}

function RecordDiscBase() {
  return (
    <>
      <mesh castShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.035, 100]} />
        <meshStandardMaterial color="#0e0e12" metalness={0.22} roughness={0.28} />
      </mesh>

      <mesh position={[0, 0.017, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.012, 64]} />
        <meshStandardMaterial color="#c08263" metalness={0.14} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.024, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.19, 64]} />
        <meshBasicMaterial color="#d08f70" />
      </mesh>
    </>
  )
}

function RecordLabelTexture({ labelAsset }: { labelAsset: string }) {
  const labelTexture = useTexture(labelAsset)
  return (
    <mesh position={[0, 0.023, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.175, 64]} />
      <meshBasicMaterial map={labelTexture} transparent toneMapped={false} />
    </mesh>
  )
}

function RecordSpindle() {
  return (
    <mesh position={[0, 0.032, 0]} castShadow>
      <cylinderGeometry args={[0.03, 0.03, 0.04, 24]} />
      <meshStandardMaterial color="#4f4a49" metalness={0.5} roughness={0.42} />
    </mesh>
  )
}

function ArcLabelText({ text, radius, y }: { text: string; radius: number; y: number }) {
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    arcLabelFontReady.then(() => {
      if (!cancelled) setFontReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const upperText = text.toUpperCase()
  const chars = upperText.split('')
  const safeChars = chars.length ? chars : ['T']
  const maxSpan = Math.PI * 0.95
  const baseFontSize = 0.07
  const minFontSize = 0.027
  const glyphWidthFactor = 0.62
  const minGap = 0.02
  const baseGap = 0.02

  const charCount = safeChars.length
  const gaps = Math.max(0, charCount - 1)
  const estimateSpan = (fontSize: number, gap: number) =>
    ((charCount * fontSize * glyphWidthFactor) + gaps * gap) / radius

  const baseSpan = estimateSpan(baseFontSize, baseGap)
  const fitScale = baseSpan > maxSpan ? maxSpan / baseSpan : 1
  const fontSize = Math.max(minFontSize, baseFontSize * fitScale)

  const fittedGap = Math.max(minGap, baseGap * fitScale)
  const usedSpan = estimateSpan(fontSize, fittedGap)
  const step = charCount <= 1 ? 0 : usedSpan / gaps
  const start = -usedSpan / 2

  if (!fontReady) return null

  return (
    <Suspense fallback={null}>
      <group position={[0, y, 0]} renderOrder={2}>
        {safeChars.map((char, index) => {
          const angle = start + index * step
          const x = Math.sin(angle) * radius
          const z = -Math.cos(angle) * radius
          const tangentRotation = -angle + Math.PI / 2
          const charRotation = tangentRotation + Math.PI + Math.PI / 2
          return (
            <Text
              key={`${char}-${index}`}
              position={[x, 0, z]}
              rotation={[-Math.PI / 2, 0, charRotation]}
              font={ARC_LABEL_FONT}
              fontSize={fontSize}
              characters={ARC_LABEL_CHARS}
              anchorX="center"
              anchorY="middle"
              color="#fff7ef"
              outlineWidth={0.004}
              outlineColor="#fff7ef"
              renderOrder={2}
              material-toneMapped={false}
              material-depthTest={false}
            >
              {char}
            </Text>
          )
        })}
      </group>
    </Suspense>
  )
}

function ControlKnob({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.08, 48]} />
        <meshStandardMaterial color="#26272d" metalness={0.42} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.045, 0.03]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.018, 0.03, 0.02]} />
        <meshStandardMaterial color="#d8d9dd" metalness={0.62} roughness={0.25} />
      </mesh>
    </group>
  )
}
