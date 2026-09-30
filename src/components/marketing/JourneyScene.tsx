'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  Object3D,
  OrthographicCamera,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
} from 'three'

type Position = [number, number, number]
type SceneProps = {
  stage: number
  active: boolean
  reducedMotion: boolean
  paused: boolean
  onReady: () => void
  onError: () => void
}

const palette = {
  blue: '#0083ca',
  brightBlue: '#3d94d9',
  teal: '#006fa8',
  coral: '#e5633f',
  ink: '#242b38',
  concrete: '#dce1e9',
  roof: '#ffffff',
  grass: '#d8e1cc',
  road: '#687381',
}

function Block({ position, size, color, rotation = [0, 0, 0], shadow = true }: {
  position: Position
  size: Position
  color: string
  rotation?: Position
  shadow?: boolean
}) {
  return <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
    <boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
}

function Blocks({ positions, size, color, shadow = true }: {
  positions: Position[]
  size: Position
  color: string
  shadow?: boolean
}) {
  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!ref.current) return
    const object = new Object3D()
    positions.forEach((position, index) => {
      object.position.set(...position)
      object.updateMatrix()
      ref.current!.setMatrixAt(index, object.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [positions])
  return <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} castShadow={shadow} receiveShadow>
    <boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.82} />
  </instancedMesh>
}

function useBrandTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 192
    const context = canvas.getContext('2d')
    if (context) {
      context.clearRect(0, 0, 512, 192)
      context.fillStyle = '#ffffff'
      context.font = 'italic 900 128px Arial, sans-serif'
      context.textAlign = 'center'
      context.fillText('TBS', 249, 133)
      context.fillRect(85, 150, 335, 5)
    }
    const result = new CanvasTexture(canvas)
    result.colorSpace = SRGBColorSpace
    return result
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function Brand({ texture, position, width = 1.2 }: { texture: CanvasTexture; position: Position; width?: number }) {
  return <mesh position={position}>
    <planeGeometry args={[width, width * 0.375]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
  </mesh>
}

function Container({ position, color = palette.blue, length = 3.1, texture }: {
  position: Position
  color?: string
  length?: number
  texture: CanvasTexture
}) {
  const ribs = useMemo<Position[]>(() => Array.from({ length: 19 }, (_, index) => [-length / 2 + 0.1 + index * (length - 0.2) / 18, 0.67, 0.621]), [length])
  const topRibs = useMemo<Position[]>(() => ribs.map(([x]) => [x, 1.291, 0]), [ribs])
  const ribColor = useMemo(() => new Color(color).multiplyScalar(1.13), [color])
  return <group position={position}>
    <Block position={[0, 0.65, 0]} size={[length, 1.28, 1.22]} color={color} />
    <Blocks positions={ribs} size={[0.045, 1.13, 0.035]} color={`#${ribColor.getHexString()}`} />
    <Blocks positions={topRibs} size={[0.035, 0.025, 1.1]} color={`#${ribColor.getHexString()}`} shadow={false} />
    <Blocks positions={[[-length / 2 + 0.04, 0.65, 0.65], [length / 2 - 0.04, 0.65, 0.65]]} size={[0.07, 1.3, 0.07]} color={color} />
    <Blocks positions={[[0, 0.04, 0.64], [0, 1.27, 0.64]]} size={[length, 0.06, 0.05]} color={color} />
    <Block position={[length / 2 + 0.01, 0.65, 0]} size={[0.035, 1.16, 1.08]} color={color} />
    <Blocks positions={[[length / 2 + 0.035, 0.65, -0.28], [length / 2 + 0.035, 0.65, 0.28]]} size={[0.035, 1.08, 0.025]} color="#c0c8d7" />
    <Brand position={[0, 0.77, 0.66]} texture={texture} width={length * 0.51} />
  </group>
}

function Roof({ width, depth, color }: { width: number; depth: number; color: string }) {
  const geometry = useMemo(() => {
    const x = width / 2
    const z = depth / 2
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute([
      -x, 0, z, 0, 0.48, z, -x, 0, -z,
      0, 0.48, z, 0, 0.48, -z, -x, 0, -z,
      0, 0.48, z, x, 0, z, x, 0, -z,
      0, 0.48, z, x, 0, -z, 0, 0.48, -z,
      -x, 0, z, x, 0, z, 0, 0.48, z,
      x, 0, -z, -x, 0, -z, 0, 0.48, -z,
    ], 3))
    g.computeVertexNormals()
    return g
  }, [width, depth])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.8} /></mesh>
}

