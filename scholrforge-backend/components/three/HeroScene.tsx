'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function HeroGeometry() {
  const meshRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const satellitesRef = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0005
      meshRef.current.rotation.y += 0.001
    }

    // Animate satellites
    if (satellitesRef.current) {
      satellitesRef.current.forEach((satellite, i) => {
        const angle = state.clock.elapsedTime * 0.5 + (i / 8) * Math.PI * 2
        satellite.position.x = Math.cos(angle) * 6
        satellite.position.z = Math.sin(angle) * 6
        satellite.rotation.x += 0.01
        satellite.rotation.y += 0.02
      })
    }
  })

  return (
    <group ref={meshRef}>
      {/* Central glowing icosahedron */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 4]} />
        <meshPhongMaterial
          color="#6c63ff"
          emissive="#6c63ff"
          emissiveIntensity={0.8}
          wireframe={true}
          wireframeLinewidth={2}
        />
      </mesh>

      {/* Orbiting satellites */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) satellitesRef.current[i] = el
          }}
          position={[6, 0, 0]}
        >
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhongMaterial
            color={i % 2 === 0 ? '#00d4aa' : '#ff4d6d'}
            emissive={i % 2 === 0 ? '#00d4aa' : '#ff4d6d'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* Connecting lines */}
      <Line start={[0, 0, 0]} end={[6, 0, 0]} color="#6c63ff" />
      <Line start={[0, 0, 0]} end={[-6, 0, 0]} color="#6c63ff" />
      <Line start={[0, 0, 0]} end={[0, 6, 0]} color="#00d4aa" />
      <Line start={[0, 0, 0]} end={[0, -6, 0]} color="#00d4aa" />
    </group>
  )
}

function Line({
  start,
  end,
  color,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} />
    </line>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6c63ff" />
      <pointLight position={[-10, -10, 10]} intensity={1} color="#00d4aa" />
      <pointLight position={[0, 0, 20]} intensity={0.8} color="#ff4d6d" />
    </>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      className="w-full h-full"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <Lights />
      <HeroGeometry />
      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  )
}
