import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import type { Group } from 'three'
import type { VinylTrack } from '../data/vinylTracks'

type RecordPlayerProps = {
  loadedTrack: VinylTrack
  isSpinning: boolean
}

export function RecordPlayer({ loadedTrack, isSpinning }: RecordPlayerProps) {
  const spinningRecordRef = useRef<Group>(null)
  const labelTexture = useTexture(loadedTrack.labelAsset)

  useFrame((_, delta) => {
    if (!spinningRecordRef.current || !isSpinning) return
    spinningRecordRef.current.rotation.y -= delta * 1.65
  })

  return (
    <group position={[0, -0.56, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.26, 2.62]} />
        <meshStandardMaterial color="#7a4f38" metalness={0.1} roughness={0.75} />
      </mesh>

      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[3.35, 0.08, 2.36]} />
        <meshStandardMaterial color="#e6d8bd" metalness={0.06} roughness={0.88} />
      </mesh>

      <mesh position={[0, 0.85, -1.22]} rotation={[0, 0, 0.02]}>
        <boxGeometry args={[3.42, 0.02, 0.94]} />
        <meshStandardMaterial
          color="#d4def0"
          transparent
          opacity={0.22}
          metalness={0.1}
          roughness={0.15}
        />
      </mesh>

      <mesh position={[-0.62, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.92, 0.08, 100]} />
        <meshStandardMaterial color="#222227" metalness={0.4} roughness={0.34} />
      </mesh>

      <group ref={spinningRecordRef} position={[-0.62, 0.28, 0]}>
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

        <mesh position={[0, 0.023, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <circleGeometry args={[0.175, 64]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>

        <ArcLabelText text={loadedTrack.title} radius={0.11} y={0.031} />

        <mesh position={[0, 0.032, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 24]} />
          <meshStandardMaterial color="#4f4a49" metalness={0.5} roughness={0.42} />
        </mesh>
      </group>

      <group position={[0.97, 0.26, -0.53]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 60]} />
          <meshStandardMaterial color="#2a2a30" metalness={0.4} roughness={0.32} />
        </mesh>

        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.1, 50]} />
          <meshStandardMaterial color="#212228" metalness={0.48} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 40]} />
          <meshStandardMaterial color="#d8d8db" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.97, 0.34, -0.52]} rotation={[0, 0, -0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.18, 24]} />
          <meshStandardMaterial color="#c6c8cc" metalness={0.78} roughness={0.21} />
        </mesh>

        <mesh position={[0.36, -0.48, 0]} rotation={[0, 0, 0.18]} castShadow>
          <boxGeometry args={[0.29, 0.045, 0.07]} />
          <meshStandardMaterial color="#454851" metalness={0.45} roughness={0.34} />
        </mesh>
      </group>

      <ControlKnob position={[1.25, 0.21, 0.58]} />
      <ControlKnob position={[1.25, 0.21, 0.13]} />
      <HtmlTrackLabel title={loadedTrack.title} />
    </group>
  )
}

function ArcLabelText({ text, radius, y }: { text: string; radius: number; y: number }) {
  const chars = text.toUpperCase().split('')
  const safeChars = chars.length ? chars : ['T']
  const maxSpan = Math.PI * 0.95
  const baseFontSize = 0.046
  const minFontSize = 0.027
  const glyphWidthFactor = 0.62
  const minGap = 0.014
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

  return (
    <group position={[0, y, 0]}>
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
            fontSize={fontSize}
            anchorX="center"
            anchorY="middle"
            color="#fff7ef"
            outlineWidth={0.006}
            outlineColor="#24170f"
          >
            {char}
          </Text>
        )
      })}
    </group>
  )
}

function HtmlTrackLabel({ title }: { title: string }) {
  return (
    <group position={[1.08, 0.19, 0.92]}>
      <mesh>
        <boxGeometry args={[0.86, 0.2, 0.02]} />
        <meshStandardMaterial color="#dfd4ba" roughness={0.86} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.045, 0.012]}>
        <planeGeometry args={[0.7, 0.04]} />
        <meshBasicMaterial color="#8f887a" />
      </mesh>
      <mesh position={[0, -0.02, 0.012]}>
        <planeGeometry args={[0.64, 0.06]} />
        <meshBasicMaterial color={title === 'Contact' ? '#b9d8ff' : '#e8b8a8'} />
      </mesh>
    </group>
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
