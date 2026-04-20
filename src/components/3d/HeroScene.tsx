'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const TEAL   = '#3EC8D8';
const PINK   = '#F07AB0';
const ORANGE = '#F4A028';
const SKIN   = '#C17A50';
const HAIR   = '#1A0C06';
const BEIGE  = '#FCCEC8';
const CREAM  = '#FAF0EA';
const HANGER = '#2A2820';

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
      const ox = orig[i * 3], oy = orig[i * 3 + 1], oz = orig[i * 3 + 2];
      if (oy < 0.1) {
        const angle = Math.atan2(oz, ox);
        const depth = Math.min((-oy) / 2.1, 1);
        const w1 = Math.sin(t * 2.2 + phase + angle * 2.5) * 0.26 * depth;
        const w2 = Math.sin(t * 3.4 + phase * 1.4 + angle * 4.0) * 0.10 * depth;
        const sway = Math.sin(t * 1.1 + phase) * 0.14 * depth;
        pos.setX(i, ox + (w1 + w2) * Math.cos(angle) + sway);
        pos.setZ(i, oz + (w1 + w2) * Math.sin(angle));
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

function DressUnit({ pos, dressCol, phase = 0 }: { pos: [number,number,number]; dressCol: string; phase?: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.15 + phase) * 0.03;
  });
  const h = { color: HANGER, roughness: 0.5, metalness: 0.3 } as const;
  return (
    <group ref={ref} position={pos}>
      <mesh position={[0,1.45,0]} rotation={[0,0,Math.PI]}>
        <torusGeometry args={[0.155,0.032,12,36,Math.PI]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[0,1.08,0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.024,0.024,2.1,16]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[-0.66,0.76,0]} rotation={[0,0,Math.PI/4.6]}>
        <cylinderGeometry args={[0.02,0.02,1.0,12]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[0.66,0.76,0]} rotation={[0,0,-Math.PI/4.6]}>
        <cylinderGeometry args={[0.02,0.02,1.0,12]} />
        <meshStandardMaterial {...h} />
      </mesh>
      <mesh position={[0,0.38,0]}>
        <cylinderGeometry args={[0.022,0.022,0.34,12]} />
        <meshStandardMaterial {...h} />
      </mesh>
      {([-1.05,1.05] as number[]).map((x,i) => (
        <mesh key={i} position={[x,1.08,0]}>
          <sphereGeometry args={[0.042,12,12]} />
          <meshStandardMaterial {...h} />
        </mesh>
      ))}
      <mesh position={[0,0.14,0]}>
        <cylinderGeometry args={[0.36,0.43,0.7,40]} />
        <meshStandardMaterial color={dressCol} roughness={0.15} metalness={0.05} />
      </mesh>
      {([-0.18,0.18] as number[]).map((x,i) => (
        <mesh key={i} position={[x,0.56,0.28]} rotation={[0.22,0,0]}>
          <cylinderGeometry args={[0.028,0.028,0.44,8]} />
          <meshStandardMaterial color={dressCol} roughness={0.15} metalness={0.05} />
        </mesh>
      ))}
      <mesh position={[0,-0.21,0]}>
        <cylinderGeometry args={[0.44,0.44,0.08,40]} />
        <meshStandardMaterial color={dressCol} roughness={0.3} metalness={0.1} />
      </mesh>
      <group position={[0,-1.28,0]}>
        <BreezeSkirt color={dressCol} phase={phase} />
      </group>
    </group>
  );
}

