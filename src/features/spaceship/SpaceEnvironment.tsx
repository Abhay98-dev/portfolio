import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAsteroidTexture, getProceduralSpacePanoramaTexture } from './proceduralTextures';

interface SpaceEnvironmentProps {
  reducedMotion?: boolean;
}

export const SpaceEnvironment: React.FC<SpaceEnvironmentProps> = ({ reducedMotion }) => {
  const planetRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const asteroidsRef = useRef<THREE.Group>(null);
  const panoramaRef = useRef<THREE.Mesh>(null);

  // Generate deep space starfield
  const [starPositions, starColors] = useMemo(() => {
    const count = 2800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#e0f2fe'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#fde047'),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 140 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  // Ambient floating cosmic dust motes near the spaceship
  const dustPositions = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return positions;
  }, []);

  // 3D Asteroid Belt objects
  const asteroids = useMemo(() => {
    const list = [];
    const asteroidTex = getAsteroidTexture();
    const material = new THREE.MeshStandardMaterial({
      map: asteroidTex,
      roughness: 0.9,
      metalness: 0.1,
      color: '#8a99ad',
    });

    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() * 0.4);
      const dist = 48 + Math.random() * 42;
      const x = Math.cos(angle) * dist;
      const y = (Math.random() - 0.5) * 22 + 2;
      const z = -25 - Math.sin(angle) * 32;
      const scale = 0.3 + Math.random() * 0.75;
      list.push({
        position: [x, y, z] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: [scale * (0.8 + Math.random() * 0.4), scale * (0.8 + Math.random() * 0.4), scale] as [number, number, number],
        material,
      });
    }
    return list;
  }, []);

  // Procedural 2048x1024 deep space panorama texture
  const panoramaTex = useMemo(() => {
    return getProceduralSpacePanoramaTexture();
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.002;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.015;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.008;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.006;
      dustRef.current.rotation.x += delta * 0.003;
    }
    if (asteroidsRef.current) {
      asteroidsRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <group name="space-environment">
      {/* 1. Curved Deep Space Vista Backdrop Cylinder */}
      <mesh
        ref={panoramaRef}
        position={[0, 4, -40]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <cylinderGeometry args={[110, 110, 90, 48, 1, true, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial
          map={panoramaTex}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Deep Space Starfield Points */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.4}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* 3. Floating Ambient Cosmic Stardust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#38bdf8"
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>

      {/* 4. Majestic Ringed Exoplanet (Framed through the panoramic cockpit window) */}
      <group position={[0, 7, -62]} ref={planetRef}>
        {/* Core Planet Body */}
        <mesh>
          <sphereGeometry args={[8, 48, 48]} />
          <meshStandardMaterial
            color="#0a1e44"
            roughness={0.65}
            metalness={0.25}
            emissive="#002d62"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Planet Atmospheric Fresnel Glow Halo */}
        <mesh scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[8, 36, 36]} />
          <meshBasicMaterial
            color="#00f2fe"
            transparent
            opacity={0.35}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Celestial Ring System */}
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2.6, 0, Math.PI / 5]}
        >
          <ringGeometry args={[10, 15, 64]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>

        {/* Nearby Orbiting Moon */}
        <mesh position={[25, 9, -14]}>
          <sphereGeometry args={[1.8, 24, 24]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#4c1d95"
            emissiveIntensity={0.25}
            roughness={0.85}
          />
        </mesh>
      </group>

      {/* 5. Drifting 3D Asteroids */}
      <group ref={asteroidsRef}>
        {asteroids.map((ast, idx) => (
          <mesh
            key={idx}
            position={ast.position}
            rotation={ast.rotation}
            scale={ast.scale}
            material={ast.material}
          >
            <dodecahedronGeometry args={[1, 1]} />
          </mesh>
        ))}
      </group>

    </group>
  );
};
