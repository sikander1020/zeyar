'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* === ZAYBAASH Palette === */
const TEAL   = '#3EC8D8'; // woman outfit
const PINK   = '#F07AB0'; // left dress
const ORANGE = '#F4A028'; // right dress
const SKIN   = '#C17A50';
const HAIR   = '#1A0C06';
const BEIGE  = '#FCCEC8'; // pink backdrop circle
const CREAM  = '#FAF0EA';
const HANGER = '#2A2820'; // dark charcoal hangers

function BreezeSkirt({ color, phase = 0 }: { color: string; phase?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { geo, orig } = useMemo(() => {
    const geo = new THREE.ConeGeometry(1.28, 2.1, 72, 16, true);
    geo.computeVertexNormals();
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const orig = Float32Array.from(pos.array as Float32Array);
    return { geo, orig };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3];
      const oy = orig[i * 3 + 1];
      const oz = orig[i * 3 + 2];
      if (oy < 0.1) {
        const angle = Math.atan2(oz, ox);
        const depth = Math.min((-oy) / 2.1, 1);
        const w1    = Math.sin(t * 2.2 + phase + angle * 2.5) * 0.26 * depth;
        const w2    = Math.sin(t * 3.4 + phase * 1.4 + angle * 4.0) * 0.10 * depth;
        const sway  = Math.sin(t * 1.1 + phase) * 0.14 * depth;
        const total = w1 + w2;
        pos.setX(i, ox + total * Math.cos(angle) + sway);
        pos.setZ(i, oz + total * Math.sin(angle));
      }
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshStandardMaterial color={color} roughness={0.22} metalness={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

function DressUnit({ pos, dressCol, phase = 0 }: { pos: [number, number, number]; dressCol: string; phase?: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.15 + phase) * 0.03;
  });
  const h = { color: HANGER, roughness: 0.5, metalness: 0.3 } as const;
  return (
    <group ref={ref} position={pos}>
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.155, 0.032, 12, 36, Math.PI]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[0, 1.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 2.1, 16]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[-0.66, 0.76, 0]} rotation={[0, 0, Math.PI / 4.6]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[0.66, 0.76, 0]} rotation={[0, 0, -Math.PI / 4.6]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.34, 12]} />
        <meshStandardMaterial {...h} />
      </mesh>
      {([-1.05, 1.05] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.08, 0]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial {...h} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.36, 0.43, 0.7, 40]} />
        <meshStandardMaterial color={dressCol} roughness={0.15} metalness={0.05} />
      </mesh>
      {([-0.18, 0.18] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.56, 0.28]} rotation={[0.22, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.44, 8]} />
          <meshStandardMaterial color={dressCol} roughness={0.15} metalness={0.05} />
        </mesh>
      ))}
      <mesh position={[0, -0.21, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.08, 40]} />
        <meshStandardMaterial color={dressCol} roughness={0.3} metalness={0.1} />
      </mesh>
      <group position={[0, -1.28, 0]}>
        <BreezeSkirt color={dressCol} phase={phase} />
      </group>
    </group>
  );
}

function Woman() {
  const skin = { color: SKIN, roughness: 0.45, metalness: 0 } as const;
  const hair = { color: HAIR, roughness: 0.7,  metalness: 0 } as const;
  const out  = { color: TEAL, roughness: 0.3,  metalness: 0.05 } as const;
  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.42, 0.52, 2.3, 36]} />
        <meshStandardMaterial {...out} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.26, 16]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      <mesh position={[0, 1.17, 0]}>
        <sphereGeometry args={[0.36, 28, 28]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      <mesh position={[0, 1.27, -0.07]}>
        <sphereGeometry args={[0.41, 22, 22]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      <mesh position={[0, 1.5, 0.04]}>
        <sphereGeometry args={[0.3, 18, 18]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      <mesh position={[-0.22, 1.1, -0.15]} rotation={[0.2, 0.1, 0.3]}>
        <capsuleGeometry args={[0.1, 0.55, 8, 12]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {([-0.12, 0.12] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.19, 0.34]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshStandardMaterial color='#111' roughness={1} metalness={0} />
        </mesh>
      ))}
      {([-0.08, 0.08] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.06, 0.35]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color='#7a3030' roughness={1} metalness={0} />
        </mesh>
      ))}
      <mesh position={[-1.22, 1.0, 0]} rotation={[0, 0, 0.85]}>
        <cylinderGeometry args={[0.095, 0.085, 2.0, 16]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      <mesh position={[-2.02, 1.72, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      <mesh position={[1.22, 1.0, 0]} rotation={[0, 0, -0.85]}>
        <cylinderGeometry args={[0.095, 0.085, 2.0, 16]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      <mesh position={[2.02, 1.72, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
    </group>
  );
}

function GlowCircle() {
  return (
    <mesh position={[0, 0.2, -1.8]}>
      <circleGeometry args={[3.6, 64]} />
      <meshStandardMaterial color={BEIGE} roughness={1} metalness={0} transparent opacity={0.65} />
    </mesh>
  );
}

function Sparkles() {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const count = 55;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.0 + Math.random() * 1.6;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = -2.5 + Math.random() * 6.5;
      pos[i * 3 + 2] = -0.5 + Math.random() * 0.8;
      const c = new THREE.Color(Math.random() > 0.5 ? PINK : BEIGE);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.04;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.058} vertexColors transparent opacity={0.78} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 44 }} style={{ background: 'transparent' }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 6]} intensity={1.9} color={CREAM} castShadow />
      <pointLight position={[-6, 4, 3]} intensity={1.3} color='#F0D5C8' />
      <pointLight position={[6, -2, 4]} intensity={0.9} color={PINK} />
      <spotLight position={[0, 14, 3]} angle={0.38} penumbra={0.9} intensity={2.2} color={CREAM} castShadow />
      <Suspense fallback={null}>
        <Float speed={0.55} floatIntensity={0.18} rotationIntensity={0.015}>
          <group scale={0.82} position={[0, 0.25, 0]}>
            <GlowCircle />
            <Woman />
            <DressUnit pos={[-2.02, 0.27, 0]} dressCol={PINK} phase={0} />
            <DressUnit pos={[2.02, 0.27, 0]} dressCol={ORANGE} phase={Math.PI * 0.65} />
          </group>
        </Float>
        <Sparkles />
        <Environment preset='sunset' />
      </Suspense>
    </Canvas>
  );
}
