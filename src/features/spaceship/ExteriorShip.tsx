import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type PlateProps = { points: [number, number][]; y: number; material: THREE.Material };

/** Thin beveled armor panel. Points are given in the ship's top-down x/z plane. */
const ArmorPlate: React.FC<PlateProps> = ({ points, y, material }) => {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    points.forEach(([x, z], index) => index === 0 ? shape.moveTo(x, z) : shape.lineTo(x, z));
    shape.closePath();
    const meshGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });
    meshGeometry.rotateX(-Math.PI / 2);
    meshGeometry.computeVertexNormals();
    return meshGeometry;
  }, [points]);

  return <mesh geometry={geometry} material={material} position={[0, y, 0]} castShadow receiveShadow />;
};

export const ExteriorShip: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const ship = useRef<THREE.Group>(null);
  const materials = useMemo(() => ({
    hull: new THREE.MeshStandardMaterial({ color: '#303c50', metalness: 0.72, roughness: 0.43 }),
    armor: new THREE.MeshStandardMaterial({ color: '#536174', metalness: 0.68, roughness: 0.4 }),
    armorDark: new THREE.MeshStandardMaterial({ color: '#1d2939', metalness: 0.76, roughness: 0.48 }),
    trim: new THREE.MeshStandardMaterial({ color: '#8895a5', metalness: 0.72, roughness: 0.36 }),
    canopy: new THREE.MeshPhysicalMaterial({ color: '#152b42', metalness: 0.45, roughness: 0.18, clearcoat: 0.85, emissive: '#062333', emissiveIntensity: 0.25 }),
    cyan: new THREE.MeshBasicMaterial({ color: '#54e7ff' }),
    amber: new THREE.MeshBasicMaterial({ color: '#e99a51' }),
    engine: new THREE.MeshBasicMaterial({ color: '#73eaff' }),
  }), []);

  const portHull: [number, number][] = [[0, 7], [0.48, 6.2], [0.64, 3.5], [1.12, 0.4], [1.35, -2.3], [0.82, -2.8], [-0.52, -1.2], [-0.42, 2.1], [-0.32, 5.6]];
  const wing: [number, number][] = [[0.65, 3.0], [3.3, 2.7], [8.8, -1.1], [8.2, -1.9], [6.1, -2.4], [3.4, -1.0], [1.0, -3.1]];
  const wingArmor: [number, number][] = [[2.0, 1.9], [3.35, 1.8], [7.75, -1.25], [6.0, -1.62], [3.2, -0.1]];
  useFrame(({ clock }) => {
    if (!ship.current || reducedMotion) return;
    ship.current.rotation.y = Math.PI + Math.sin(clock.elapsedTime * 0.1) * 0.055;
    ship.current.position.y = Math.sin(clock.elapsedTime * 0.32) * 0.1;
  });

  return (
    <group ref={ship} position={[4, 0, 0]} rotation={[0, Math.PI, 0]}>
      <hemisphereLight args={['#d3e5ff', '#101522', 1.5]} />
      <directionalLight color="#e0e9ff" intensity={3.6} position={[-12, 16, 12]} />
      <directionalLight color="#4169a0" intensity={1.8} position={[12, 4, -10]} />
      {/* Long central armored spine */}
      <mesh position={[0, -0.12, 0.2]}>
        <boxGeometry args={[1.6, 0.78, 9.2]} />
        <primitive object={materials.hull} attach="material" />
      </mesh>
      <mesh position={[0, 0.2, -1.2]}>
        <boxGeometry args={[1.15, 0.18, 6.1]} />
        <primitive object={materials.trim} attach="material" />
      </mesh>
      {/* Twin forward hull lances and broad swept armored wings */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.72, 0, 0]} scale={[side, 1, 1]}>
          <ArmorPlate points={portHull} y={-0.48} material={materials.hull} />
          <ArmorPlate points={[[0.06, 5.4], [0.42, 5.4], [0.56, 2.8], [0.78, 0.2], [0.92, -1.7], [0.4, -2.05], [0.0, -0.6], [-0.02, 2.2]]} y={0.02} material={materials.armor} />
          <ArmorPlate points={wing} y={-0.32} material={materials.armorDark} />
          <ArmorPlate points={wingArmor} y={0.08} material={materials.armor} />
          {/* Wing-tip stabilizer and dark inset panel */}
          <mesh position={[6.2, -0.03, -1.55]} rotation={[0, -0.2, -0.08]}>
            <boxGeometry args={[3.4, 0.2, 1.05]} />
            <primitive object={materials.hull} attach="material" />
          </mesh>
          <mesh position={[4.7, 0.22, -0.25]} rotation={[0, -0.54, 0]}>
            <boxGeometry args={[2.3, 0.045, 0.09]} />
            <primitive object={materials.amber} attach="material" />
          </mesh>
          {/* Layered shoulder armor, edge rails and panel breaks */}
          <mesh position={[1.4, 0.29, 0.7]} rotation={[0, -0.22, 0]}>
            <boxGeometry args={[2.3, 0.24, 2.6]} />
            <primitive object={materials.armorDark} attach="material" />
          </mesh>
          <mesh position={[1.15, 0.45, 0.35]} rotation={[0, -0.22, 0]}>
            <boxGeometry args={[1.8, 0.1, 1.7]} />
            <primitive object={materials.trim} attach="material" />
          </mesh>
          {[0, 1, 2].map((line) => (
            <mesh key={line} position={[0.24 + line * 0.22, 0.19, -4.8 + line * 0.45]}>
              <boxGeometry args={[0.055, 0.035, 0.42]} />
              <primitive object={materials.cyan} attach="material" />
            </mesh>
          ))}
          <mesh position={[7.85, 0.16, -1.35]}>
            <boxGeometry args={[0.12, 0.07, 0.52]} />
            <primitive object={materials.cyan} attach="material" />
          </mesh>
          {/* Rear propulsion pods with restrained inset engine glow */}
          <mesh position={[3.15, -0.15, 2.35]}>
            <boxGeometry args={[1.55, 1.15, 3.75]} />
            <primitive object={materials.armorDark} attach="material" />
          </mesh>
          <mesh position={[3.15, -0.15, 4.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.68, 0.78, 0.58, 12]} />
            <primitive object={materials.trim} attach="material" />
          </mesh>
          <mesh position={[3.15, -0.15, 4.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.43, 0.46, 0.08, 12]} />
            <primitive object={materials.engine} attach="material" />
          </mesh>
          <mesh position={[3.95, 0.5, 1.5]} rotation={[0, 0, -0.22]}>
            <boxGeometry args={[0.48, 1.35, 1.7]} />
            <primitive object={materials.hull} attach="material" />
          </mesh>
        </group>
      ))}
      {/* Raised forward observation canopy */}
      <mesh position={[0, 0.68, -2.05]} scale={[1.0, 0.54, 2.05]}>
        <sphereGeometry args={[1, 16, 12]} />
        <primitive object={materials.canopy} attach="material" />
      </mesh>
      <mesh position={[0, 1.0, -2.5]}>
        <boxGeometry args={[0.08, 0.06, 3.2]} />
        <primitive object={materials.trim} attach="material" />
      </mesh>
      <mesh position={[0, 0.3, -0.35]}>
        <boxGeometry args={[1.8, 0.16, 2.2]} />
        <primitive object={materials.armor} attach="material" />
      </mesh>
      {/* Aft fins, service hatches and hull navigation lamps */}
      {[-1, 1].map((side) => (
        <React.Fragment key={`aft-${side}`}>
          <mesh position={[side * 1.35, 0.18, 4.7]} rotation={[0, side * 0.16, side * -0.22]}>
            <boxGeometry args={[0.5, 0.7, 2.2]} />
            <primitive object={materials.armor} attach="material" />
          </mesh>
          <mesh position={[side * 0.48, 0.18, 0.75]}>
            <boxGeometry args={[0.42, 0.035, 0.68]} />
            <primitive object={materials.amber} attach="material" />
          </mesh>
        </React.Fragment>
      ))}
      <mesh position={[0, 0.33, 5.05]}>
        <boxGeometry args={[1.0, 0.18, 1.15]} />
        <primitive object={materials.armorDark} attach="material" />
      </mesh>
    </group>
  );
};
