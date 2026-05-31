"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

function Cookie() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const cookieGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.6, 48, 48)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const stretch = 0.55 + 0.08 * Math.sin(x * 3) * Math.cos(z * 2.5)
      const noise =
        0.04 * Math.sin(x * 5 + y * 3) * Math.cos(z * 4 + y * 2) +
        0.03 * Math.sin(x * 7 + z * 5)
      pos.setXYZ(i, x * stretch + noise, y * (0.35 + noise * 0.3), z * stretch + noise)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  const chips = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < 28; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.2 + Math.random() * 0.4
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = (Math.random() - 0.5) * 0.6
      const z = r * Math.sin(phi) * Math.sin(theta)
      positions.push([x, y, z])
    }
    return positions
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={cookieGeometry}>
        <meshStandardMaterial
          color="#D4A574"
          roughness={0.7}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>
      {chips.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.12 + Math.random() * 0.1, 12, 12]} />
          <meshStandardMaterial
            color="#3B2314"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function CookieScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 4.5], fov: 35 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#E8C99B" />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="#F5E6CC" />
        <Cookie />
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
          far={2}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  )
}
