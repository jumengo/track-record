import { useEffect } from 'react'
import { useSpring } from '@react-spring/three'

type MotionState = 'idle' | 'hovered' | 'loading' | 'loaded'

type UseVinylMotionArgs = {
  state: MotionState
  stackIndex: number
}

export function useVinylMotion({ state, stackIndex }: UseVinylMotionArgs) {
  const [spring, api] = useSpring(() => ({
    position: [0, stackIndex * 0.04, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1,
    config: { tension: 170, friction: 20 },
  }))

  useEffect(() => {
    const idleY = stackIndex * 0.04
    if (state === 'hovered') {
      api.start({
        position: [-0.18, idleY + 0.18, 0.18],
        rotation: [0.14, -0.2, 0.08],
        scale: 1.06,
      })
      return
    }

    if (state === 'loading') {
      api.start({
        position: [-2.2, 0.36, 0.2],
        rotation: [0.06, 0.08, -0.1],
        scale: 1.03,
        config: { tension: 160, friction: 18 },
      })
      return
    }

    if (state === 'loaded') {
      api.start({
        position: [-2.97, 0.29, 0.35],
        rotation: [0, 0, 0],
        scale: 1,
        config: { tension: 150, friction: 19 },
      })
      return
    }

    api.start({
      position: [0, idleY, 0],
      rotation: [0, 0, 0],
      scale: 1,
      config: { tension: 180, friction: 22 },
    })
  }, [api, stackIndex, state])

  return spring
}
