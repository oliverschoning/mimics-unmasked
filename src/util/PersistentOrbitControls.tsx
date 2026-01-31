import { OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import React from "react"

type LocalStorageState = {
  position: [number, number, number],
  target: [number, number, number]
}

type Props = {
  persist?: { localStorageKey: string }
  enabled?: boolean,
  initialCameraPosition?: [number, number, number]
}

export function PersistentOrbitControls({ enabled = true, ...props }: Props) {
  const controlsRef = React.useRef<any>(null!)
  const { camera } = useThree()

  const key = React.useMemo(() => "PersistentOrbitControls_" + props.persist?.localStorageKey, [props.persist])

  // Load saved state on mount
  React.useEffect(() => {
    if (!enabled) {
      return
    }
    if (!props.persist) {
      return
    }
    const saved = localStorage.getItem(key)
    if (saved) {
      const { position, target } = JSON.parse(saved) as LocalStorageState;
      if (position) camera.position.set(...position)
      if (controlsRef.current && target) {
        controlsRef.current.target.set(...target)
        controlsRef.current.update()
      }
    }
  }, [camera])

  // Save state whenever the controls change
  const handleChange = () => {
    if (!enabled) {
      return
    }
    if (!props.persist) {
      return
    }
    if (!controlsRef.current) return
    const { target } = controlsRef.current
    const { position } = camera
    const state = {
      position: [position.x, position.y, position.z],
      target: [target.x, target.y, target.z],
    }
    localStorage.setItem(key, JSON.stringify(state))
  }

  return <OrbitControls enabled={enabled} ref={controlsRef} onChange={handleChange} />
}
