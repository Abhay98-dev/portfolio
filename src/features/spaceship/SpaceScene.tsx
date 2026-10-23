import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SpaceEnvironment } from './SpaceEnvironment';
import { SpaceshipInterior } from './SpaceshipInterior';
import { CameraController } from './CameraController';
import { NovaCharacter } from '../nova/NovaCharacter';
import { DestinationId } from './destinations';
import { ExteriorShip } from './ExteriorShip';
import * as THREE from 'three';

interface SpaceSceneProps {
  activeDestination: DestinationId;
  onSelectDestination: (dest: DestinationId) => void;
  onSelectProject?: (projectId: string) => void;
  onNovaClick?: () => void;
  isReducedMotion: boolean;
  onTransitionStart?: () => void;
  onTransitionComplete?: (dest: DestinationId) => void;
  onWebGLError?: () => void;
}

function WebGLSupportCheck(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const SpaceScene: React.FC<SpaceSceneProps> = ({
  activeDestination,
  onSelectDestination,
  onSelectProject,
  onNovaClick,
  isReducedMotion,
  onTransitionStart,
  onTransitionComplete,
  onWebGLError,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    const supported = WebGLSupportCheck();
    if (!supported) {
      setHasWebGL(false);
      if (onWebGLError) onWebGLError();
    }
  }, [onWebGLError]);

  if (!hasWebGL) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
      <Canvas
        camera={{ position: [0, 3.0, 7.2], fov: 56, near: 0.1, far: 600 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#010309', 1);
        }}
      >
        <Suspense fallback={null}>
          {/* 1. Global Hemisphere Light: Soft sky and ground bounce to keep metallic floors and ceiling ribs readable */}
          <hemisphereLight
            color="#476b9e"
            groundColor="#121d33"
            intensity={1.8}
          />

          {/* 2. Soft Ambient Cosmic Base Light */}
          <ambientLight color="#263854" intensity={1.05} />

          {/* 3. Exterior Starlight entering directly through the forward panoramic cockpit windows */}
          <directionalLight
            color="#bae6fd"
            intensity={2.8}
            position={[0, 8, -26]}
            castShadow={false}
          />
          <directionalLight color="#d7e6ff" intensity={2.0} position={[-6, 18, 10]} castShadow={false} />

          {/* 4. Strategic Cockpit & Bridge Downlights */}
          {/* Forward Cockpit Window & Helm Fill Light */}
          <pointLight
            color="#00f2fe"
            intensity={2.0}
            distance={18}
            decay={2}
            position={[0, 3.5, -16]}
          />
          {/* Main Central Cockpit Downlight */}
          <pointLight
            color="#e0f7fa"
            intensity={2.4}
            distance={24}
            decay={2}
            position={[0, 4.8, -4]}
          />
          {/* Cockpit Rear Walkway Light */}
          <pointLight
            color="#38bdf8"
            intensity={1.6}
            distance={16}
            decay={2}
            position={[0, 4.5, 4]}
          />

          {/* 5. Destination Sector Accent Lights */}
          <pointLight
            color="#0284c7"
            intensity={2.2}
            distance={22}
            decay={2}
            position={[18.5, 4.6, 0]}
          />
          <pointLight
            color="#818cf8"
            intensity={2.2}
            distance={22}
            decay={2}
            position={[-18.5, 4.6, 0]}
          />
          <pointLight
            color="#10b981"
            intensity={2.0}
            distance={18}
            decay={2}
            position={[0, 4.4, 17.5]}
          />

          {/* 6. Exterior Deep Space Vista Backdrop & 3D Celestial Bodies */}
          <SpaceEnvironment reducedMotion={isReducedMotion} />

          {activeDestination === 'hub' ? (
            <ExteriorShip reducedMotion={isReducedMotion} />
          ) : (
            <SpaceshipInterior
              activeDestination={activeDestination}
              onSelectDestination={onSelectDestination}
              onSelectProject={onSelectProject}
              reducedMotion={isReducedMotion}
            />
          )}

          {/* 8. Friendly AI Robot Guide NOVA */}
          {activeDestination !== 'hub' && <NovaCharacter
            onInteract={onNovaClick}
            reducedMotion={isReducedMotion}
          />}

          {/* 9. Cinematic Camera Controller */}
          <CameraController
            activeDestination={activeDestination}
            isReducedMotion={isReducedMotion}
            onTransitionStart={onTransitionStart}
            onTransitionComplete={onTransitionComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
