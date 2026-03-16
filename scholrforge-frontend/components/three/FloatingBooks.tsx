'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Float, MeshReflectorMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

const PALETTE = ['#6c63ff', '#00d4aa', '#ff4d6d', '#ffd700', '#00e0ff', '#a78bfa']

// ── Floating particles ────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef<THREE.Points>(null)

  const { geo, speeds, phases } = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = 0.003 + Math.random() * 0.005
      phases[i] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo, speeds, phases }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const t = clock.elapsedTime
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3] += Math.sin(t * speeds[i] + phases[i]) * 0.004
      pos[i * 3 + 1] += Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.003
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#9b8fff" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

// ── Single book ───────────────────────────────────────────────────────────────
function BookMesh({
  position, rotation, color, offset, thickness = 0.28,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  offset: number
  thickness?: number
}) {
  const pagesRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const stripRef = useRef<THREE.Mesh>(null)

  const coverColor = useMemo(() => new THREE.Color(color), [color])
  const darkCover = useMemo(() => new THREE.Color(color).multiplyScalar(0.55), [color])
  const spineColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.65), [color])
  const rimColor = useMemo(() => new THREE.Color(color).multiplyScalar(1.4), [color])
  const pageColor = useMemo(() => new THREE.Color('#ede8dc'), [])
  const pageEdge = useMemo(() => new THREE.Color('#c8bfa8'), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + offset
    if (pagesRef.current) pagesRef.current.rotation.y = Math.sin(t * 0.35) * 0.1
    if (stripRef.current) (stripRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + Math.sin(t * 1.4) * 0.3
    if (glowRef.current) glowRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04)
  })

  const h = 1.9
  const w = 1.4
  const t2 = thickness / 2

  return (
    <Float speed={1.1 + offset * 0.18} rotationIntensity={0.35} floatIntensity={0.55} floatingRange={[-0.28, 0.28]}>
      <group position={position} rotation={rotation}>

        {/* ── Outer glow shell ── */}
        <mesh ref={glowRef}>
          <boxGeometry args={[w + 0.12, h + 0.12, thickness + 0.12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.08}
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>

        {/* ── Back cover ── */}
        <mesh position={[0, 0, -t2]}>
          <boxGeometry args={[w, h, 0.055]} />
          <meshStandardMaterial color={darkCover} roughness={0.45} metalness={0.15} envMapIntensity={1.2} />
        </mesh>

        {/* ── Front cover ── */}
        <mesh position={[0, 0, t2]}>
          <boxGeometry args={[w, h, 0.055]} />
          <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.2} envMapIntensity={1.4} />
        </mesh>

        {/* ── Cover emboss pattern (subtle grid) ── */}
        <mesh position={[0.05, 0, t2 + 0.029]}>
          <planeGeometry args={[1.15, 1.65]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.04}
            roughness={0.8}
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* ── Spine ── */}
        <mesh position={[-0.67, 0, 0]}>
          <boxGeometry args={[0.075, h, thickness + 0.055]} />
          <meshStandardMaterial color={spineColor} roughness={0.5} metalness={0.1} envMapIntensity={0.9} />
        </mesh>

        {/* ── Spine rim highlight ── */}
        <mesh position={[-0.628, 0, 0]}>
          <boxGeometry args={[0.006, h * 0.92, thickness * 0.6]} />
          <meshStandardMaterial color={rimColor} emissive={rimColor} emissiveIntensity={0.5} roughness={0} metalness={1} />
        </mesh>

        {/* ── Pages block ── */}
        <mesh ref={pagesRef} position={[0.04, 0, 0]}>
          <boxGeometry args={[w - 0.15, h - 0.06, thickness - 0.045]} />
          <meshStandardMaterial color={pageColor} roughness={0.92} metalness={0} />
        </mesh>

        {/* ── Page-edge micro lines ── */}
        {[-0.06, -0.02, 0.02, 0.06].map((z, i) => (
          <mesh key={i} position={[0.665, 0, z]}>
            <boxGeometry args={[0.003, h - 0.1, 0.001]} />
            <meshStandardMaterial color={pageEdge} roughness={1} metalness={0} />
          </mesh>
        ))}

        {/* ── Emissive title strip ── */}
        <mesh ref={stripRef} position={[0.05, 0.42, t2 + 0.031]}>
          <planeGeometry args={[0.95, 0.16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.9}
            transparent
            opacity={0.88}
            roughness={0}
          />
        </mesh>

        {/* ── Second smaller accent strip ── */}
        <mesh position={[0.05, -0.52, t2 + 0.031]}>
          <planeGeometry args={[0.55, 0.07]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
            roughness={0}
          />
        </mesh>

        {/* ── Corner dog-ear fold ── */}
        <mesh position={[0.56, 0.78, t2 + 0.031]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
            roughness={0}
          />
        </mesh>

      </group>
    </Float>
  )
}

// ── Reflective ground ─────────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[512, 128]}
        resolution={1024}
        mixBlur={1.2}
        mixStrength={20}
        depthScale={1.2}
        minDepthThreshold={0.8}
        color="#080810"
        metalness={0.7}
        roughness={1}
        mirror={0}
      />
    </mesh>
  )
}

