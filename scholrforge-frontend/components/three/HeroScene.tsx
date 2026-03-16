'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.04
      glowRef.current.scale.setScalar(s)
    }
  })

  return (
    <>
      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial
          color="#6c63ff"
          emissive="#6c63ff"
          emissiveIntensity={0.15}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Core — distorted sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.7, 5]} />
        <MeshDistortMaterial
          color="#1a1830"
          emissive="#6c63ff"
          emissiveIntensity={0.4}
          distort={0.18}
          speed={1.5}
          roughness={0.1}
          metalness={0.9}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.72, 3]} />
        <meshStandardMaterial
          color="#6c63ff"
          emissive="#6c63ff"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  )
}

function Rings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ring1.current) ring1.current.rotation.z = t * 0.18
    if (ring2.current) ring2.current.rotation.z = -t * 0.12
    if (ring3.current) ring3.current.rotation.y = t * 0.22
  })

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[3.4, 0.022, 16, 180]} />
        <meshStandardMaterial color="#6c63ff" emissive="#6c63ff" emissiveIntensity={1.2} roughness={0} metalness={1} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3.5, 1.1, 0]}>
        <torusGeometry args={[4.2, 0.016, 16, 180]} />
        <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={1.0} roughness={0} metalness={1} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 5, 2.0, 0]}>
        <torusGeometry args={[2.7, 0.014, 16, 180]} />
        <meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={0.9} roughness={0} metalness={1} />
      </mesh>
    </>
  )
}

function Satellites() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<THREE.Mesh[]>([])

  const data = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    phase: (i / 10) * Math.PI * 2,
    speed: 0.3 + (i % 3) * 0.15,
    orbit: 4.8 + (i % 2) * 0.8,
    tilt: (i % 4) * 0.3,
    color: ['#6c63ff', '#00d4aa', '#ff4d6d', '#ffd700', '#00e0ff'][i % 5],
    size: 0.12 + (i % 3) * 0.07,
    shape: i % 3,
  })), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const d = data[i]
      const angle = t * d.speed + d.phase
      mesh.position.x = Math.cos(angle) * d.orbit
      mesh.position.z = Math.sin(angle) * d.orbit
      mesh.position.y = Math.sin(angle * 2 + d.tilt) * 0.8
      mesh.rotation.x += 0.02
      mesh.rotation.y += 0.03
    })
  })

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => { if (el) meshRefs.current[i] = el }}>
          {d.shape === 0 && <octahedronGeometry args={[d.size, 0]} />}
          {d.shape === 1 && <tetrahedronGeometry args={[d.size * 1.2, 0]} />}
          {d.shape === 2 && <dodecahedronGeometry args={[d.size * 0.9, 0]} />}
          <meshStandardMaterial
            color={d.color}
            emissive={d.color}
            emissiveIntensity={1.4}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={2}
          />
        </mesh>
      ))}
    </>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null)

  const { geo, speeds } = useMemo(() => {
    const count = 300
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      speeds[i] = 0.001 + Math.random() * 0.003
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo, speeds }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const t = clock.elapsedTime
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3] += Math.sin(t * speeds[i] + i) * 0.003
      pos[i * 3 + 1] += Math.cos(t * speeds[i] + i) * 0.003
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#8b85ff" size={0.035} transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function Lights() {
  const light1 = useRef<THREE.PointLight>(null)
  const light2 = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.5) * 8
      light1.current.position.z = Math.cos(t * 0.5) * 8
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(t * 0.3) * 6
      light2.current.position.z = Math.sin(t * 0.3) * 6
    }
  })

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={light1} position={[8, 4, 8]} intensity={40} color="#6c63ff" distance={25} decay={2} />
      <pointLight ref={light2} position={[-6, -4, 6]} intensity={30} color="#00d4aa" distance={20} decay={2} />
      <pointLight position={[0, 8, 0]} intensity={15} color="#ffffff" distance={18} decay={2} />
      <pointLight position={[0, -8, 4]} intensity={20} color="#ff4d6d" distance={18} decay={2} />
    </>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      dpr={[1, 1.5]}
    >
      <PerspectiveCamera makeDefault position={[0, 2, 11]} fov={50} />
      <Environment preset="night" />
      <Lights />
      <CoreSphere />
      <Rings />
      <Satellites />
      <Particles />
      <OrbitControls autoRotate autoRotateSpeed={0.8} enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  )
}