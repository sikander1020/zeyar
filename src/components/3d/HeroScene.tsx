'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, MeshDistortMaterial, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

function WavingSilk() {
  const geoRef = useRef<THREE.PlaneGeometry>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (geoRef.current) {
      const position = geoRef.current.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const u = position.getX(i);
        const v = position.getY(i);
        // Create an organic flowing fabric effect with smooth waves
        const z = 
          Math.sin(u * 1.5 + time * 0.6) * 0.4 + 
          Math.cos(v * 1.2 + time * 0.4) * 0.4 +
          Math.sin((u + v) * 0.8 + time * 0.3) * 0.2;
        position.setZ(i, z);
      }
      position.needsUpdate = true;
      geoRef.current.computeVertexNormals();
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
        <mesh rotation={[-Math.PI / 3, 0, Math.PI / 4]} castShadow receiveShadow>
          <planeGeometry ref={geoRef} args={[8, 10, 64, 64]} />
          <meshPhysicalMaterial
            color="#D4957F"
            emissive="#4A2E2A"
            emissiveIntensity={0.1}
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.3}
            clearcoatRoughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* Elegant floating accent spheres to match high-end fashion vibe */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const r = 3 + Math.random() * 2;
        return (
          <Float key={i} speed={0.5 + Math.random()} floatIntensity={0.5} rotationIntensity={0.2}>
            <mesh
              position={[
                Math.cos(angle) * r,
                -2 + Math.random() * 4,
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.03 + Math.random() * 0.04, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#E6B7A9' : '#FFFFFF'}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </Float>
        );
      })}
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
        <WavingSilk />
        <Particles />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
