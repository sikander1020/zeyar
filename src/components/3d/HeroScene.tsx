'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, MeshDistortMaterial, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

function ElegantDress() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main dress body - elongated cone shape */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <coneGeometry args={[1.6, 4.5, 64, 1, true]} />
          <MeshDistortMaterial
            color="#E6B7A9"
            roughness={0.15}
            metalness={0.3}
            distort={0.08}
            speed={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Bodice */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.75, 1.8, 32]} />
          <meshStandardMaterial
            color="#D4957F"
            roughness={0.1}
            metalness={0.5}
          />
        </mesh>

        {/* Neckline */}
        <mesh position={[0, 2.95, 0]}>
          <torusGeometry args={[0.45, 0.06, 16, 64]} />
          <meshStandardMaterial color="#B76E79" roughness={0.05} metalness={0.8} />
        </mesh>

        {/* Shoulder details */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 2.7, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#C88A75" roughness={0.1} metalness={0.6} />
          </mesh>
        ))}
      </Float>

      {/* Floating fabric particles */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 2.5 + Math.random() * 0.8;
        return (
          <Float key={i} speed={0.8 + Math.random()} floatIntensity={0.6} rotationIntensity={0.2}>
            <mesh
              position={[
                Math.cos(angle) * r,
                -1.5 + Math.random() * 3,
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.04 + Math.random() * 0.05, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#E6B7A9' : '#B76E79'}
                roughness={0}
                metalness={1}
                emissive={i % 2 === 0 ? '#E6B7A9' : '#B76E79'}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        );
      })}

      {/* Rotating rings */}
      <mesh ref={meshRef} position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.018, 8, 80]} />
        <meshStandardMaterial color="#B76E79" roughness={0} metalness={1} />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 3, 0.5, 0]}>
        <torusGeometry args={[3.2, 0.012, 8, 80]} />
        <meshStandardMaterial color="#E6B7A9" roughness={0} metalness={0.9} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Particles() {
  const count = 80;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

    const color = new THREE.Color(
      Math.random() > 0.5 ? '#E6B7A9' : '#B76E79'
    );
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.6} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ background: 'transparent' }}
      shadows
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        color="#F5EDE6"
        castShadow
      />
      <pointLight position={[-5, 5, -5]} color="#E6B7A9" intensity={1.5} />
      <pointLight position={[5, -3, 3]} color="#B76E79" intensity={1} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#FAF7F4"
        castShadow
      />

      <Suspense fallback={null}>
        <group scale={0.65} position={[0, -0.3, 0]}>
          <ElegantDress />
        </group>
        <group scale={0.8}>
          <Particles />
        </group>
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