function Warehouse({ position, texture, destination = false }: { position: Position; texture: CanvasTexture; destination?: boolean }) {
  const width = destination ? 4.3 : 4.8
  const ribs = useMemo<Position[]>(() => Array.from({ length: 17 }, (_, i) => [-width / 2 + 0.12 + i * (width - 0.24) / 16, 1.35, 1.515]), [width])
  const roofSeams = useMemo<Position[]>(() => Array.from({ length: 10 }, (_, i) => [0, 2.68, -1.53 + i * 0.34]), [])
  return <group position={position}>
    <Block position={[0, 0.08, 0.55]} size={[width + 1.0, 0.14, 4.65]} color="#d3d8e1" />
    <Block position={[0, 1.23, 0]} size={[width, 2.3, 3]} color="#e0e5ed" />
    <Blocks positions={ribs} size={[0.045, 2.12, 0.035]} color="#f5f7fc" />
    <Block position={[0, 0.35, 0]} size={[width + 0.04, 0.55, 3.04]} color="#aab5c6" />
    <group position={[0, 2.4, 0]}><Roof width={width + 0.35} depth={3.35} color={palette.roof} /></group>
    <Blocks positions={roofSeams} size={[width * 0.79, 0.025, 0.035]} color="#d6dce8" shadow={false} />
    <Block position={[0, 2.28, 1.55]} size={[width + 0.18, 0.19, 0.15]} color={destination ? palette.teal : palette.blue} />
    <Block position={[-width / 2 + 0.65, 1.74, 1.565]} size={[0.8, 0.5, 0.07]} color={palette.blue} />
    <Brand texture={texture} position={[-width / 2 + 0.65, 1.75, 1.61]} width={0.66} />
    {[-0.3, 1.2].map((x, index) => <group key={x} position={[x, 0, 0]}>
      <Block position={[0, 0.91, 1.56]} size={[1.1, 1.54, 0.12]} color={palette.ink} />
      <Block position={[0, 1.24, 1.63]} size={[0.99, 0.79, 0.04]} color="#c0c8d6" />
      <Blocks positions={Array.from({ length: 7 }, (_, i) => [0, 0.88 + i * 0.105, 1.655] as Position)} size={[1.0, 0.018, 0.025]} color="#7e8ba1" shadow={false} />
      <Block position={[0, 0.3, 1.78]} size={[1.28, 0.23, 0.52]} color="#637188" />
      <Blocks positions={[[-0.65, 0.4, 2.08], [0.65, 0.4, 2.08]]} size={[0.07, 0.6, 0.07]} color={palette.coral} />
      {index === 0 && <Pallet position={[0, 0.41, 1.78]} />}
    </group>)}
    <Blocks positions={[[-width / 2 + 0.05, 1.18, 1.6], [width / 2 - 0.05, 1.18, 1.6]]} size={[0.11, 2.3, 0.14]} color="#94a0b7" />
    <Block position={[0.6, 2.78, -0.25]} size={[0.7, 0.17, 0.8]} color="#b6c0d2" />
    <Block position={[-1, 2.7, -0.1]} size={[0.65, 0.05, 1.75]} color="#5879bc" rotation={[0, 0, 0.18]} />
  </group>
}

function Pallet({ position, color = '#c1aa81', stacked = false }: { position: Position; color?: string; stacked?: boolean }) {
  return <group position={position}>
    <Blocks positions={[[-0.3, 0.035, 0], [0, 0.035, 0], [0.3, 0.035, 0]]} size={[0.1, 0.07, 0.68]} color="#8f9b7a" />
    <Block position={[0, 0.11, 0]} size={[0.82, 0.1, 0.73]} color="#bcbd99" />
    <Block position={[0, 0.39, 0]} size={[0.69, 0.46, 0.6]} color={color} />
    <Block position={[0, 0.397, 0.306]} size={[0.08, 0.46, 0.01]} color="#eee6cb" shadow={false} />
    <Block position={[0, 0.625, 0]} size={[0.08, 0.015, 0.6]} color="#eee6cb" shadow={false} />
    <Block position={[0.18, 0.39, 0.313]} size={[0.17, 0.12, 0.01]} color="#f2f2e6" shadow={false} />
    {stacked && <group position={[0, 0.47, 0]}>
      <Block position={[0, 0.39, 0]} size={[0.65, 0.43, 0.58]} color={color} />
      <Block position={[0, 0.397, 0.296]} size={[0.08, 0.43, 0.01]} color="#eee6cb" shadow={false} />
    </group>}
  </group>
}

