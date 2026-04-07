'use client';

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, MeshDistortMaterial, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

function DesignerGown() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const points = useMemo(() => {
    const pts = [];
    // Outline of a luxury dress (top to bottom)
    pts.push(new THREE.Vector2(0.15, 2.8));   // Neck
    pts.push(new THREE.Vector2(0.6, 2.0));    // Bust
    pts.push(new THREE.Vector2(0.35, 1.0));   // Waist
    pts.push(new THREE.Vector2(0.8, -0.2));   // Hips
    pts.push(new THREE.Vector2(1.5, -1.8));   // Lower skirt
    pts.push(new THREE.Vector2(2.2, -3.0));   // Hemline
    pts.push(new THREE.Vector2(0.0, -3.0));   // Close the base
    
    // Smooth the curve points for elegant 3D lathe
    const curve = new THREE.SplineCurve(pts);
    return curve.getPoints(60);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle bouncing/swaying of the mannequin
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    }
    if (meshRef.current) {
      // Rotate the orbiting rings around the dress
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Flowing sculpted dress silhouette */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <latheGeometry args={[points, 64]} />
          <meshPhysicalMaterial
            color="#E6B7A9"
            roughness={0.15}
            metalness={0.3}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* Elegant floating accent spheres */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const r = 2.8 + Math.random() * 1.5;
        return (
          <Float key={i} speed={0.8 + Math.random()} floatIntensity={0.6} rotationIntensity={0.2}>
            <mesh
              position={[
                Math.cos(angle) * r,
                -2 + Math.random() * 5,
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.04 + Math.random() * 0.05, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#E6B7A9' : '#B76E79'}
                roughness={0.1}
                metalness={0.8}
                emissive={i % 2 === 0 ? '#E6B7A9' : '#B76E79'}
                emissiveIntensity={0.4}
              />
            </mesh>
          </Float>
        );
      })}

      {/* The requested orbiting sci-fi rings from the original */}
      <group ref={meshRef} position={[0, -0.8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.015, 16, 100]} />
          <meshStandardMaterial color="#B76E79" roughness={0.1} metalness={1} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.5, 0]}>
          <torusGeometry args={[3.8, 0.01, 16, 100]} />
          <meshStandardMaterial color="#E6B7A9" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
        </mesh>
      </group>
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
        <DesignerGown />
        <Particles />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
