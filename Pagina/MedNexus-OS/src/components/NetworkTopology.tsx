"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial } from "three";

export type NetworkNodeId = "ehr" | "monitoring" | "pharmacy" | "network" | "backup" | "icu" | "telemedicine" | "payments" | "perimeter" | "database";

type NodeDefinition = {
  id: NetworkNodeId;
  position: [number, number, number];
  color: string;
  state: "secure" | "review";
};

const nodes: NodeDefinition[] = [
  { id: "ehr", position: [0, 0.05, 0], color: "#0284c7", state: "secure" },
  { id: "monitoring", position: [1.28, 0.62, 0.1], color: "#f59e0b", state: "review" },
  { id: "pharmacy", position: [-1.34, 0.72, 0.1], color: "#10b981", state: "secure" },
  { id: "network", position: [0, -1.04, 0.1], color: "#10b981", state: "secure" },
  { id: "backup", position: [-0.05, 1.36, -0.42], color: "#10b981", state: "secure" },
  { id: "icu", position: [2.15, 0.12, -0.16], color: "#10b981", state: "secure" },
  { id: "telemedicine", position: [1.6, -1.06, 0.04], color: "#0284c7", state: "secure" },
  { id: "payments", position: [-2.02, 0.02, -0.08], color: "#0284c7", state: "secure" },
  { id: "perimeter", position: [-1.3, -1.08, -0.18], color: "#f59e0b", state: "review" },
  { id: "database", position: [0, 1.05, 0.24], color: "#10b981", state: "secure" },
];

const connections: Array<[NetworkNodeId, NetworkNodeId]> = [
  ["ehr", "database"], ["database", "backup"], ["ehr", "network"],
  ["network", "monitoring"], ["network", "pharmacy"], ["network", "icu"],
  ["network", "telemedicine"], ["network", "perimeter"], ["perimeter", "payments"],
  ["telemedicine", "monitoring"], ["perimeter", "ehr"],
];

function NetworkNode({ node, selected, onSelect, reducedMotion }: {
  node: NodeDefinition;
  selected: boolean;
  onSelect: (id: NetworkNodeId) => void;
  reducedMotion: boolean;
}) {
  const pulseRef = useRef<Mesh>(null);
  const pulseMaterialRef = useRef<MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (!pulseRef.current || !pulseMaterialRef.current) return;
    if (reducedMotion) {
      pulseRef.current.scale.setScalar(selected ? 1.34 : 1.22);
      pulseMaterialRef.current.opacity = selected ? 0.11 : 0.035;
      return;
    }
    const wave = (Math.sin(clock.elapsedTime * 1.7 + node.position[0] * 2) + 1) / 2;
    const scale = (selected ? 1.34 : 1.22) + wave * 0.18;
    pulseRef.current.scale.setScalar(scale);
    pulseMaterialRef.current.opacity = selected ? 0.11 + wave * 0.11 : 0.035 + wave * 0.055;
  });
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(node.id);
  };

  return <group position={node.position} onClick={handleClick}>
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.28, 24, 24]} />
      <meshBasicMaterial ref={pulseMaterialRef} color={node.color} transparent opacity={0.07} depthWrite={false} />
    </mesh>
    <mesh>
      <sphereGeometry args={[selected ? 0.24 : 0.19, 28, 28]} />
      <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={selected ? 0.35 : 0.14} roughness={0.3} metalness={0.08} />
    </mesh>
    <mesh position={[0, -0.32, 0]}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial color={node.state === "review" ? "#f59e0b" : "#10b981"} />
    </mesh>
  </group>;
}

function DataPacket({ from, to, phase, reducedMotion }: { from: NodeDefinition; to: NodeDefinition; phase: number; reducedMotion: boolean }) {
  const packetRef = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const progress = reducedMotion ? phase : (clock.elapsedTime * 0.12 + phase) % 1;
    if (!packetRef.current) return;
    packetRef.current.position.set(
      from.position[0] + (to.position[0] - from.position[0]) * progress,
      from.position[1] + (to.position[1] - from.position[1]) * progress,
      from.position[2] + (to.position[2] - from.position[2]) * progress,
    );
  });
  const caution = from.state === "review" || to.state === "review";
  return <mesh ref={packetRef}>
    <sphereGeometry args={[0.032, 10, 10]} />
    <meshBasicMaterial color={caution ? "#f0b45b" : "#7ce0d4"} toneMapped={false} />
  </mesh>;
}

export default function NetworkTopology({ selectedNode, onSelect }: {
  selectedNode: NetworkNodeId;
  onSelect: (id: NetworkNodeId) => void;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return <Canvas camera={{ position: [0, 0.15, 6.3], fov: 44 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
    <Suspense fallback={null}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={1.2} color="#7dd3fc" />
      {connections.map(([from, to]) => {
        const fromNode = nodes.find((node) => node.id === from);
        const toNode = nodes.find((node) => node.id === to);
        if (!fromNode || !toNode) return null;
        const review = fromNode.state === "review" || toNode.state === "review";
        return <group key={`${from}-${to}`}>
          <Line points={[fromNode.position, toNode.position]} color={review ? "#d8aa5b" : "#5ab9b7"} lineWidth={1.1} transparent opacity={0.34} />
          <DataPacket from={fromNode} to={toNode} phase={0} reducedMotion={reducedMotion} />
          <DataPacket from={fromNode} to={toNode} phase={0.52} reducedMotion={reducedMotion} />
        </group>;
      })}
      {nodes.map((node) => <NetworkNode key={node.id} node={node} selected={node.id === selectedNode} onSelect={onSelect} reducedMotion={reducedMotion} />)}
      <OrbitControls makeDefault enablePan={false} minDistance={4.2} maxDistance={9} enableDamping dampingFactor={0.08} autoRotate={!reducedMotion} autoRotateSpeed={0.18} />
    </Suspense>
  </Canvas>;
}
