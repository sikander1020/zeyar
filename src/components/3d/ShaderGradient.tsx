'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  
  // Smoothstep function for smooth transitions
  float smoothstep(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }
  
  // Simplex-like noise function
  float noise(vec2 p) {
    return sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create flowing wave distortion with multiple frequencies
    float wave1 = sin(uv.x * 3.0 + uTime * 0.5) * 0.05;
    float wave2 = cos(uv.y * 2.0 - uTime * 0.3) * 0.05;
    float wave3 = sin((uv.x + uv.y) * 2.5 + uTime * 0.4) * 0.03;
    uv += vec2(wave1 + wave3, wave2);
    
    // Create soft radial gradients with smooth animation
    vec2 center1 = vec2(0.3 + sin(uTime * 0.2) * 0.15, 0.4 + cos(uTime * 0.15) * 0.15);
    vec2 center2 = vec2(0.7 + cos(uTime * 0.25) * 0.15, 0.6 + sin(uTime * 0.18) * 0.15);
    vec2 center3 = vec2(0.5 + sin(uTime * 0.12) * 0.1, 0.3 + cos(uTime * 0.22) * 0.1);
    
    float dist1 = distance(uv, center1);
    float dist2 = distance(uv, center2);
    float dist3 = distance(uv, center3);
    
    // Smooth falloff with adjusted ranges for better blending
    float grad1 = smoothstep(0.85, 0.0, dist1) * 0.55;
    float grad2 = smoothstep(0.95, 0.0, dist2) * 0.35;
    float grad3 = smoothstep(0.75, 0.0, dist3) * 0.2;
    
    // Blend colors with multiple layers
    vec3 color = mix(uColor1, uColor2, grad1);
    color = mix(color, uColor3, grad2);
    color = mix(color, uColor1, grad3 * 0.3);
    
    // Add subtle shimmer texture
    float shimmer = sin(uv.x * 8.0 + uTime * 0.3) * cos(uv.y * 12.0 - uTime * 0.2) * 0.015;
    color += vec3(shimmer);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderBackground({ 
  color1 = '#FAF7F4',
  color2 = '#F5EDE6',
  color3 = '#B76E79',
  intensity = 1.0
}: {
  color1?: string;
  color2?: string;
  color3?: string;
  intensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uColor3: { value: new THREE.Color(color3) },
  }), [color1, color2, color3]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime() * intensity;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={2}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function ShaderGradientCanvas({ 
  className = '',
  color1 = '#FAF7F4',
  color2 = '#F5EDE6',
  color3 = '#B76E79',
  intensity = 0.8
}: {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  intensity?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], far: 100 }}
      className={className}
      gl={{ alpha: true, antialias: true, precision: 'mediump' }}
      dpr={[1, 1.5]}
    >
      <ShaderBackground 
        color1={color1}
        color2={color2}
        color3={color3}
        intensity={intensity}
      />
    </Canvas>
  );
}

export default ShaderGradientCanvas;
