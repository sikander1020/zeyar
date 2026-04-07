'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function DressModel() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.2}>
      <group>
        {/* Dress skirt */}
        <mesh ref={meshRef} position={[0, -0.8, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.8, 4, 64, 1, true]} />
          <meshStandardMaterial
            color="#E6B7A9"
            roughness={0.1}
            metalness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Bodice */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.7, 1.6, 32]} />
          <meshStandardMaterial color="#D4957F" roughness={0.08} metalness={0.5} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 2.5, 0]}>
          <torusGeometry args={[0.38, 0.05, 12, 48]} />
          <meshStandardMaterial color="#B76E79" roughness={0} metalness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ProductViewer({ color = '#E6B7A9' }: { color?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      style={{ background: 'transparent' }}
      shadows
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#F5EDE6" castShadow />
      <pointLight position={[-4, 4, -4]} color="#E6B7A9" intensity={1.5} />
      <pointLight position={[4, -2, 4]} color="#B76E79" intensity={1} />

      <Suspense fallback={null}>
        <DressModel />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 0.7}
      />
    </Canvas>
  );
}
