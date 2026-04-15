'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingDress({ color, offset = 0 }: { color: string; offset?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + offset;
    ref.current.rotation.y = Math.sin(t * 0.7) * 0.35;
    ref.current.position.y = Math.sin(t * 1.2) * 0.12;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.9, 28]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.25, 0]} castShadow>
        <coneGeometry args={[1.15, 2.05, 44, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.38, 0]}>
        <torusGeometry args={[0.24, 0.05, 14, 40]} />
        <meshStandardMaterial color="#2D221C" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Sparkles() {
  const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 70;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 2.8 + Math.random() * 2.4;
      const angle = Math.random() * Math.PI * 2;
      const y = -2.4 + Math.random() * 5.6;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = -1.6 + Math.random() * 2.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = clock.getElapsedTime() * 0.06;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#F4D5C7" size={0.06} transparent opacity={0.8} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0.2, 7], fov: 42 }} style={{ background: 'transparent' }} shadows>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 7, 5]} intensity={1.45} color="#FFEFE4" castShadow />
      <pointLight position={[-5, 2, 2]} intensity={0.8} color="#E7B1A8" />
      <pointLight position={[5, -2, 2]} intensity={0.7} color="#D28FA0" />

      <Suspense fallback={null}>
        <Float speed={1} floatIntensity={0.3} rotationIntensity={0.18}>
          <group position={[-1.65, -0.1, 0]}>
            <FloatingDress color="#D28FA0" offset={0} />
          </group>
        </Float>
        <Float speed={0.8} floatIntensity={0.25} rotationIntensity={0.2}>
          <group position={[1.65, 0.05, -0.2]}>
            <FloatingDress color="#D7A46E" offset={1.4} />
          </group>
        </Float>
        <Sparkles />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
