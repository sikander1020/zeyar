'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── ZAYBAASH Palette ─── */
const GOLD    = '#C9956A';
const ROSE    = '#D4957F';
const DEEP    = '#8B4E5C';
const SKIN    = '#C68642';
const HAIR    = '#1A0E0A';
const BEIGE   = '#F0E0D6';
const CREAM   = '#FAF0EA';

/* ════════════════════════════════════════
   ANIMATED BREEZE SKIRT
   Vertex-level cloth simulation using
   sinusoidal displacement per frame.
════════════════════════════════════════ */
function BreezeSkirt({
  color,
  phase = 0,
}: {
  color: string;
  phase?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  /* Geometry + stored original positions */
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
    const pos = meshRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3];
      const oy = orig[i * 3 + 1];
      const oz = orig[i * 3 + 2];

      if (oy < 0.1) {
        const angle = Math.atan2(oz, ox);
        const depth = Math.min((-oy) / 2.1, 1); // 0→top  1→hem

        // Three overlapping waves = rich fabric motion
        const w1 = Math.sin(t * 2.2 + phase + angle * 2.5) * 0.26 * depth;
        const w2 = Math.sin(t * 3.4 + phase * 1.4 + angle * 4.0) * 0.10 * depth;
        const sway = Math.sin(t * 1.1 + phase) * 0.14 * depth;       // whole-skirt sway
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
      <meshStandardMaterial
        color={color}
        roughness={0.22}
        metalness={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ════════════════════════════════════════
   DRESS + HANGER UNIT
   Self-contained with gentle hanger swing
════════════════════════════════════════ */
function DressUnit({
  pos,
  dressCol,
  phase = 0,
}: {
  pos: [number, number, number];
  dressCol: string;
  phase?: number;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 1.15 + phase) * 0.03;
  });

  const goldProps = {
    color: GOLD,
    roughness: 0.05,
    metalness: 1.0,
  } as const;

  return (
    <group ref={ref} position={pos}>
      {/* ── Hanger ── */}
      {/* Hook (open half-torus) */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.155, 0.032, 12, 36, Math.PI]} />
        <meshStandardMaterial {...goldProps} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 1.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 2.1, 16]} />
        <meshStandardMaterial {...goldProps} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.66, 0.76, 0]} rotation={[0, 0, Math.PI / 4.6]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
        <meshStandardMaterial {...goldProps} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.66, 0.76, 0]} rotation={[0, 0, -Math.PI / 4.6]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
        <meshStandardMaterial {...goldProps} />
      </mesh>
      {/* Centre neck drop */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.34, 12]} />
        <meshStandardMaterial {...goldProps} />
      </mesh>
      {/* End caps */}
      {([-1.05, 1.05] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.08, 0]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial {...goldProps} />
        </mesh>
      ))}

      {/* ── Dress bodice ── */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.36, 0.43, 0.7, 40]} />
        <meshStandardMaterial color={dressCol} roughness={0.15} metalness={0.2} />
      </mesh>
      {/* Straps */}
      {([-0.18, 0.18] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.56, 0.28]} rotation={[0.22, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.44, 8]} />
          <meshStandardMaterial color={dressCol} roughness={0.15} metalness={0.2} />
        </mesh>
      ))}
      {/* Gold waist band */}
      <mesh position={[0, -0.21, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.08, 40]} />
        <meshStandardMaterial {...goldProps} />
      </mesh>

      {/* ── Breeze Skirt ── */}
      <group position={[0, -1.28, 0]}>
        <BreezeSkirt color={dressCol} phase={phase} />
      </group>
    </group>
  );
}