function Wheels({ x, z = 0.59, radius = 0.27 }: { x: number; z?: number; radius?: number }) {
  return <group>
    {[-z, z].map((side) => <group key={side} position={[x, radius + 0.08, side]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow><cylinderGeometry args={[radius, radius, 0.18, 16]} /><meshStandardMaterial color="#252a35" roughness={0.94} /></mesh>
      <mesh position={[0, side > 0 ? -0.101 : 0.101, 0]}><cylinderGeometry args={[radius * 0.54, radius * 0.54, 0.028, 12]} /><meshStandardMaterial color="#d1d7e2" metalness={0.45} roughness={0.4} /></mesh>
      <mesh position={[0, side > 0 ? -0.118 : 0.118, 0]}><cylinderGeometry args={[radius * 0.18, radius * 0.18, 0.029, 10]} /><meshStandardMaterial color="#7d8ca4" metalness={0.5} roughness={0.4} /></mesh>
    </group>)}
  </group>
}

function Truck({ texture, wheelRef }: { texture: CanvasTexture; wheelRef: RefObject<Group> }) {
  return <group scale={0.82}>
    <Block position={[-0.05, 0.47, 0]} size={[4.08, 0.22, 1.06]} color={palette.ink} />
    <group position={[-0.68, 0.61, 0]}><Container position={[0, 0, 0]} color={palette.brightBlue} length={2.84} texture={texture} /></group>
    <Block position={[1.22, 0.93, 0]} size={[1.13, 1.07, 1.22]} color="#ffffff" />
    <Block position={[1.14, 1.44, 0]} size={[1.01, 0.18, 1.26]} color="#f0f3f9" />
    <Block position={[1.42, 1.16, 0.624]} size={[0.54, 0.4, 0.025]} color="#314662" />
    <Block position={[1.42, 1.16, -0.624]} size={[0.54, 0.4, 0.025]} color="#314662" />
    <Block position={[1.796, 1.2, 0]} size={[0.03, 0.38, 1.06]} color="#314662" />
    <Block position={[1.82, 0.63, 0]} size={[0.06, 0.18, 1.26]} color={palette.blue} />
    <Block position={[1.845, 0.85, 0]} size={[0.04, 0.22, 0.57]} color="#586c88" />
    <Blocks positions={[[1.848, 0.8, -0.44], [1.848, 0.8, 0.44]]} size={[0.05, 0.14, 0.18]} color="#fff5cf" />
    <Blocks positions={[[1.47, 1.12, -0.75], [1.47, 1.12, 0.75]]} size={[0.17, 0.23, 0.11]} color={palette.ink} />
    <Blocks positions={[[0.87, 0.71, -0.63], [0.87, 0.71, 0.63]]} size={[0.41, 0.18, 0.035]} color={palette.blue} />
    <group ref={wheelRef}><Wheels x={1.24} /><Wheels x={-1.55} /><Wheels x={-0.9} /></group>
    <Block position={[-2.13, 0.48, 0.42]} size={[0.05, 0.13, 0.17]} color={palette.coral} />
  </group>
}

function Forklift({ position }: { position: Position }) {
  return <group position={position} rotation={[0, -0.3, 0]} scale={0.7}>
    <Block position={[0, 0.42, 0]} size={[1.35, 0.58, 0.8]} color={palette.coral} />
    <Wheels x={-0.42} z={0.42} radius={0.22} /><Wheels x={0.42} z={0.42} radius={0.22} />
    <Block position={[-0.05, 0.83, 0]} size={[0.43, 0.16, 0.45]} color={palette.ink} />
    <Blocks positions={[[-0.45, 1.12, -0.36], [-0.45, 1.12, 0.36], [0.36, 1.12, -0.36], [0.36, 1.12, 0.36]]} size={[0.055, 1.05, 0.055]} color={palette.ink} />
    <Block position={[-0.05, 1.65, 0]} size={[1.06, 0.08, 0.92]} color={palette.ink} />
    <Blocks positions={[[0.82, 0.85, -0.28], [0.82, 0.85, 0.28]]} size={[0.07, 1.6, 0.08]} color={palette.ink} />
    <Blocks positions={[[1.07, 0.18, -0.28], [1.07, 0.18, 0.28]]} size={[0.65, 0.08, 0.12]} color={palette.ink} />
    <Pallet position={[1.2, 0.23, 0]} />
  </group>
}

function Inspection({ position, texture }: { position: Position; texture: CanvasTexture }) {
  return <group position={position}>
    <Block position={[0, 0.035, 0]} size={[4.5, 0.09, 4.3]} color="#e2e9f4" />
    <Container position={[-0.4, 0.08, -1.32]} color={palette.teal} texture={texture} />
    <Container position={[-0.4, 1.39, -1.32]} color={palette.blue} texture={texture} />
    <Container position={[-0.4, 0.08, 0.05]} color={palette.coral} texture={texture} />
    <Pallet position={[-1.5, 0.08, 1.52]} stacked />
    <Pallet position={[-0.5, 0.08, 1.52]} color="#a9bca7" />
    <Forklift position={[1.33, 0.04, 1.0]} />
    <Blocks positions={[[-2.08, 0.095, 1.4], [0.03, 0.095, 1.4]]} size={[0.045, 0.025, 1.16]} color="#f8faf0" shadow={false} />
  </group>
}

function Customs({ position, mobile, stage }: { position: Position; mobile: boolean; stage: number }) {
  return <group position={position} rotation={[0, mobile ? -Math.PI / 2 : 0, 0]}>
    <Blocks positions={[[0, 1.44, -1.67], [0, 1.44, 1.67]]} size={[0.22, 2.88, 0.22]} color="#8996ad" />
    <Block position={[0, 2.83, 0]} size={[1.3, 0.27, 3.72]} color={palette.teal} />
    <Block position={[-0.67, 2.76, 0]} size={[0.04, 0.18, 2.0]} color="#cce7f6" />
    <Block position={[0.13, 0.69, -2.34]} size={[1.5, 1.39, 1.1]} color="#f1f4f9" />
    <Block position={[0.13, 1.4, -2.34]} size={[1.72, 0.15, 1.32]} color={palette.teal} />
    <Block position={[0.13, 0.96, -1.776]} size={[1.2, 0.49, 0.035]} color="#6684b5" />
    <Block position={[-0.64, 0.96, -2.34]} size={[0.03, 0.49, 0.84]} color="#6684b5" />
    <Block position={[0.75, 0.5, -1.56]} size={[0.28, 0.94, 0.28]} color={palette.coral} />
    <group position={[0.75, 0.96, -1.56]} rotation={[stage >= 2 ? -1.18 : -0.12, 0, 0]}>
      <Block position={[0, 0, 1.38]} size={[0.11, 0.1, 2.76]} color="#ffffff" />
      <Blocks positions={Array.from({ length: 7 }, (_, i) => [0, 0.002, 0.21 + i * 0.38] as Position)} size={[0.12, 0.11, 0.16]} color={palette.coral} />
    </group>
    <Block position={[-0.13, 2.13, 1.68]} size={[0.27, 0.48, 0.19]} color={palette.ink} />
    <mesh position={[-0.28, 2.08, 1.68]} rotation={[0, -Math.PI / 2, 0]}>
      <circleGeometry args={[0.072, 16]} /><meshBasicMaterial color={stage >= 2 ? '#b7dbaf' : '#edbd84'} />
    </mesh>
  </group>
}

function Tree({ position, scale = 1 }: { position: Position; scale?: number }) {
  return <group position={position} scale={scale}>
    <Block position={[0, 0.04, 0]} size={[1.18, 0.1, 1.18]} color="#b7cdb9" />
    <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.065, 0.09, 1.3, 6]} /><meshStandardMaterial color="#6d8973" /></mesh>
    <mesh position={[0, 1.46, 0]} castShadow><icosahedronGeometry args={[0.67, 1]} /><meshStandardMaterial color="#81a38a" flatShading roughness={0.95} /></mesh>
    <mesh position={[0.14, 1.93, 0]} castShadow><icosahedronGeometry args={[0.47, 1]} /><meshStandardMaterial color="#9bb596" flatShading roughness={0.95} /></mesh>
  </group>
}

