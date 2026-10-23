import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DestinationId } from './destinations';
import {
  getFloorPanelTexture,
  getWallPanelTexture,
  getCeilingPanelTexture,
  getConsoleScreenTexture,
} from './proceduralTextures';

interface SpaceshipInteriorProps {
  activeDestination: DestinationId;
  onSelectDestination: (dest: DestinationId) => void;
  onSelectProject?: (projectId: string) => void;
  reducedMotion?: boolean;
}

export const SpaceshipInterior: React.FC<SpaceshipInteriorProps> = ({
  activeDestination,
  onSelectDestination,
  onSelectProject,
  reducedMotion,
}) => {
  const coreReactorRef = useRef<THREE.Group>(null);
  const coreRing1Ref = useRef<THREE.Mesh>(null);
  const coreRing2Ref = useRef<THREE.Mesh>(null);
  const astrometricGlobeRef = useRef<THREE.Group>(null);
  const radarSweepRef = useRef<THREE.Mesh>(null);
  const comBeaconRef = useRef<THREE.Mesh>(null);
  const novaDockRef = useRef<THREE.Mesh>(null);

  // Reusable PBR and Emissive Materials
  const materials = useMemo(() => {
    const floorTex = getFloorPanelTexture();
    const wallTex = getWallPanelTexture();
    const ceilingTex = getCeilingPanelTexture();
    const flightScreen = getConsoleScreenTexture('primary_flight_display');
    const orbitScreen = getConsoleScreenTexture('orbital_trajectory');
    const shieldsScreen = getConsoleScreenTexture('shields_and_hull');
    const starmapScreen = getConsoleScreenTexture('nav_starmap');
    const radarScreen = getConsoleScreenTexture('radar');
    const codeScreen = getConsoleScreenTexture('code');

    return {
      metallicFloor: new THREE.MeshStandardMaterial({
        map: floorTex,
        roughness: 0.52,
        metalness: 0.62,
        color: '#c2d1e8',
      }),
      walkwayPlates: new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 0.68,
        color: '#283750',
      }),
      bulkheadWall: new THREE.MeshStandardMaterial({
        map: wallTex,
        roughness: 0.58,
        metalness: 0.62,
        color: '#b2c4e0',
      }),
      darkStructuralSteel: new THREE.MeshStandardMaterial({
        color: '#26354c',
        roughness: 0.48,
        metalness: 0.68,
      }),
      titaniumTrim: new THREE.MeshStandardMaterial({
        color: '#405572',
        roughness: 0.4,
        metalness: 0.72,
      }),
      ceilingPlates: new THREE.MeshStandardMaterial({
        map: ceilingTex,
        color: '#8da2c4',
        roughness: 0.56,
        metalness: 0.58,
      }),
      windowMullion: new THREE.MeshStandardMaterial({
        color: '#273b58',
        roughness: 0.38,
        metalness: 0.72,
      }),
      windowGlass: new THREE.MeshPhysicalMaterial({
        color: '#0a192f',
        transparent: true,
        opacity: 0.12,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.8,
      }),
      neonCyan: new THREE.MeshStandardMaterial({
        color: '#00f2fe',
        emissive: '#00f2fe',
        emissiveIntensity: 2.6,
        roughness: 0.1,
      }),
      neonBlue: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 2.2,
      }),
      neonViolet: new THREE.MeshStandardMaterial({
        color: '#a855f7',
        emissive: '#7e22ce',
        emissiveIntensity: 2.4,
      }),
      neonEmerald: new THREE.MeshStandardMaterial({
        color: '#34d399',
        emissive: '#059669',
        emissiveIntensity: 2.2,
      }),
      hazardStripe: new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.4,
        metalness: 0.3,
      }),
      screenFlight: new THREE.MeshBasicMaterial({ map: flightScreen }),
      screenOrbit: new THREE.MeshBasicMaterial({ map: orbitScreen }),
      screenShields: new THREE.MeshBasicMaterial({ map: shieldsScreen }),
      screenStarmap: new THREE.MeshBasicMaterial({ map: starmapScreen }),
      screenRadar: new THREE.MeshBasicMaterial({ map: radarScreen }),
      screenCode: new THREE.MeshBasicMaterial({ map: codeScreen }),
      hologramCyan: new THREE.MeshBasicMaterial({
        color: '#00f2fe',
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
      hologramWire: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.75,
        wireframe: true,
      }),
    };
  }, []);

  // Animation ticks
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (coreReactorRef.current && !reducedMotion) {
      if (coreRing1Ref.current) {
        coreRing1Ref.current.rotation.x += delta * 1.4;
        coreRing1Ref.current.rotation.y += delta * 0.9;
      }
      if (coreRing2Ref.current) {
        coreRing2Ref.current.rotation.y -= delta * 1.5;
        coreRing2Ref.current.rotation.z += delta * 1.0;
      }
    }

    if (astrometricGlobeRef.current && !reducedMotion) {
      astrometricGlobeRef.current.rotation.y += delta * 0.4;
      astrometricGlobeRef.current.rotation.x = Math.sin(time * 0.5) * 0.15;
    }

    if (radarSweepRef.current && !reducedMotion) {
      radarSweepRef.current.rotation.z -= delta * 2.8;
    }

    if (comBeaconRef.current) {
      const pulse = 1.0 + Math.sin(time * 4) * 0.25;
      comBeaconRef.current.scale.set(pulse, pulse, pulse);
    }

    if (novaDockRef.current) {
      const dockPulse = 0.95 + Math.sin(time * 3) * 0.08;
      novaDockRef.current.scale.set(dockPulse, 1, dockPulse);
    }
  });

  return (
    <group name="spaceship-interior">
      {/* =========================================================================
          PANORAMIC SPACESHIP COCKPIT (THE STAR BRIDGE ARCHITECTURE)
          Spans z = 9 to z = -20. Width = 18.4m. Height = 5.3m
          ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* 1. CONTINUOUS METALLIC FLOOR WITH CENTRAL WALKWAY */}
        <group position={[0, 0, 0]}>
          {/* Main Metallic Floor Plate spanning full cockpit */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.05, -5]}
            material={materials.metallicFloor}
            receiveShadow
          >
            <planeGeometry args={[18.4, 30]} />
          </mesh>

          {/* Elevated Central Walkway running forward to panoramic window */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.12, -5]}
            material={materials.walkwayPlates}
          >
            <planeGeometry args={[3.4, 30]} />
          </mesh>

          {/* Recessed Cyan Glowing Floor Edge Strips along Central Walkway */}
          <mesh position={[-1.75, 0.14, -5]} material={materials.neonCyan}>
            <boxGeometry args={[0.08, 0.02, 30]} />
          </mesh>
          <mesh position={[1.75, 0.14, -5]} material={materials.neonCyan}>
            <boxGeometry args={[0.08, 0.02, 30]} />
          </mesh>

          {/* Stepped Command Dais Floor Tier approaching the forward console */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.22, -14]}
            material={materials.darkStructuralSteel}
          >
            <boxGeometry args={[14, 9, 0.15]} />
          </mesh>
          <mesh position={[0, 0.31, -9.5]} material={materials.neonCyan}>
            <boxGeometry args={[13.8, 0.04, 0.08]} />
          </mesh>

          {/* Outer Perimeter Floor Hazard Markings */}
          <mesh position={[-8.8, 0.14, -5]} material={materials.hazardStripe}>
            <boxGeometry args={[0.15, 0.02, 28]} />
          </mesh>
          <mesh position={[8.8, 0.14, -5]} material={materials.hazardStripe}>
            <boxGeometry args={[0.15, 0.02, 28]} />
          </mesh>
        </group>

        {/* 2. THE MASSIVE PANORAMIC FRONT WINDOW (THE CENTERPIECE) */}
        {/* Forward boundary: z = -18.5 to -20. Spans x = -9.2 to +9.2 */}
        <group position={[0, 0, -19]}>
          {/* A. Center Main Viewport Pane */}
          <group position={[0, 3.1, 0]}>
            {/* Center Window Glass */}
            <mesh material={materials.windowGlass}>
              <boxGeometry args={[7.6, 4.0, 0.05]} />
            </mesh>
            {/* Top Visor Frame Overhang */}
            <mesh position={[0, 2.2, 0.3]} material={materials.windowMullion}>
              <boxGeometry args={[7.8, 0.65, 0.8]} />
            </mesh>
            <mesh position={[0, 1.85, 0.42]} material={materials.neonCyan}>
              <boxGeometry args={[7.6, 0.06, 0.06]} />
            </mesh>
            {/* Bottom Sill Frame Beam */}
            <mesh position={[0, -2.15, 0.25]} material={materials.windowMullion}>
              <boxGeometry args={[7.8, 0.55, 0.7]} />
            </mesh>
            <mesh position={[0, -1.85, 0.38]} material={materials.neonCyan}>
              <boxGeometry args={[7.6, 0.06, 0.06]} />
            </mesh>
            {/* Center Vertical Struts (Sub-panes) */}
            <mesh position={[-2.5, 0, 0.1]} material={materials.windowMullion}>
              <boxGeometry args={[0.25, 4.2, 0.5]} />
            </mesh>
            <mesh position={[2.5, 0, 0.1]} material={materials.windowMullion}>
              <boxGeometry args={[0.25, 4.2, 0.5]} />
            </mesh>
          </group>

          {/* B. Left Angled Panoramic Viewport Pane */}
          <group position={[-6.2, 3.1, 0.9]} rotation={[0, 0.38, 0]}>
            <mesh material={materials.windowGlass}>
              <boxGeometry args={[5.5, 4.0, 0.05]} />
            </mesh>
            <mesh position={[0, 2.2, 0.3]} material={materials.windowMullion}>
              <boxGeometry args={[5.7, 0.65, 0.8]} />
            </mesh>
            <mesh position={[0, 1.85, 0.42]} material={materials.neonCyan}>
              <boxGeometry args={[5.5, 0.06, 0.06]} />
            </mesh>
            <mesh position={[0, -2.15, 0.25]} material={materials.windowMullion}>
              <boxGeometry args={[5.7, 0.55, 0.7]} />
            </mesh>
            <mesh position={[-0.8, 0, 0.1]} material={materials.windowMullion}>
              <boxGeometry args={[0.25, 4.2, 0.5]} />
            </mesh>
          </group>

          {/* C. Right Angled Panoramic Viewport Pane */}
          <group position={[6.2, 3.1, 0.9]} rotation={[0, -0.38, 0]}>
            <mesh material={materials.windowGlass}>
              <boxGeometry args={[5.5, 4.0, 0.05]} />
            </mesh>
            <mesh position={[0, 2.2, 0.3]} material={materials.windowMullion}>
              <boxGeometry args={[5.7, 0.65, 0.8]} />
            </mesh>
            <mesh position={[0, 1.85, 0.42]} material={materials.neonCyan}>
              <boxGeometry args={[5.5, 0.06, 0.06]} />
            </mesh>
            <mesh position={[0, -2.15, 0.25]} material={materials.windowMullion}>
              <boxGeometry args={[5.7, 0.55, 0.7]} />
            </mesh>
            <mesh position={[0.8, 0, 0.1]} material={materials.windowMullion}>
              <boxGeometry args={[0.25, 4.2, 0.5]} />
            </mesh>
          </group>

          {/* Heavy Structural Joint Pillars separating center and side panes */}
          <mesh position={[-3.85, 3.1, 0.35]} material={materials.titaniumTrim}>
            <boxGeometry args={[0.7, 4.8, 0.9]} />
          </mesh>
          <mesh position={[3.85, 3.1, 0.35]} material={materials.titaniumTrim}>
            <boxGeometry args={[0.7, 4.8, 0.9]} />
          </mesh>
        </group>

        {/* 3. SUBSTANTIAL ANGLED STRUCTURAL SUPPORTS (LEFT & RIGHT) */}
        {/* Massive A-Frame Buttresses framing the panoramic view */}
        {/* Left Angled Structural Support */}
        <group position={[-7.5, 2.7, -13.5]}>
          {/* Main Diagonal Truss Beam */}
          <mesh rotation={[0.2, 0, -0.28]} position={[0, 0, 0]} material={materials.darkStructuralSteel}>
            <boxGeometry args={[0.65, 5.8, 0.8]} />
          </mesh>
          {/* Layered Titanium Reinforcement Rib */}
          <mesh rotation={[0.2, 0, -0.28]} position={[0.15, 0, 0]} material={materials.titaniumTrim}>
            <boxGeometry args={[0.3, 5.4, 0.85]} />
          </mesh>
          {/* Cyan Emissive Edge Lighting Strip */}
          <mesh rotation={[0.2, 0, -0.28]} position={[0.4, 0, 0.35]} material={materials.neonCyan}>
            <boxGeometry args={[0.06, 5.6, 0.06]} />
          </mesh>
          {/* Heavy Floor Anchor Bracket */}
          <mesh position={[-0.4, -2.4, 0]} material={materials.titaniumTrim}>
            <boxGeometry args={[1.2, 0.6, 1.4]} />
          </mesh>
        </group>

        {/* Right Angled Structural Support */}
        <group position={[7.5, 2.7, -13.5]}>
          <mesh rotation={[0.2, 0, 0.28]} position={[0, 0, 0]} material={materials.darkStructuralSteel}>
            <boxGeometry args={[0.65, 5.8, 0.8]} />
          </mesh>
          <mesh rotation={[0.2, 0, 0.28]} position={[-0.15, 0, 0]} material={materials.titaniumTrim}>
            <boxGeometry args={[0.3, 5.4, 0.85]} />
          </mesh>
          <mesh rotation={[0.2, 0, 0.28]} position={[-0.4, 0, 0.35]} material={materials.neonCyan}>
            <boxGeometry args={[0.06, 5.6, 0.06]} />
          </mesh>
          <mesh position={[0.4, -2.4, 0]} material={materials.titaniumTrim}>
            <boxGeometry args={[1.2, 0.6, 1.4]} />
          </mesh>
        </group>

        {/* 4. CONTINUOUS METALLIC SIDE WALLS */}
        {/* Left Cockpit Wall (x = -9.2) */}
        <group position={[-9.2, 2.7, -5]} rotation={[0, Math.PI / 2, 0]}>
          <mesh material={materials.bulkheadWall}>
            <planeGeometry args={[26, 5.4]} />
          </mesh>
          {/* Structural Pilaster Columns every 4m */}
          {[-10, -6, -2, 2, 6, 10].map((px, idx) => (
            <mesh key={idx} position={[px, 0, 0.25]} material={materials.darkStructuralSteel}>
              <boxGeometry args={[0.6, 5.4, 0.4]} />
            </mesh>
          ))}
          {/* Horizontal Cyan Accent Strips */}
          <mesh position={[0, -1.2, 0.22]} material={materials.neonCyan}>
            <boxGeometry args={[26, 0.08, 0.06]} />
          </mesh>
          <mesh position={[0, 1.6, 0.22]} material={materials.neonCyan}>
            <boxGeometry args={[26, 0.08, 0.06]} />
          </mesh>
          {/* Embedded Tactical Displays along Wall */}
          <mesh position={[-4, 0.2, 0.22]} material={materials.screenFlight}>
            <planeGeometry args={[2.8, 1.4]} />
          </mesh>
          <mesh position={[4, 0.2, 0.22]} material={materials.screenOrbit}>
            <planeGeometry args={[2.8, 1.4]} />
          </mesh>
          {/* Slanted Workstation Desk along Wall */}
          <mesh position={[0, -1.3, 0.65]} rotation={[-0.32, 0, 0]} material={materials.darkStructuralSteel}>
            <boxGeometry args={[22, 0.1, 0.8]} />
          </mesh>
        </group>

        {/* Right Cockpit Wall (x = +9.2) */}
        <group position={[9.2, 2.7, -5]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh material={materials.bulkheadWall}>
            <planeGeometry args={[26, 5.4]} />
          </mesh>
          {[-10, -6, -2, 2, 6, 10].map((px, idx) => (
            <mesh key={idx} position={[px, 0, 0.25]} material={materials.darkStructuralSteel}>
              <boxGeometry args={[0.6, 5.4, 0.4]} />
            </mesh>
          ))}
          <mesh position={[0, -1.2, 0.22]} material={materials.neonCyan}>
            <boxGeometry args={[26, 0.08, 0.06]} />
          </mesh>
          <mesh position={[0, 1.6, 0.22]} material={materials.neonCyan}>
            <boxGeometry args={[26, 0.08, 0.06]} />
          </mesh>
          <mesh position={[-4, 0.2, 0.22]} material={materials.screenShields}>
            <planeGeometry args={[2.8, 1.4]} />
          </mesh>
          <mesh position={[4, 0.2, 0.22]} material={materials.screenStarmap}>
            <planeGeometry args={[2.8, 1.4]} />
          </mesh>
          <mesh position={[0, -1.3, 0.65]} rotation={[-0.32, 0, 0]} material={materials.darkStructuralSteel}>
            <boxGeometry args={[22, 0.1, 0.8]} />
          </mesh>
        </group>

        {/* Rear Cockpit Bulkhead Wall (z = +8.5) with Open Corridor Portals */}
        <group position={[0, 2.7, 8.5]}>
          <mesh material={materials.bulkheadWall}>
            <boxGeometry args={[18.4, 5.4, 0.6]} />
          </mesh>
          <mesh position={[0, 0, -0.32]} material={materials.darkStructuralSteel}>
            <boxGeometry args={[5.2, 4.2, 0.2]} />
          </mesh>
          <mesh position={[0, 1.9, -0.35]} material={materials.neonCyan}>
            <boxGeometry args={[5.0, 0.08, 0.06]} />
          </mesh>
        </group>

        {/* 5. MECHANICALLY DETAILED CEILING WITH REPEATING MODULES */}
        <group position={[0, 5.3, -5]}>
          {/* Main Ceiling Deck Plates */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceilingPlates}>
            <planeGeometry args={[18.4, 30]} />
          </mesh>
          {/* Heavy Repeating Transverse Structural Arch Beams every 4m */}
          {[-12, -8, -4, 0, 4, 8].map((cz, idx) => (
            <group key={idx} position={[0, -0.3, cz]}>
              <mesh material={materials.darkStructuralSteel}>
                <boxGeometry args={[18.4, 0.6, 0.5]} />
              </mesh>
              <mesh position={[0, -0.32, 0]} material={materials.titaniumTrim}>
                <boxGeometry args={[18.2, 0.1, 0.4]} />
              </mesh>
            </group>
          ))}
          {/* Center Longitudinal Conduit Channel carrying Power & Recessed Lighting */}
          <mesh position={[0, -0.35, 0]} material={materials.titaniumTrim}>
            <boxGeometry args={[2.8, 0.4, 28]} />
          </mesh>
          {/* Recessed Linear Cyan LED Light Strips along Ceiling */}
          <mesh position={[-0.9, -0.52, 0]} material={materials.neonCyan}>
            <boxGeometry args={[0.12, 0.05, 27]} />
          </mesh>
          <mesh position={[0.9, -0.52, 0]} material={materials.neonCyan}>
            <boxGeometry args={[0.12, 0.05, 27]} />
          </mesh>
        </group>

        {/* 6. CONTROL CONSOLES */}
        {/* A. Forward Panoramic Cockpit Consoles (Directly under the front window) */}
        <group position={[0, 0.85, -17.5]}>
          {/* Center Helm Desk */}
          <mesh material={materials.darkStructuralSteel}>
            <boxGeometry args={[7.2, 0.9, 1.4]} />
          </mesh>
          {/* Slanted Display Console Surface (~30 deg angle) */}
          <mesh position={[0, 0.52, 0.1]} rotation={[-0.52, 0, 0]} material={materials.titaniumTrim}>
            <boxGeometry args={[7.0, 0.1, 1.3]} />
          </mesh>
          {/* 4 Multi-Screen Flight Monitors on Center Console */}
          <mesh position={[-2.4, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenFlight}>
            <planeGeometry args={[1.5, 0.7]} />
          </mesh>
          <mesh position={[-0.8, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenOrbit}>
            <planeGeometry args={[1.5, 0.7]} />
          </mesh>
          <mesh position={[0.8, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenShields}>
            <planeGeometry args={[1.5, 0.7]} />
          </mesh>
          <mesh position={[2.4, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenStarmap}>
            <planeGeometry args={[1.5, 0.7]} />
          </mesh>
          {/* Tactile Illuminated Keyboard Row */}
          <mesh position={[0, 0.58, 0.55]} rotation={[-0.52, 0, 0]} material={materials.neonCyan}>
            <boxGeometry args={[6.2, 0.02, 0.22]} />
          </mesh>

          {/* Left Angled Wing Console */}
          <group position={[-5.4, 0, 0.8]} rotation={[0, 0.38, 0]}>
            <mesh material={materials.darkStructuralSteel}>
              <boxGeometry args={[4.2, 0.9, 1.4]} />
            </mesh>
            <mesh position={[0, 0.52, 0.1]} rotation={[-0.52, 0, 0]} material={materials.titaniumTrim}>
              <boxGeometry args={[4.0, 0.1, 1.3]} />
            </mesh>
            <mesh position={[-1.0, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenRadar}>
              <planeGeometry args={[1.6, 0.7]} />
            </mesh>
            <mesh position={[1.0, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenCode}>
              <planeGeometry args={[1.6, 0.7]} />
            </mesh>
          </group>

          {/* Right Angled Wing Console */}
          <group position={[5.4, 0, 0.8]} rotation={[0, -0.38, 0]}>
            <mesh material={materials.darkStructuralSteel}>
              <boxGeometry args={[4.2, 0.9, 1.4]} />
            </mesh>
            <mesh position={[0, 0.52, 0.1]} rotation={[-0.52, 0, 0]} material={materials.titaniumTrim}>
              <boxGeometry args={[4.0, 0.1, 1.3]} />
            </mesh>
            <mesh position={[-1.0, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenFlight}>
              <planeGeometry args={[1.6, 0.7]} />
            </mesh>
            <mesh position={[1.0, 0.75, 0.15]} rotation={[-0.52, 0, 0]} material={materials.screenOrbit}>
              <planeGeometry args={[1.6, 0.7]} />
            </mesh>
          </group>
        </group>

        {/* B. Central Navigation Console (Primary Focal Point Inside Cockpit) */}
        {/* Positioned at (0, 0.9, -8.5): Captain's Command Station & About Me Display */}
        <group
          position={[0, 0.85, -8.5]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectDestination('about');
          }}
        >
          {/* Octagonal Command Desk Base */}
          <mesh material={materials.darkStructuralSteel}>
            <cylinderGeometry args={[2.0, 2.3, 0.9, 16]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.titaniumTrim}>
            <ringGeometry args={[1.6, 2.05, 16]} />
          </mesh>
          <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.neonCyan}>
            <ringGeometry args={[1.75, 1.88, 32]} />
          </mesh>

          {/* Dual Captain's Telemetry Screens */}
          <mesh position={[-0.9, 0.65, 0.8]} rotation={[-0.38, 0, 0]} material={materials.screenRadar}>
            <planeGeometry args={[0.9, 0.45]} />
          </mesh>
          <mesh position={[0.9, 0.65, 0.8]} rotation={[-0.38, 0, 0]} material={materials.screenCode}>
            <planeGeometry args={[0.9, 0.45]} />
          </mesh>

          {/* Interactive Profile Hologram Pedestal */}
          <mesh position={[0, 0.6, 0]} material={materials.neonCyan}>
            <cylinderGeometry args={[0.45, 0.55, 0.08, 24]} />
          </mesh>
          {/* Floating Command Hologram Badge & Radar Sweep */}
          <group position={[0, 1.55, 0]}>
            <mesh material={materials.hologramCyan}>
              <ringGeometry args={[0.48, 0.56, 32]} />
            </mesh>
            <mesh ref={radarSweepRef} material={materials.neonCyan}>
              <ringGeometry args={[0.1, 0.46, 32, 1, 0, 1.3]} />
            </mesh>
          </group>
        </group>

        {/* C. Dedicated NOVA Docking Pad at [2.2, 0, 1.8] */}
        <group position={[2.2, 0, 1.8]}>
          <mesh
            ref={novaDockRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.14, 0]}
            material={materials.neonCyan}
          >
            <ringGeometry args={[0.65, 0.95, 32]} />
          </mesh>
          <mesh position={[0, 0.07, 0]} material={materials.darkStructuralSteel}>
            <cylinderGeometry args={[0.65, 0.8, 0.14, 24]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.48, 0]} material={materials.hologramCyan}>
            <ringGeometry args={[0.38, 0.44, 24]} />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          DESTINATION 2: ENGINEERING BAY (DECK 2 - FEATURED PROJECTS)
          Starboard Sector: x = 18.5, y = 0, z = 0
          ========================================================================= */}
      <group position={[18.5, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} material={materials.metallicFloor} receiveShadow>
          <boxGeometry args={[15, 17, 0.3]} />
        </mesh>
        <group position={[7.4, 2.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[17, 5.6, 0.6]} /></mesh>
          <mesh position={[0, 0.2, 0.32]} material={materials.screenCode}><planeGeometry args={[6.5, 2.2]} /></mesh>
        </group>
        <group position={[0, 2.8, -8.4]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[15, 5.6, 0.6]} /></mesh>
          <mesh position={[0, 0, 0.32]} material={materials.screenFlight}><planeGeometry args={[4.5, 1.8]} /></mesh>
        </group>
        <group position={[0, 2.8, 8.4]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[15, 5.6, 0.6]} /></mesh>
          <mesh position={[0, 0, -0.32]} rotation={[0, Math.PI, 0]} material={materials.screenRadar}><planeGeometry args={[4.5, 1.8]} /></mesh>
        </group>
        <group position={[0, 5.4, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceilingPlates}><planeGeometry args={[15, 17]} /></mesh>
          <mesh position={[0, -0.4, 0]} material={materials.darkStructuralSteel}><boxGeometry args={[0.8, 0.8, 16.8]} /></mesh>
        </group>

        {/* 4 Interactive Holographic Project Blueprints */}
        {/* Project 1: AgriChain */}
        <group position={[-3.2, 0, -4.2]} onClick={(e) => { e.stopPropagation(); if (onSelectProject) onSelectProject('agrichain'); onSelectDestination('projects'); }}>
          <mesh position={[0, 0.7, 0]} material={materials.darkStructuralSteel}><boxGeometry args={[2.2, 1.4, 1.2]} /></mesh>
          <mesh position={[0, 1.35, -0.2]} rotation={[-0.3, 0, 0]} material={materials.screenCode}><planeGeometry args={[1.8, 0.8]} /></mesh>
          <mesh position={[0, 1.45, 0.2]} rotation={[-Math.PI / 2, 0, 0]} material={materials.neonCyan}><ringGeometry args={[0.45, 0.65, 24]} /></mesh>
          <group position={[0, 2.4, 0.2]}><mesh material={materials.hologramCyan}><octahedronGeometry args={[0.55]} /></mesh><mesh material={materials.hologramWire} scale={[1.25, 1.25, 1.25]}><octahedronGeometry args={[0.55]} /></mesh></group>
        </group>
        {/* Project 2: Expense Tracker */}
        <group position={[3.2, 0, -4.2]} onClick={(e) => { e.stopPropagation(); if (onSelectProject) onSelectProject('expense-tracker'); onSelectDestination('projects'); }}>
          <mesh position={[0, 0.7, 0]} material={materials.darkStructuralSteel}><boxGeometry args={[2.2, 1.4, 1.2]} /></mesh>
          <mesh position={[0, 1.35, -0.2]} rotation={[-0.3, 0, 0]} material={materials.screenOrbit}><planeGeometry args={[1.8, 0.8]} /></mesh>
          <mesh position={[0, 1.45, 0.2]} rotation={[-Math.PI / 2, 0, 0]} material={materials.neonBlue}><ringGeometry args={[0.45, 0.65, 24]} /></mesh>
          <group position={[0, 2.4, 0.2]}><mesh material={materials.neonBlue}><boxGeometry args={[0.7, 0.7, 0.7]} /></mesh><mesh material={materials.hologramWire} scale={[1.2, 1.2, 1.2]}><boxGeometry args={[0.7, 0.7, 0.7]} /></mesh></group>
        </group>
        {/* Project 3: Crictally */}
        <group position={[-3.2, 0, 4.2]} onClick={(e) => { e.stopPropagation(); if (onSelectProject) onSelectProject('crictally'); onSelectDestination('projects'); }}>
          <mesh position={[0, 0.7, 0]} material={materials.darkStructuralSteel}><boxGeometry args={[2.2, 1.4, 1.2]} /></mesh>
          <mesh position={[0, 1.35, -0.2]} rotation={[-0.3, 0, 0]} material={materials.screenRadar}><planeGeometry args={[1.8, 0.8]} /></mesh>
          <mesh position={[0, 1.45, 0.2]} rotation={[-Math.PI / 2, 0, 0]} material={materials.neonViolet}><ringGeometry args={[0.45, 0.65, 24]} /></mesh>
          <group position={[0, 2.4, 0.2]}><mesh material={materials.neonViolet}><sphereGeometry args={[0.48, 16, 16]} /></mesh><mesh material={materials.hologramWire} scale={[1.25, 1.25, 1.25]}><sphereGeometry args={[0.48, 12, 12]} /></mesh></group>
        </group>
        {/* Project 4: Pet Adoption Portal */}
        <group position={[3.2, 0, 4.2]} onClick={(e) => { e.stopPropagation(); if (onSelectProject) onSelectProject('pet-adoption-portal'); onSelectDestination('projects'); }}>
          <mesh position={[0, 0.7, 0]} material={materials.darkStructuralSteel}><boxGeometry args={[2.2, 1.4, 1.2]} /></mesh>
          <mesh position={[0, 1.35, -0.2]} rotation={[-0.3, 0, 0]} material={materials.screenShields}><planeGeometry args={[1.8, 0.8]} /></mesh>
          <mesh position={[0, 1.45, 0.2]} rotation={[-Math.PI / 2, 0, 0]} material={materials.neonEmerald}><ringGeometry args={[0.45, 0.65, 24]} /></mesh>
          <group position={[0, 2.4, 0.2]}><mesh material={materials.neonEmerald}><coneGeometry args={[0.5, 0.85, 6]} /></mesh></group>
        </group>
      </group>

      {/* =========================================================================
          DESTINATION 3: SHIP'S CORE (DECK 3 - TECHNICAL SKILLS)
          Sub-Level Reactor: x = 0, y = -1.6, z = -2.5
          ========================================================================= */}
      <group position={[0, -1.6, -2.5]} ref={coreReactorRef} onClick={(e) => { e.stopPropagation(); onSelectDestination('skills'); }}>
        {/* Dedicated reactor chamber: open floor perimeter and high structural shell */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.35, 0]} material={materials.metallicFloor} receiveShadow>
          <planeGeometry args={[17, 17]} />
        </mesh>
        <mesh position={[0, 7.25, 0]} material={materials.ceilingPlates}>
          <boxGeometry args={[17, 0.35, 17]} />
        </mesh>
        {[-1, 1].map((side) => (
          <React.Fragment key={side}>
            <mesh position={[side * 8.35, 1.9, 0]} material={materials.darkStructuralSteel}>
              <boxGeometry args={[0.45, 10.2, 17]} />
            </mesh>
            <mesh position={[side * 8.08, 3.2, 0]} rotation={[0, side * Math.PI / 2, 0]} material={materials.screenCode}>
              <planeGeometry args={[5.2, 2.1]} />
            </mesh>
            <mesh position={[0, 1.9, side * 8.35]} material={materials.darkStructuralSteel}>
              <boxGeometry args={[17, 10.2, 0.45]} />
            </mesh>
          </React.Fragment>
        ))}
        {[-6.8, 6.8].map((x) => (
          <mesh key={x} position={[x, -2.95, 0]} material={materials.neonCyan}>
            <boxGeometry args={[0.045, 0.025, 15.8]} />
          </mesh>
        ))}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
          <mesh key={`reactor-foot-${angle}`} position={[Math.cos(angle) * 3.35, -2.25, Math.sin(angle) * 3.35]} material={materials.titaniumTrim}>
            <cylinderGeometry args={[0.28, 0.42, 2.1, 8]} />
          </mesh>
        ))}
        <mesh position={[0, -0.6, 0]} material={materials.darkStructuralSteel}><cylinderGeometry args={[3.8, 4.2, 2.0, 16, 1, true]} /></mesh>
        <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.metallicFloor}><circleGeometry args={[4.2, 16]} /></mesh>

        {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((ang, idx) => {
          const px = Math.sin(ang) * 4.6;
          const pz = Math.cos(ang) * 4.6;
          return (
            <group key={idx} position={[px, 1.8, pz]}>
              <mesh material={materials.titaniumTrim}><boxGeometry args={[0.6, 6.8, 0.6]} /></mesh>
              <mesh position={[0, 0, 0.32]} material={materials.neonViolet}><boxGeometry args={[0.08, 6.4, 0.08]} /></mesh>
            </group>
          );
        })}

        <mesh position={[0, 0.6, 0]} material={materials.darkStructuralSteel}><cylinderGeometry args={[1.18, 1.3, 2.5, 12]} /></mesh>
        <mesh position={[0, 1.87, 0]} material={materials.titaniumTrim}><cylinderGeometry args={[1.38, 1.18, 0.28, 12]} /></mesh>
        <mesh position={[0, -0.67, 0]} material={materials.titaniumTrim}><cylinderGeometry args={[1.18, 1.38, 0.28, 12]} /></mesh>
        <mesh position={[0, 0.6, 0]} material={materials.neonBlue}><sphereGeometry args={[0.82, 28, 24]} /></mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
          const angle = (index / 8) * Math.PI * 2;
          return (
            <mesh key={`reactor-rod-${index}`} position={[Math.cos(angle) * 1.18, 0.6, Math.sin(angle) * 1.18]} material={index % 2 ? materials.titaniumTrim : materials.neonCyan}>
              <boxGeometry args={[0.12, 1.5, 0.12]} />
            </mesh>
          );
        })}
        <mesh ref={coreRing1Ref} position={[0, 0.6, 0]} material={materials.neonCyan}><torusGeometry args={[2.0, 0.08, 12, 36]} /></mesh>
        <mesh ref={coreRing2Ref} position={[0, 0.6, 0]} material={materials.neonBlue}><torusGeometry args={[2.7, 0.09, 12, 36]} /></mesh>

        {/* 5 Orbital Skill Nodes */}
        {[
          { color: materials.neonCyan, angle: 0, label: 'Backend' },
          { color: materials.neonBlue, angle: (Math.PI * 2) / 5, label: 'Databases' },
          { color: materials.neonViolet, angle: (Math.PI * 4) / 5, label: 'Frontend' },
          { color: materials.neonEmerald, angle: (Math.PI * 6) / 5, label: 'AI' },
          { color: materials.neonCyan, angle: (Math.PI * 8) / 5, label: 'Infra' },
        ].map((node, i) => {
          const radius = 3.3;
          const nx = Math.cos(node.angle) * radius;
          const nz = Math.sin(node.angle) * radius;
          return (
            <group key={i} position={[nx, 0.6, nz]}>
              <mesh material={node.color}><sphereGeometry args={[0.28, 16, 16]} /></mesh>
              <mesh material={materials.hologramWire} scale={[1.4, 1.4, 1.4]}><sphereGeometry args={[0.28, 10, 10]} /></mesh>
            </group>
          );
        })}
        <pointLight color="#d8f7ff" intensity={68} distance={22} decay={2} position={[0, 6.3, 0]} />
        <pointLight color="#168cff" intensity={32} distance={13} decay={2} position={[0, 1.7, 0]} />
      </group>

      {/* =========================================================================
          DESTINATION 4: NAVIGATION ARCHIVE (DECK 4 - EDUCATION & JOURNEY)
          Port Sector: x = -18.5, y = 0, z = 0
          ========================================================================= */}
      <group position={[-18.5, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} material={materials.metallicFloor} receiveShadow>
          <boxGeometry args={[15, 17, 0.3]} />
        </mesh>
        <group position={[-7.4, 2.7, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[17, 5.4, 0.6]} /></mesh>
          <mesh position={[0, 0, 0.32]} material={materials.windowGlass}><planeGeometry args={[10.5, 3.8]} /></mesh>
        </group>
        <group position={[0, 2.7, -8.4]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[15, 5.4, 0.6]} /></mesh>
          <mesh position={[0, 0, 0.32]} material={materials.screenStarmap}><planeGeometry args={[4.5, 1.8]} /></mesh>
        </group>
        <group position={[0, 2.7, 8.4]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[15, 5.4, 0.6]} /></mesh>
          <mesh position={[0, 0, -0.32]} rotation={[0, Math.PI, 0]} material={materials.screenCode}><planeGeometry args={[4.5, 1.8]} /></mesh>
        </group>
        <group position={[0, 5.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceilingPlates}><planeGeometry args={[15, 17]} /></mesh>
        </group>

        {/* Central Astrometric Starmap Dais */}
        <group position={[0, 0.8, 0]} onClick={(e) => { e.stopPropagation(); onSelectDestination('education'); }}>
          <mesh material={materials.darkStructuralSteel}><cylinderGeometry args={[2.5, 2.8, 1.0, 32]} /></mesh>
          <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.neonCyan}><ringGeometry args={[2.0, 2.3, 32]} /></mesh>
          <group ref={astrometricGlobeRef} position={[0, 2.0, 0]}>
            <mesh material={materials.hologramWire}><sphereGeometry args={[1.3, 20, 20]} /></mesh>
            <mesh material={materials.neonBlue}><sphereGeometry args={[0.3, 16, 16]} /></mesh>
            <mesh material={materials.neonCyan} rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[1.5, 0.025, 8, 36]} /></mesh>
          </group>
        </group>

        {/* Timeline Stelae */}
        {[-3.6, -1.2, 1.2, 3.6].map((pz, idx) => (
          <group key={idx} position={[-4.2, 1.5, pz]}>
            <mesh material={materials.titaniumTrim}><boxGeometry args={[0.5, 2.6, 0.6]} /></mesh>
            <mesh position={[0.26, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.screenFlight}><planeGeometry args={[0.5, 2.2]} /></mesh>
          </group>
        ))}
      </group>

      {/* =========================================================================
          DESTINATION 5: COMMUNICATIONS ROOM (DECK 5 - CONTACT)
          Aft Sector: x = 0, y = 0, z = 17.5
          ========================================================================= */}
      <group position={[0, 0, 17.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} material={materials.metallicFloor} receiveShadow>
          <boxGeometry args={[15, 13, 0.3]} />
        </mesh>
        <group position={[0, 2.6, 6.4]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[15, 5.2, 0.6]} /></mesh>
          <mesh position={[0, 0.2, -0.32]} rotation={[0, Math.PI, 0]} material={materials.screenShields}><planeGeometry args={[6.5, 2.2]} /></mesh>
        </group>
        <group position={[-7.4, 2.6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[13, 5.2, 0.6]} /></mesh>
          <mesh position={[0, 0, 0.32]} material={materials.screenCode}><planeGeometry args={[4.2, 1.6]} /></mesh>
        </group>
        <group position={[7.4, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh material={materials.bulkheadWall}><boxGeometry args={[13, 5.2, 0.6]} /></mesh>
          <mesh position={[0, 0, 0.32]} material={materials.screenRadar}><planeGeometry args={[4.2, 1.6]} /></mesh>
        </group>
        <group position={[0, 5.0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ceilingPlates}><planeGeometry args={[15, 13]} /></mesh>
        </group>

        {/* Quantum Transceiver Station */}
        <group position={[0, 1.1, 1.0]} onClick={(e) => { e.stopPropagation(); onSelectDestination('contact'); }}>
          <mesh material={materials.darkStructuralSteel}><boxGeometry args={[5.8, 1.3, 1.6]} /></mesh>
          <mesh position={[0, 0.66, 0]} material={materials.titaniumTrim}><boxGeometry args={[5.6, 0.1, 1.5]} /></mesh>
          <mesh ref={comBeaconRef} position={[0, 1.7, 0]} material={materials.neonEmerald}><octahedronGeometry args={[0.4]} /></mesh>
          <mesh position={[-1.7, 0.9, 0]} rotation={[-0.3, 0, 0]} material={materials.screenOrbit}><planeGeometry args={[1.5, 0.7]} /></mesh>
          <mesh position={[1.7, 0.9, 0]} rotation={[-0.3, 0, 0]} material={materials.screenFlight}><planeGeometry args={[1.5, 0.7]} /></mesh>
        </group>
      </group>

      {/* =========================================================================
          CONNECTING CORRIDORS WITH PRESSURIZED ARCHES
          ========================================================================= */}
      {/* Starboard Corridor */}
      <group position={[11.5, 2.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} material={materials.metallicFloor}><planeGeometry args={[4.2, 7.5]} /></mesh>
        <mesh position={[-1.8, -2.48, 0]} material={materials.neonBlue}><boxGeometry args={[0.08, 0.02, 7.5]} /></mesh>
        <mesh position={[1.8, -2.48, 0]} material={materials.neonBlue}><boxGeometry args={[0.08, 0.02, 7.5]} /></mesh>
        <mesh position={[-2.1, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.bulkheadWall}><planeGeometry args={[7.5, 5.2]} /></mesh>
        <mesh position={[2.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.bulkheadWall}><planeGeometry args={[7.5, 5.2]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.6, 0]} material={materials.ceilingPlates}><planeGeometry args={[4.2, 7.5]} /></mesh>
      </group>

      {/* Port Corridor */}
      <group position={[-11.5, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} material={materials.metallicFloor}><planeGeometry args={[4.2, 7.5]} /></mesh>
        <mesh position={[-1.8, -2.48, 0]} material={materials.neonViolet}><boxGeometry args={[0.08, 0.02, 7.5]} /></mesh>
        <mesh position={[1.8, -2.48, 0]} material={materials.neonViolet}><boxGeometry args={[0.08, 0.02, 7.5]} /></mesh>
        <mesh position={[-2.1, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.bulkheadWall}><planeGeometry args={[7.5, 5.2]} /></mesh>
        <mesh position={[2.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.bulkheadWall}><planeGeometry args={[7.5, 5.2]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.6, 0]} material={materials.ceilingPlates}><planeGeometry args={[4.2, 7.5]} /></mesh>
      </group>

      {/* Aft Corridor */}
      <group position={[0, 2.6, 11.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} material={materials.metallicFloor}><planeGeometry args={[4.2, 6.0]} /></mesh>
        <mesh position={[-1.8, -2.48, 0]} material={materials.neonEmerald}><boxGeometry args={[0.08, 0.02, 6.0]} /></mesh>
        <mesh position={[1.8, -2.48, 0]} material={materials.neonEmerald}><boxGeometry args={[0.08, 0.02, 6.0]} /></mesh>
        <mesh position={[-2.1, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.bulkheadWall}><planeGeometry args={[6.0, 5.2]} /></mesh>
        <mesh position={[2.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.bulkheadWall}><planeGeometry args={[6.0, 5.2]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.6, 0]} material={materials.ceilingPlates}><planeGeometry args={[4.2, 6.0]} /></mesh>
      </group>

      {/* Dynamic Destination Sector Status Beacon */}
      <pointLight
        color={
          activeDestination === 'about'
            ? '#00f2fe'
            : activeDestination === 'projects'
            ? '#38bdf8'
            : activeDestination === 'skills'
            ? '#a855f7'
            : activeDestination === 'education'
            ? '#818cf8'
            : activeDestination === 'contact'
            ? '#34d399'
            : '#00f2fe'
        }
        intensity={1.8}
        distance={14}
        position={[0, 3.2, -8.5]}
      />
    </group>
  );
};