function Woman() {
  const skin = { color: SKIN, roughness: 0.4, metalness: 0 } as const;
  const hair = { color: HAIR, roughness: 0.65, metalness: 0 } as const;
  const out  = { color: TEAL, roughness: 0.3, metalness: 0.05 } as const;
  return (
    <group>
      {/* Body */}
      <mesh position={[0,-0.5,0]}>
        <cylinderGeometry args={[0.42,0.52,2.3,36]} />
        <meshStandardMaterial {...out} />
      </mesh>
      {/* Neck */}
      <mesh position={[0,0.78,0]}>
        <cylinderGeometry args={[0.12,0.14,0.26,16]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Head */}
      <mesh position={[0,1.17,0]}>
        <sphereGeometry args={[0.36,32,32]} />
        <meshStandardMaterial {...skin} />
      </mesh>

      {/* === FLOWING OPEN HAIR === */}
      {/* Scalp cap */}
      <mesh position={[0,1.46,0]}>
        <sphereGeometry args={[0.385,22,22]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Back volume - long flowing */}
      <mesh position={[0,0.7,-0.22]}>
        <capsuleGeometry args={[0.29,1.55,10,14]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Back lower taper */}
      <mesh position={[0,-0.12,-0.26]} rotation={[0.1,0,0]}>
        <capsuleGeometry args={[0.17,0.95,8,12]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Left front strand - frames face */}
      <mesh position={[-0.3,1.1,0.15]} rotation={[0.12,-0.15,0.2]}>
        <capsuleGeometry args={[0.07,0.68,6,10]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Left lower strand */}
      <mesh position={[-0.38,0.5,0.04]} rotation={[0.05,0,0.1]}>
        <capsuleGeometry args={[0.08,1.05,6,10]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Right front strand */}
      <mesh position={[0.28,1.12,0.14]} rotation={[0.1,0.12,-0.18]}>
        <capsuleGeometry args={[0.065,0.62,6,10]} />
        <meshStandardMaterial {...hair} />
      </mesh>
      {/* Right lower strand */}
      <mesh position={[0.34,0.58,0.04]} rotation={[0.04,0,-0.08]}>
        <capsuleGeometry args={[0.07,0.88,6,10]} />
        <meshStandardMaterial {...hair} />
      </mesh>

      {/* === FACE === */}
      {/* Eye whites */}
      {([-0.12,0.12] as number[]).map((x,i) => (
        <mesh key={i} position={[x,1.19,0.32]}>
          <sphereGeometry args={[0.052,12,12]} />
          <meshStandardMaterial color='#F5F0EB' roughness={0.8} metalness={0} />
        </mesh>
      ))}
      {/* Pupils */}
      {([-0.12,0.12] as number[]).map((x,i) => (
        <mesh key={i} position={[x,1.19,0.345]}>
          <sphereGeometry args={[0.032,10,10]} />
          <meshStandardMaterial color='#1A0A08' roughness={0.5} metalness={0} />
        </mesh>
      ))}
      {/* Eyebrows */}
      {([-0.12,0.12] as number[]).map((x,i) => (
        <mesh key={i} position={[x,1.28,0.34]} rotation={[0,0,i===0?0.18:-0.18]}>
          <boxGeometry args={[0.1,0.018,0.012]} />
          <meshStandardMaterial {...hair} />
        </mesh>
      ))}
      {/* Nose */}
      <mesh position={[0,1.12,0.37]}>
        <sphereGeometry args={[0.028,8,8]} />
        <meshStandardMaterial color='#A8623A' roughness={0.6} metalness={0} />
      </mesh>
      {/* Smile arc */}
      <mesh position={[0,1.06,0.355]} rotation={[0,0,Math.PI]}>
        <torusGeometry args={[0.072,0.013,8,22,Math.PI*0.65]} />
        <meshStandardMaterial color='#8B3A3A' roughness={1} metalness={0} />
      </mesh>

      {/* === ARMS with elbow joints === */}
      {/* Left upper arm */}
      <mesh position={[-0.88,0.92,0]} rotation={[0,0,0.96]}>
        <cylinderGeometry args={[0.09,0.085,0.95,14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Left elbow */}
      <mesh position={[-1.28,1.2,0]}>
        <sphereGeometry args={[0.1,12,12]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-1.67,1.48,0]} rotation={[0,0,0.93]}>
        <cylinderGeometry args={[0.08,0.075,0.88,14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Left hand */}
      <group position={[-2.02,1.72,0]} rotation={[0.25,0,0.93]}>
        <mesh>
          <boxGeometry args={[0.13,0.19,0.07]} />
          <meshStandardMaterial {...skin} />
        </mesh>
        {([-0.045,-0.015,0.015,0.045] as number[]).map((x,i) => (
          <mesh key={i} position={[x,0.14,0]}>
            <capsuleGeometry args={[0.018,0.1,4,6]} />
            <meshStandardMaterial {...skin} />
          </mesh>
        ))}
        <mesh position={[-0.1,0.04,0]} rotation={[0,0,0.9]}>
          <capsuleGeometry args={[0.018,0.08,4,6]} />
          <meshStandardMaterial {...skin} />
        </mesh>
      </group>

      {/* Right upper arm */}
      <mesh position={[0.88,0.92,0]} rotation={[0,0,-0.96]}>
        <cylinderGeometry args={[0.09,0.085,0.95,14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Right elbow */}
      <mesh position={[1.28,1.2,0]}>
        <sphereGeometry args={[0.1,12,12]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Right forearm */}
      <mesh position={[1.67,1.48,0]} rotation={[0,0,-0.93]}>
        <cylinderGeometry args={[0.08,0.075,0.88,14]} />
        <meshStandardMaterial {...skin} />
      </mesh>
      {/* Right hand */}
      <group position={[2.02,1.72,0]} rotation={[0.25,0,-0.93]}>
        <mesh>
          <boxGeometry args={[0.13,0.19,0.07]} />
          <meshStandardMaterial {...skin} />
        </mesh>
        {([-0.045,-0.015,0.015,0.045] as number[]).map((x,i) => (
          <mesh key={i} position={[x,0.14,0]}>
            <capsuleGeometry args={[0.018,0.1,4,6]} />
            <meshStandardMaterial {...skin} />
          </mesh>
        ))}
        <mesh position={[0.1,0.04,0]} rotation={[0,0,-0.9]}>
          <capsuleGeometry args={[0.018,0.08,4,6]} />
          <meshStandardMaterial {...skin} />
        </mesh>
      </group>
    </group>
  );
}

function GlowCircle() {
  return (
    <mesh position={[0,0.2,-1.8]}>
      <circleGeometry args={[3.6,64]} />
      <meshStandardMaterial color={BEIGE} roughness={1} metalness={0} transparent opacity={0.65} />
    </mesh>
  );
}

function Sparkles() {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const count = 55;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 5 + 1);
      const r2 = pseudoRandom(i * 5 + 2);
      const r3 = pseudoRandom(i * 5 + 3);
      const r4 = pseudoRandom(i * 5 + 4);
      const r5 = pseudoRandom(i * 5 + 5);

      const a = r1 * Math.PI * 2;
      const r = 3.0 + r2 * 1.6;
      pos[i*3]   = Math.cos(a) * r;
      pos[i*3+1] = -2.5 + r3 * 6.5;
      pos[i*3+2] = -0.5 + r4 * 0.8;
      const c = new THREE.Color(r5 > 0.5 ? PINK : BEIGE);
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3));
    g.setAttribute('color',    new THREE.BufferAttribute(col,3));
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
    <Canvas camera={{ position:[0,0,10], fov:44 }} style={{ background:'transparent' }} gl={{ antialias:true, alpha:true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5,10,6]} intensity={2.0} color={CREAM} castShadow />
      <pointLight position={[-6,4,3]} intensity={1.4} color='#F0D5C8' />
      <pointLight position={[6,-2,4]} intensity={0.9} color={PINK} />
      <pointLight position={[0,6,6]} intensity={1.0} color='#FFFFFF' />
      <spotLight position={[0,14,3]} angle={0.38} penumbra={0.9} intensity={2.2} color={CREAM} castShadow />
      <Suspense fallback={null}>
        <Float speed={0.55} floatIntensity={0.18} rotationIntensity={0.015}>
          <group scale={0.82} position={[0,0.25,0]}>
            <GlowCircle />
            <Woman />
            <DressUnit pos={[-2.02,0.27,0]} dressCol={PINK} phase={0} />
            <DressUnit pos={[2.02,0.27,0]} dressCol={ORANGE} phase={Math.PI*0.65} />
          </group>
        </Float>
        <Sparkles />
        <Environment preset='sunset' />
      </Suspense>
    </Canvas>
  );
}