function Lamp({ position }: { position: Position }) {
  return <group position={position}>
    <Block position={[0, 0.09, 0]} size={[0.29, 0.16, 0.29]} color="#bcc7d8" />
    <Block position={[0, 1.4, 0]} size={[0.065, 2.8, 0.065]} color="#8493ac" />
    <Block position={[0, 2.79, 0.33]} size={[0.09, 0.06, 0.72]} color="#8493ac" />
    <Block position={[0, 2.74, 0.68]} size={[0.22, 0.07, 0.34]} color="#f9f9eb" />
  </group>
}

function Road({ from, to, width = 3 }: { from: [number, number]; to: [number, number]; width?: number }) {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1])
  const angle = -Math.atan2(to[1] - from[1], to[0] - from[0])
  const dashes = useMemo<Position[]>(() => Array.from({ length: Math.floor(length / 1.18) }, (_, i) => [-length / 2 + 0.65 + i * 1.18, 0.071, 0]), [length])
  return <group position={[(from[0] + to[0]) / 2, 0, (from[1] + to[1]) / 2]} rotation={[0, angle, 0]}>
    <Block position={[0, 0.025, 0]} size={[length, 0.07, width]} color={palette.road} shadow={false} />
    <Blocks positions={[[0, 0.075, -width / 2 + 0.09], [0, 0.075, width / 2 - 0.09]]} size={[length, 0.016, 0.044]} color="#f0f3f7" shadow={false} />
    <Blocks positions={dashes} size={[0.52, 0.017, 0.045]} color="#e8edf6" shadow={false} />
  </group>
}

