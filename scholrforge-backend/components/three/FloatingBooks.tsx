'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BOOK_COLORS = ['#6c63ff', '#00d4aa', '#ff4d6d', '#ffd700', '#00e0ff', '#ff6b9d']

function Book({
  position,
  rotation,
  colorIndex,
  offset,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  colorIndex: number
  offset: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startRotation = useRef(rotation)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + offset
      meshRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.5
      meshRef.current.rotation.x = startRotation.current[0] + time * 0.3
      meshRef.current.rotation.y = startRotation.current[1] + time * 0.5
      meshRef.current.rotation.z = startRotation.current[2] + time * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[1.2, 1.6, 0.3]} />
      <meshPhongMaterial
        color={BOOK_COLORS[colorIndex % BOOK_COLORS.length]}
        emissive={BOOK_COLORS[colorIndex % BOOK_COLORS.length]}
        emissiveIntensity={0.4}
        shininess={100}
      />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} color="#ffffff" />
      <pointLight position={[8, 5, 8]} intensity={1.2} color="#6c63ff" />
      <pointLight position={[-8, 5, 8]} intensity={1} color="#00d4aa" />
    </>
  )
}

export default function FloatingBooks() {
  const books = [
    { position: [-3, 0, 0], rotation: [0.5, 0.5, 0.3], colorIndex: 0, offset: 0 },
    { position: [-1, 1, 1], rotation: [0.3, 1, 0.5], colorIndex: 1, offset: 1 },
    { position: [1, -0.5, -1], rotation: [0.8, 0.2, 0.7], colorIndex: 2, offset: 2 },
    { position: [3, 0.8, 0.5], rotation: [0.2, 1.5, 0.3], colorIndex: 3, offset: 3 },
    { position: [-1.5, -1, 1.5], rotation: [0.6, 0.3, 0.9], colorIndex: 4, offset: 1.5 },
    { position: [1.5, 1.2, -1], rotation: [0.4, 0.8, 0.2], colorIndex: 5, offset: 2.5 },
  ]

  return (
    <Canvas
      className="w-full h-full"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <perspectiveCamera makeDefault position={[0, 0, 8]} />
      <Lights />
      {books.map((book, i) => (
        <Book
          key={i}
          position={book.position as [number, number, number]}
          rotation={book.rotation as [number, number, number]}
          colorIndex={book.colorIndex}
          offset={book.offset}
        />
      ))}
    </Canvas>
  )
}
