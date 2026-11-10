"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import type { InventoryModel } from "@/types/clinical";
import * as THREE from "three";

function Cylinder({ position, radiusTop, radiusBottom, height, color, rotation }: {
  position: [number, number, number]; radiusTop: number; radiusBottom: number; height: number; color: string; rotation?: [number, number, number];
}) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow><cylinderGeometry args={[radiusTop, radiusBottom, height, 32]} /><meshStandardMaterial color={color} metalness={0.22} roughness={0.36} /></mesh>;
}

function Box({ position, scale, color, rotation }: {
  position: [number, number, number]; scale: [number, number, number]; color: string; rotation?: [number, number, number];
}) {
  return <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={color} metalness={0.12} roughness={0.38} /></mesh>;
}

function Joint({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  return <mesh position={position} scale={scale} castShadow><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color={color} metalness={0.28} roughness={0.3} /></mesh>;
}

function SceneObject({ model }: { model: InventoryModel }) {
  // Cada referencia utiliza una composición determinista de primitivas.
  // Ninguna geometría proviene de imágenes o estudios clínicos cargados.
  if (model === "bone") return <group rotation={[0.15, 0, -0.08]}>
    <Joint position={[0, 0.82, 0]} scale={[0.4, 0.33, 0.34]} color="#d7cdbb" />
    <Cylinder position={[0, 0, 0]} radiusTop={0.15} radiusBottom={0.16} height={1.5} color="#d7cdbb" />
    <Joint position={[0, -0.84, 0]} scale={[0.34, 0.3, 0.34]} color="#d7cdbb" />
    <Joint position={[0.1, 0.16, 0.13]} scale={[0.22, 0.19, 0.22]} color="#ff6478" />
    <Joint position={[0.1, 0.16, 0.13]} scale={[0.1, 0.095, 0.1]} color="#ffabb5" />
  </group>;
  if (model === "fracture") return <group rotation={[0.08, 0, -0.12]}>
    <Joint position={[0, 0.85, 0]} scale={[0.38, 0.3, 0.32]} color="#e3dfd3" />
    <Cylinder position={[0, 0.46, 0]} radiusTop={0.145} radiusBottom={0.15} height={0.48} color="#e3dfd3" />
    <Cylinder position={[0, -0.42, 0]} radiusTop={0.15} radiusBottom={0.14} height={0.92} color="#e3dfd3" />
    <Joint position={[0, -0.9, 0]} scale={[0.34, 0.28, 0.3]} color="#e3dfd3" />
    <Box position={[0.015, 0.02, 0.14]} scale={[0.42, 0.07, 0.025]} rotation={[0, 0, -0.58]} color="#df756f" />
    <Box position={[-0.015, -0.1, 0.14]} scale={[0.38, 0.055, 0.025]} rotation={[0, 0, -0.58]} color="#df756f" />
  </group>;
  if (model === "lung" || model === "pneumonia") return <group>
    <Cylinder position={[0, 0.68, 0]} radiusTop={0.11} radiusBottom={0.11} height={0.82} color="#6e9fb1" />
    <Cylinder position={[-0.22, 0.28, 0]} radiusTop={0.07} radiusBottom={0.055} height={0.62} rotation={[0, 0, -0.72]} color="#6e9fb1" />
    <Cylinder position={[0.22, 0.28, 0]} radiusTop={0.07} radiusBottom={0.055} height={0.62} rotation={[0, 0, 0.72]} color="#6e9fb1" />
    <Joint position={[-0.48, -0.15, 0]} scale={[0.47, 0.8, 0.32]} color="#90c9cf" />
    <Joint position={[0.48, -0.15, 0]} scale={[0.47, 0.8, 0.32]} color="#90c9cf" />
    <Cylinder position={[0, 0.1, 0.06]} radiusTop={0.035} radiusBottom={0.035} height={0.72} rotation={[0, 0, Math.PI / 2]} color="#e29a9b" />
    {model === "pneumonia" && <><Joint position={[-0.38, -0.12, 0.29]} scale={[0.23, 0.28, 0.09]} color="#e99a74" /><Joint position={[0.49, -0.31, 0.26]} scale={[0.2, 0.25, 0.09]} color="#e99a74" /><Joint position={[-0.1, -0.17, 0.25]} scale={[0.11, 0.12, 0.08]} color="#f4c37d" /></>}
  </group>;
  if (model === "osteoporosis") return <group rotation={[0.08, 0, -0.08]}>
    <Joint position={[0, 0.82, 0]} scale={[0.4, 0.33, 0.34]} color="#e1ddd0" />
    <Cylinder position={[0, 0, 0]} radiusTop={0.15} radiusBottom={0.16} height={1.5} color="#e1ddd0" />
    <Joint position={[0, -0.84, 0]} scale={[0.35, 0.3, 0.34]} color="#e1ddd0" />
    {[[-0.08, 0.48, 0.13], [0.09, 0.31, 0.14], [-0.1, 0.08, 0.14], [0.07, -0.14, 0.14], [-0.08, -0.38, 0.14], [0.08, -0.57, 0.13]].map(([x, y, z], index) => <Joint key={index} position={[x, y, z] as [number, number, number]} scale={[0.045, 0.045, 0.025]} color="#b79b81" />)}
  </group>;
  if (model === "cell") return <group>
    <Joint position={[0, 0, 0]} scale={[0.93, 0.82, 0.68]} color="#a8d4cf" />
    <Joint position={[-0.12, 0.1, 0.52]} scale={[0.38, 0.34, 0.16]} color="#7ba7c3" />
    <Joint position={[-0.12, 0.1, 0.65]} scale={[0.22, 0.18, 0.08]} color="#668cb0" />
    <Joint position={[0.44, -0.3, 0.43]} scale={[0.2, 0.11, 0.1]} color="#d99b72" />
    <Joint position={[-0.48, -0.35, 0.37]} scale={[0.18, 0.1, 0.09]} color="#d99b72" />
    <Joint position={[0.4, 0.38, 0.32]} scale={[0.09, 0.09, 0.07]} color="#e7bd75" />
    <Joint position={[-0.55, 0.32, 0.28]} scale={[0.07, 0.07, 0.06]} color="#e7bd75" />
  </group>;
  if (model === "syringe") return <group>
    <Cylinder position={[0, 0, 0]} radiusTop={0.17} radiusBottom={0.2} height={1.65} color="#8bcbd6" />
    <Cylinder position={[0, 0.95, 0]} radiusTop={0.055} radiusBottom={0.055} height={0.22} color="#a6bbca" />
    <Cylinder position={[0, 1.22, 0]} radiusTop={0.035} radiusBottom={0.035} height={0.36} color="#1c3850" />
    <Box position={[0, 1.43, 0]} scale={[0.38, 0.07, 0.13]} color="#a6bbca" />
    <Cylinder position={[0, -0.92, 0]} radiusTop={0.027} radiusBottom={0.027} height={0.22} color="#269fb8" />
    {[-0.62, -0.44, -0.26, -0.08, 0.1, 0.28].map((y) => <Box key={y} position={[-0.19, y, 0.08]} scale={[0.11, 0.018, 0.018]} color="#1c3850" />)}
  </group>;
  if (model === "defibrillator") return <group rotation={[0.08, 0.1, 0]}>
    <Box position={[0, 0, 0]} scale={[1.25, 1.08, 0.45]} color="#1c3850" />
    <Box position={[-0.08, 0.22, 0.24]} scale={[0.68, 0.46, 0.035]} color="#53d7e8" />
    <Box position={[-0.08, 0.22, 0.265]} scale={[0.38, 0.08, 0.02]} color="#53c9a5" />
    {[-0.23, -0.1, 0.03, 0.16].map((y) => <Joint key={y} position={[0.36, y, 0.26]} scale={[0.07, 0.07, 0.04]} color="#a6bbca" />)}
    <Cylinder position={[-0.45, -0.35, 0]} radiusTop={0.09} radiusBottom={0.09} height={0.16} color="#269fb8" />
    <Cylinder position={[0.5, -0.1, -0.4]} radiusTop={0.045} radiusBottom={0.045} height={0.6} color="#718b9b" />
    <Joint position={[0.5, -0.44, -0.4]} scale={[0.18, 0.08, 0.12]} color="#d1dfe4" />
  </group>;
  if (model === "prosthesis") return <group rotation={[0, 0, -0.08]}>
    <Joint position={[0, 0.72, 0]} scale={[0.33, 0.3, 0.33]} color="#a6bbca" />
    <Cylinder position={[0, 0.18, 0]} radiusTop={0.12} radiusBottom={0.22} height={0.83} color="#d3e1e5" />
    <Cylinder position={[0, -0.47, 0]} radiusTop={0.08} radiusBottom={0.12} height={0.52} color="#90a6b2" />
    <Joint position={[0, -0.79, 0]} scale={[0.28, 0.12, 0.28]} color="#d8e4e8" />
    <Cylinder position={[0.17, 0.63, 0]} radiusTop={0.07} radiusBottom={0.07} height={0.19} color="#269fb8" />
  </group>;
  if (model === "capsule") return <group rotation={[0.15, 0.15, 0.18]}><Cylinder position={[0, 0, 0]} radiusTop={0.27} radiusBottom={0.27} height={1.02} color="#f2f6f7" /><Joint position={[0, 0.5, 0]} scale={[0.27, 0.25, 0.27]} color="#86d9d2" /><Cylinder position={[0, 0.25, 0]} radiusTop={0.27} radiusBottom={0.27} height={0.48} color="#86d9d2" /></group>;
  if (model === "vial") return <group><Cylinder position={[0, -0.03, 0]} radiusTop={0.25} radiusBottom={0.3} height={0.86} color="#7dc6d0" /><Cylinder position={[0, 0.47, 0]} radiusTop={0.14} radiusBottom={0.14} height={0.18} color="#a6bbca" /><Cylinder position={[0, 0.6, 0]} radiusTop={0.17} radiusBottom={0.17} height={0.1} color="#d5e4e8" /></group>;
  if (model === "bag") return <group><Box position={[0, 0, 0]} scale={[0.8, 1.18, 0.32]} color="#77b5c1" /><Cylinder position={[0, 0.67, 0]} radiusTop={0.1} radiusBottom={0.1} height={0.18} color="#a6bbca" /><Box position={[0.08, -0.3, 0.18]} scale={[0.35, 0.24, 0.04]} color="#53d7e8" /><Cylinder position={[0, -0.69, 0]} radiusTop={0.055} radiusBottom={0.055} height={0.24} color="#269fb8" /></group>;
  if (model === "glove") return <group><Joint position={[0, -0.2, 0]} scale={[0.3, 0.46, 0.16]} color="#77c6cc" />{[-0.19, -0.06, 0.07, 0.2].map((x) => <Cylinder key={x} position={[x, 0.38, 0]} radiusTop={0.055} radiusBottom={0.055} height={0.68} color="#77c6cc" />)}<Cylinder position={[0.33, 0.08, 0.03]} radiusTop={0.07} radiusBottom={0.07} height={0.36} color="#77c6cc" /></group>;
  return <group>{[-0.26, 0.26].map((x) => <group key={x}><Cylinder position={[x, -0.05, 0]} radiusTop={0.04} radiusBottom={0.055} height={1.85} color="#a6bbca" /><Box position={[x, 0.7, 0]} scale={[0.48, 0.12, 0.16]} color="#269fb8" /><Box position={[x, 0.34, 0]} scale={[0.13, 0.1, 0.13]} color="#1c3850" /><Joint position={[x, -1.01, 0]} scale={[0.11, 0.07, 0.11]} color="#324c5c" /></group>)}</group>;
}

export default function MedicalScene({ model }: { model: InventoryModel }) {
  return <Canvas camera={{ position: [0, 0, 4.1], fov: 42 }} dpr={[1, 1.7]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} onCreated={({ gl }) => { gl.setClearColor(new THREE.Color("#091621"), 0); }}>
    <Suspense fallback={null}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.5} color="#d8fbff" />
      <pointLight position={[-3, -1, 2]} intensity={1.4} color="#35cfe4" />
      {/* OrbitControls entrega rotación/zoom por mouse o touch. El modelo bone
          es sintético y su punto rojo es una anotación didáctica, no un hallazgo. */}
      <SceneObject model={model} />
      <ContactShadows position={[0, -1.4, 0]} opacity={0.3} scale={4} blur={2} far={3} />
      <OrbitControls makeDefault enablePan={false} minDistance={2.6} maxDistance={7} />
    </Suspense>
  </Canvas>;
}
