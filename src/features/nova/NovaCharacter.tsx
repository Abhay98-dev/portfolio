import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../../utils/audio';

interface NovaCharacterProps {
  onInteract?: () => void;
  reducedMotion?: boolean;
}

export const NovaCharacter: React.FC<NovaCharacterProps> = ({
  onInteract,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isExcited, setIsExcited] = useState(false);

  // Materials
  const materials = useMemo(() => {
    return {
      whiteChassis: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        metalness: 0.35,
        roughness: 0.25,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.8,
        roughness: 0.4,
      }),
      cyanGlow: new THREE.MeshStandardMaterial({
        color: '#00f2fe',
        emissive: '#00f2fe',
        emissiveIntensity: 1.4,
        roughness: 0.1,
      }),
      visorScreen: new THREE.MeshStandardMaterial({
        color: '#050a18',
        metalness: 0.9,
        roughness: 0.1,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        metalness: 0.8,
        roughness: 0.3,
      }),
    };
  }, []);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundManager.playNovaChirp();
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 1200);
    if (onInteract) {
      onInteract();
    }
  };

  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (!reducedMotion && groupRef.current) {
      // Gentle floating bob
      const bobOffset = Math.sin(time * 2.2) * 0.12;
      groupRef.current.position.y = 1.35 + bobOffset;

      // Subtle tilt
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.04;

      if (isExcited) {
        // Joyful spin reaction
        groupRef.current.rotation.y += delta * 6;
      } else {
        // Return to neutral forward-facing rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          0.3 + (state.pointer.x * 0.3),
          delta * 4
        );
      }
    }

    // Head tracks cursor subtly
    if (headRef.current && !reducedMotion) {
      const targetHeadX = -state.pointer.y * 0.25;
      const targetHeadY = state.pointer.x * 0.35;
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadX, delta * 5);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetHeadY, delta * 5);
    }

    // Floating arm idle sway
    if (leftArmRef.current && rightArmRef.current && !reducedMotion) {
      leftArmRef.current.rotation.z = 0.2 + Math.sin(time * 2.5) * 0.08;
      rightArmRef.current.rotation.z = -0.2 - Math.sin(time * 2.5 + 0.5) * 0.08;
    }

    // Thruster pulse
    if (thrusterRef.current) {
      const pulse = 0.9 + Math.sin(time * 8) * 0.35;
      thrusterRef.current.scale.set(pulse, pulse, pulse);
    }

    // Blinking effect
    const blinkCycle = Math.sin(time * 0.8);
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeScaleY = blinkCycle > 0.97 ? 0.1 : 1.0;
      leftEyeRef.current.scale.y = eyeScaleY;
      rightEyeRef.current.scale.y = eyeScaleY;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[2.2, 1.4, 1.8]}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      scale={isHovered ? [1.06, 1.06, 1.06] : [1.0, 1.0, 1.0]}
    >
      {/* Interaction prompt billboard */}
      {isHovered && (
        <group position={[0, 1.25, 0]}>
          <mesh>
            <planeGeometry args={[1.5, 0.4]} />
            <meshBasicMaterial color="#050a18" transparent opacity={0.85} />
          </mesh>
        </group>
      )}

      {/* NOVA Torso */}
      <group position={[0, 0, 0]}>
        {/* Main curved white chassis */}
        <mesh material={materials.whiteChassis} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.34, 0.38, 16, 24]} />
        </mesh>

        {/* Chest Dark Panel */}
        <mesh material={materials.darkMetal} position={[0, 0.05, 0.28]} scale={[0.8, 0.6, 0.3]}>
          <boxGeometry args={[0.3, 0.3, 0.1]} />
        </mesh>

        {/* Chest Cyan Arc Reactor */}
        <mesh material={materials.cyanGlow} position={[0, 0.05, 0.32]}>
          <circleGeometry args={[0.07, 24]} />
        </mesh>

        {/* Gold trim detail */}
        <mesh material={materials.goldAccent} position={[0, -0.15, 0.3]}>
          <boxGeometry args={[0.16, 0.02, 0.02]} />
        </mesh>

        {/* Hover Propulsion Ring at Base */}
        <mesh
          ref={thrusterRef}
          position={[0, -0.38, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.cyanGlow}
        >
          <ringGeometry args={[0.14, 0.24, 24]} />
        </mesh>

        {/* Bottom anti-grav emitter nozzle */}
        <mesh material={materials.darkMetal} position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.18, 0.08, 0.15, 24]} />
        </mesh>
      </group>

      {/* NOVA Head Unit */}
      <group ref={headRef} position={[0, 0.42, 0]}>
        {/* Neck ring joint */}
        <mesh material={materials.darkMetal} position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.06, 16]} />
        </mesh>

        {/* Curved white helmet */}
        <mesh material={materials.whiteChassis} position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.35, 24, 24]} />
        </mesh>

        {/* Visor Screen Faceplate */}
        <mesh
          material={materials.visorScreen}
          position={[0, 0.08, 0.2]}
          rotation={[0.05, 0, 0]}
        >
          <boxGeometry args={[0.44, 0.26, 0.22]} />
        </mesh>

        {/* Cyan Glowing Expressive Eyes */}
        <group position={[0, 0.08, 0.32]}>
          {/* Left Eye */}
          <mesh ref={leftEyeRef} material={materials.cyanGlow} position={[-0.1, 0.02, 0]}>
            <capsuleGeometry args={[0.032, 0.06, 8, 16]} />
          </mesh>
          {/* Right Eye */}
          <mesh ref={rightEyeRef} material={materials.cyanGlow} position={[0.1, 0.02, 0]}>
            <capsuleGeometry args={[0.032, 0.06, 8, 16]} />
          </mesh>
        </group>

        {/* Cute communicator antenna */}
        <group position={[0.26, 0.25, 0]} rotation={[0, 0, -0.4]}>
          <mesh material={materials.darkMetal}>
            <cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />
          </mesh>
          <mesh material={materials.cyanGlow} position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* Articulated Floating Arms */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.42, 0.05, 0]}>
        <mesh material={materials.darkMetal} position={[0, 0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>
        <mesh material={materials.whiteChassis} position={[-0.05, -0.15, 0]}>
          <capsuleGeometry args={[0.05, 0.16, 8, 12]} />
        </mesh>
        {/* Hand */}
        <mesh material={materials.cyanGlow} position={[-0.05, -0.28, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.42, 0.05, 0]}>
        <mesh material={materials.darkMetal} position={[0, 0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>
        <mesh material={materials.whiteChassis} position={[0.05, -0.15, 0]}>
          <capsuleGeometry args={[0.05, 0.16, 8, 12]} />
        </mesh>
        {/* Hand */}
        <mesh material={materials.cyanGlow} position={[0.05, -0.28, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
      </group>

      {/* Ambient local cyan spotlight for NOVA */}
      <pointLight color="#00f2fe" intensity={1.5} distance={3.5} decay={2} position={[0, 0.2, 0.4]} />
    </group>
  );
};