function Landscape({ mobile, texture, stage }: { mobile: boolean; texture: CanvasTexture; stage: number }) {
  const receiving: Position = mobile ? [-4.65, 0, -3.2] : [-8.75, 0, -1.4]
  const inspection: Position = mobile ? [2.2, 0, -3.2] : [-2.35, 0, -1.7]
  const delivery: Position = mobile ? [-6.4, 0, 4] : [8.8, 0, -1.4]
  const gate: Position = mobile ? [5.35, 0, 3.6] : [3.65, 0, 3.6]
  const trees: Position[] = mobile
    ? [[-7.9, 0, -4.2], [0, 0, 3.7], [0.6, 0, 5.2], [6.4, 0, -3.8]]
    : [[-12, 0, -1.9], [-12, 0, 0.0], [-5.6, 0, -3.5], [5.2, 0, -2.2], [6.4, 0, -3.4], [12.1, 0, -0.2], [12.1, 0, 1.3]]
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.055, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><shadowMaterial color="#373f50" transparent opacity={0.12} />
    </mesh>
    <Block position={[mobile ? -0.4 : 0, -0.025, mobile ? 1 : 0]} size={[mobile ? 17.6 : 27, 0.06, mobile ? 17 : 12.4]} color="#e7e9ee" shadow={false} />
    {mobile ? <>
      <Road from={[-7.7, 0.6]} to={[6.85, 0.6]} />
      <Road from={[5.35, -0.85]} to={[5.35, 8.7]} />
      <Road from={[-8.7, 7.2]} to={[6.85, 7.2]} />
    </> : <>
      <Road from={[-12.3, 3.6]} to={[12.4, 3.6]} width={3.1} />
      <Road from={[-12.3, -4.8]} to={[12.4, -4.8]} width={1.6} />
      <Road from={[-12.2, -5.6]} to={[-12.2, 5.1]} width={1.6} />
    </>}
    <Warehouse position={receiving} texture={texture} />
    <Inspection position={inspection} texture={texture} />
    <Warehouse position={delivery} texture={texture} destination />
    <Customs position={gate} mobile={mobile} stage={stage} />
    {!mobile && <>
      <Container position={[-7.7, 0.07, -4.2]} color={palette.coral} length={3.1} texture={texture} />
      <Pallet position={[6.1, 0.1, 1.1]} stacked color="#b4bea1" />
      <Pallet position={[6.1, 0.1, 0.2]} />
      <Block position={[1.15, 0.04, -1.2]} size={[1.25, 0.13, 3.35]} color="#d7e1ee" />
      <Blocks positions={Array.from({ length: 13 }, (_, i) => [-5.15 + i * 1.2, 0.51, -3.3] as Position)} size={[0.045, 1.0, 0.045]} color="#95a1b8" />
      <Blocks positions={[[2.05, 0.8, -3.3], [2.05, 0.29, -3.3]]} size={[14.4, 0.035, 0.035]} color="#b1bdcd" />
      <Blocks positions={Array.from({ length: 7 }, (_, i) => [3.05, 0.082, 2.37 + i * 0.41] as Position)} size={[0.64, 0.018, 0.15]} color="#f5f7e2" shadow={false} />
    </>}
    {trees.map((position, index) => <Tree key={index} position={position} scale={index % 2 === 0 ? 0.93 : 0.75} />)}
    <Lamp position={mobile ? [-1.5, 0, -0.7] : [-5.45, 0, 1.75]} />
    <Lamp position={mobile ? [-1.5, 0, 6] : [5.45, 0, 1.75]} />
    <Blocks positions={(mobile ? [-6.5, -2.5, 1] : [-10.8, -6.7, -3.5, 0, 6.7, 10.7]).map((x) => [x, 0.15, mobile ? 8.77 : 5.26] as Position)} size={[0.58, 0.23, 0.25]} color="#c9d1de" />
  </group>
}