/* ════════════════════════════════════════
   WOMAN FIGURE  (stylised primitives)
════════════════════════════════════════ */
function Woman() {
  /* Shared material helpers */
  const skin = { color: SKIN,  roughness: 0.45, metalness: 0 } as const;
  const hair = { color: HAIR,  roughness: 0.7,  metalness: 0 } as const;
  const out  = { color: DEEP,  roughness: 0.3,  metalness: 0.05 } as const; // her outfit

  return (
    <group>
      {/* Body / outfit */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.42, 0.52, 2.3, 36]} />
        <meshStandardMaterial {...out} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.26, 16]} />
        <meshStandardMaterial {...skin} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.17, 0]}>
        <sphereGeometry args={[0.36, 28, 28]} />
        <meshStandardMaterial {...skin} />
      </mesh>

      {/* Hair — back volume */}
      <mesh position={[0, 1.27, -0.07]}>
        <sphereGeometry args={[0.41, 22, 22]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Hair — top */}
      <mesh position={[0, 1.5, 0.04]}>
        <sphereGeometry args={[0.3, 18, 18]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Hair — flowing left side */}
      <mesh position={[-0.22, 1.1, -0.15]} rotation={[0.2, 0.1, 0.3]}>
        <capsuleGeometry args={[0.1, 0.55, 8, 12]} />
        <meshStandardMaterial {...hair} />
      </mesh>

      {/* Eyes */}
      {([-0.12, 0.12] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.19, 0.34]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshStandardMaterial color="#111" roughness={1} metalness={0} />
        </mesh>
      ))}
      {/* Subtle smile — two small dots */}
      {([-0.08, 0.08] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.06, 0.35]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#7a3030" roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* ── Arms ── single cylinder shoulder→hand ── */}
      {/* Left arm */}
      <mesh position={[-1.22, 1.0, 0]} rotation={[0, 0, 0.85]}>
        <cylinderGeometry args={[0.095, 0.085, 2.0, 16]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-2.02, 1.72, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial {...skin} />
      </mesh>

      {/* Right arm */}
      <mesh position={[1.22, 1.0, 0]} rotation={[0, 0, -0.85]}>
        <cylinderGeometry args={[0.095, 0.085, 2.0, 16]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Right hand */}
      <mesh position={[2.02, 1.72, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════
   SOFT BACKGROUND GLOW CIRCLE
════════════════════════════════════════ */
function GlowCircle() {
  return (
    <mesh position={[0, 0.2, -1.8]}>
      <circleGeometry args={[3.6, 64]} />
      <meshStandardMaterial
        color={BEIGE}
        roughness={1}
        metalness={0}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/* ════════════════════════════════════════
   GOLD SPARKLE PARTICLES
════════════════════════════════════════ */
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
      const c = new THREE.Color(Math.random() > 0.5 ? GOLD : BEIGE);
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

/* ════════════════════════════════════════
   ROOT CANVAS
════════════════════════════════════════ */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 44 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 6]}  intensity={1.9} color={CREAM} castShadow />
      <pointLight       position={[-6, 4, 3]}  intensity={1.3} color="#F0D5C8" />
      <pointLight       position={[6, -2, 4]}  intensity={0.9} color={ROSE}   />
      <spotLight
        position={[0, 14, 3]}
        angle={0.38}
        penumbra={0.9}
        intensity={2.2}
        color={CREAM}
        castShadow
      />

      <Suspense fallback={null}>
        <Float speed={0.55} floatIntensity={0.18} rotationIntensity={0.015}>
          <group scale={0.82} position={[0, 0.25, 0]}>
            <GlowCircle />
            <Woman />
            {/* LEFT dress — ROSE, held by left hand at [-2.02, 1.72] */}
            {/* Hook y=1.45 relative → group y = 1.72-1.45 = 0.27 */}
            <DressUnit pos={[-2.02, 0.27, 0]} dressCol={ROSE} phase={0} />
            {/* RIGHT dress — GOLD, held by right hand at [2.02, 1.72] */}
            <DressUnit pos={[2.02, 0.27, 0]} dressCol={GOLD} phase={Math.PI * 0.65} />
          </group>
        </Float>
        <Sparkles />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