// ── Lights ────────────────────────────────────────────────────────────────────
function Lights() {
  const keyRef = useRef<THREE.SpotLight>(null)
  const fillRef = useRef<THREE.PointLight>(null)
  const rimRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (keyRef.current) {
      keyRef.current.position.x = Math.sin(t * 0.18) * 4
      keyRef.current.position.z = Math.cos(t * 0.12) * 3 + 5
    }
    if (fillRef.current) {
      fillRef.current.intensity = 18 + Math.sin(t * 0.9) * 4
    }
    if (rimRef.current) {
      rimRef.current.position.x = Math.cos(t * 0.22) * 5
    }
  })

  return (
    <>
      <ambientLight intensity={0.18} color="#7070cc" />

      {/* Animated key light */}
      <spotLight
        ref={keyRef}
        position={[4, 9, 5]}
        angle={0.35}
        penumbra={0.85}
        intensity={80}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Primary color fills */}
      <pointLight position={[-5, 3, 4]} ref={fillRef} intensity={22} color="#6c63ff" distance={22} decay={2} />
      <pointLight position={[5, 2, -3]} intensity={18} color="#00d4aa" distance={20} decay={2} />
      <pointLight position={[0, -1, 6]} intensity={14} color="#ff4d6d" distance={16} decay={2} />

      {/* Rim / back light */}
      <pointLight ref={rimRef} position={[0, 6, -6]} intensity={30} color="#a78bfa" distance={20} decay={2} />

      {/* Ground bounce */}
      <pointLight position={[0, -3, 3]} intensity={8} color="#ffd700" distance={12} decay={2} />
    </>
  )
}

// ── Book layout ───────────────────────────────────────────────────────────────
const BOOKS = [
  { position: [-3.4, 0.3, 0.6] as [number, number, number], rotation: [0.10, 0.40, 0.14] as [number, number, number], colorIndex: 0, offset: 0.0, thickness: 0.34 },
  { position: [-1.2, 0.9, -0.9] as [number, number, number], rotation: [0.18, 1.10, 0.09] as [number, number, number], colorIndex: 1, offset: 1.1, thickness: 0.22 },
  { position: [0.7, -0.4, 0.7] as [number, number, number], rotation: [0.14, 0.20, 0.24] as [number, number, number], colorIndex: 2, offset: 2.2, thickness: 0.40 },
  { position: [3.1, 0.7, -0.4] as [number, number, number], rotation: [0.09, 1.60, 0.05] as [number, number, number], colorIndex: 3, offset: 0.7, thickness: 0.28 },
  { position: [-1.9, -1.0, 1.3] as [number, number, number], rotation: [0.28, 0.50, 0.34] as [number, number, number], colorIndex: 4, offset: 1.7, thickness: 0.20 },
  { position: [1.9, 1.2, -1.2] as [number, number, number], rotation: [0.20, 0.90, 0.11] as [number, number, number], colorIndex: 5, offset: 2.8, thickness: 0.30 },
  { position: [0.3, -1.5, -0.6] as [number, number, number], rotation: [0.38, 1.30, 0.19] as [number, number, number], colorIndex: 0, offset: 3.2, thickness: 0.25 },
]

// ── Scene ─────────────────────────────────────────────────────────────────────
export default function FloatingBooks() {
  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
      dpr={[1, 1.5]}
    >
      <PerspectiveCamera makeDefault position={[0, 1.2, 9.5]} fov={46} />

      <Environment preset="night" />

      {/* Deep-space star field */}
      <Stars radius={60} depth={30} count={800} factor={2} saturation={0.4} fade speed={0.4} />

      <Lights />

      {BOOKS.map((b, i) => (
        <BookMesh
          key={i}
          position={b.position}
          rotation={b.rotation}
          color={PALETTE[b.colorIndex]}
          offset={b.offset}
          thickness={b.thickness}
        />
      ))}

      <Particles />
      <Ground />
    </Canvas>
  )
}