function JourneyWorld({ stage, active, reducedMotion, paused, onReady, onError }: SceneProps) {
  const { camera, size, invalidate, gl } = useThree()
  const mobile = size.width < 640
  const texture = useBrandTexture()
  const truck = useRef<Group>(null)
  const wheels = useRef<Group>(null)
  const marker = useRef<Mesh>(null)
  const current = useRef(0)
  const hasRendered = useRef(false)
  const lastStage = useRef(stage)
  const lastMobile = useRef(mobile)
  const cameraAim = useRef(new Vector3(0, 0, 0))
  const position = useMemo(() => new Vector3(), [])
  const tangent = useMemo(() => new Vector3(), [])
  const curve = useMemo(() => new CatmullRomCurve3((mobile
    ? [[-4.65, 0.105, 0.94], [-0.7, 0.105, 0.94], [3.8, 0.105, 0.94], [5.35, 0.105, 1.6], [5.35, 0.105, 5.6], [3.8, 0.105, 7.42], [-6.2, 0.105, 7.42]]
    : [[-9.2, 0.105, 3.95], [-2.35, 0.105, 3.95], [3.65, 0.105, 3.95], [9, 0.105, 3.95]]
  ).map(([x, y, z]) => new Vector3(x, y, z)), false, 'centripetal'), [mobile])
  const stopProgress = mobile ? [0, 0.254, 0.455, 1] : [0, 0.376, 0.706, 1]
  const target = stopProgress[stage] ?? 0
  const route = useMemo(() => new TubeGeometry(curve, 180, 0.055, 6, false), [curve])
  const routeBase = useMemo(() => new TubeGeometry(curve, 180, 0.037, 5, false), [curve])
  const framePosition = useMemo(() => new Vector3(), [])
  const frameAim = useMemo(() => new Vector3(), [])

  useEffect(() => () => { route.dispose(); routeBase.dispose() }, [route, routeBase])

  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); onError() }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl, onError])

  useLayoutEffect(() => {
    const ortho = camera as OrthographicCamera
    // Fit the whole yard at both aspect ratios, leaving room for camera parallax.
    ortho.zoom = mobile ? Math.min(size.width / 25, size.height / 21) : Math.min(size.width / 32, size.height / 17.4)
    ortho.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, mobile, invalidate])

  useEffect(() => { if (active) invalidate() }, [stage, active, reducedMotion, paused, mobile, invalidate])

  useFrame((_, delta) => {
    if (!active || !truck.current) return
    const dt = Math.min(delta, 0.045)
    const previous = current.current
    const canAnimate = !paused && !reducedMotion
    // Pausing freezes the current frame; explicit stage or layout changes still render immediately.
    const snapToStage = reducedMotion || !hasRendered.current || (paused && (lastStage.current !== stage || lastMobile.current !== mobile))
    if (snapToStage) current.current = target
    else if (canAnimate) current.current = MathUtils.damp(current.current, target, 3.6, dt)
    if (canAnimate && Math.abs(current.current - target) < 0.0002) current.current = target
    curve.getPointAt(current.current, position)
    curve.getTangentAt(current.current, tangent)
    truck.current.position.copy(position)
    truck.current.rotation.y = Math.atan2(-tangent.z, tangent.x)
    if (wheels.current) {
      wheels.current.children.forEach((axle) => axle.children.forEach((wheel) => {
        wheel.rotation.y -= (current.current - previous) * curve.getLength() / 0.27
      }))
    }
    const indices = route.index?.count ?? 0
    route.setDrawRange(0, Math.max(0, Math.floor(indices * current.current / 36) * 36))
    curve.getPointAt(target, framePosition)
    if (marker.current) marker.current.position.set(framePosition.x, 0.083, framePosition.z)
    frameAim.set(mobile ? 0 : (stage - 1.5) * 0.21, 0.5, mobile ? 1.5 : 0.15)
    if (snapToStage) cameraAim.current.copy(frameAim)
    else if (canAnimate) cameraAim.current.lerp(frameAim, 1 - Math.exp(-4 * dt))
    framePosition.set(mobile ? 20 : 14, mobile ? 25 : 22, mobile ? 29 : 27)
    framePosition.x += cameraAim.current.x
    camera.position.copy(framePosition)
    camera.lookAt(cameraAim.current)
    lastStage.current = stage
    lastMobile.current = mobile
    if (!hasRendered.current) {
      hasRendered.current = true
      onReady()
    }
    if (canAnimate && (Math.abs(current.current - target) > 0.0001 || cameraAim.current.distanceToSquared(frameAim) > 0.000001)) invalidate()
  })

  return <>
    <color attach="background" args={['#f3f6f7']} />
    <ambientLight intensity={0.52} />
    <hemisphereLight args={['#ffffff', '#8993a8', 1.5]} />
    <directionalLight position={[-10, 20, 10]} intensity={2.7} color="#ffffff" castShadow shadow-mapSize={[mobile ? 1024 : 2048, mobile ? 1024 : 2048]} shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-camera-near={0.1} shadow-camera-far={65} shadow-normalBias={0.035} shadow-bias={-0.00015} shadow-radius={3} />
    <directionalLight position={[8, 8, -12]} intensity={0.8} color="#e4f2fa" />
    <Landscape mobile={mobile} texture={texture} stage={stage} />
    <mesh geometry={routeBase}><meshStandardMaterial color="#ccd2de" roughness={0.9} /></mesh>
    <mesh geometry={route}><meshStandardMaterial color={palette.blue} roughness={0.7} /></mesh>
    <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.85, 0.93, 48]} /><meshBasicMaterial color="#0083ca" transparent opacity={0.8} depthWrite={false} />
    </mesh>
    <group ref={truck}><Truck texture={texture} wheelRef={wheels} /></group>
  </>
}

export default function JourneyScene(props: SceneProps) {
  const [supported, setSupported] = useState(false)
  const { onError } = props
  useEffect(() => {
    const probe = document.createElement('canvas')
    try {
      const context = probe.getContext('webgl2')
      if (!context) { onError(); return }
      context.getExtension('WEBGL_lose_context')?.loseContext()
      setSupported(true)
    } catch {
      onError()
    }
  }, [onError])

  if (!supported) return null
  return <div className="journey-renderer" aria-hidden="true">
    <Canvas
      orthographic
      camera={{ position: [14, 22, 27], zoom: 25, near: 0.1, far: 250 }}
      shadows
      dpr={[1, 1.5]}
      frameloop={props.active ? 'demand' : 'never'}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'low-power', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ touchAction: 'pan-y' }}
    >
      <JourneyWorld {...props} />
    </Canvas>
  </div>
}
