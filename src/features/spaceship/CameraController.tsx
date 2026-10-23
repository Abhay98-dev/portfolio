import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { DESTINATIONS, DestinationId } from './destinations';

interface CameraControllerProps {
  activeDestination: DestinationId;
  isReducedMotion: boolean;
  onTransitionStart?: () => void;
  onTransitionComplete?: (dest: DestinationId) => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  activeDestination,
  isReducedMotion,
  onTransitionStart,
  onTransitionComplete,
}) => {
  const { camera, pointer } = useThree();
  const currentTween = useRef<gsap.core.Tween | null>(null);
  const lookAtTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 0));
  const isNavigating = useRef<boolean>(false);
  const previousDestination = useRef<DestinationId>(activeDestination);

  // Initial camera setup
  useEffect(() => {
    const initialConfig = DESTINATIONS[activeDestination];
    camera.position.set(
      initialConfig.cameraPosition.x,
      initialConfig.cameraPosition.y,
      initialConfig.cameraPosition.z
    );
    lookAtTarget.current.set(
      initialConfig.cameraTarget.x,
      initialConfig.cameraTarget.y,
      initialConfig.cameraTarget.z
    );
    camera.lookAt(lookAtTarget.current);
  }, []);

  // Animate camera on destination change
  useEffect(() => {
    const targetConfig = DESTINATIONS[activeDestination];
    if (!targetConfig) return;

    if (currentTween.current) {
      currentTween.current.kill();
    }

    if (onTransitionStart) {
      onTransitionStart();
    }
    isNavigating.current = true;

    // Scene geometry changes between the exterior and interior, so stage the
    // camera at the destination side of the airlock before the short arrival move.
    if (previousDestination.current === 'hub' && activeDestination !== 'hub') {
      const target = new THREE.Vector3(targetConfig.cameraTarget.x, targetConfig.cameraTarget.y, targetConfig.cameraTarget.z);
      const arrival = new THREE.Vector3(targetConfig.cameraPosition.x, targetConfig.cameraPosition.y, targetConfig.cameraPosition.z);
      const outward = arrival.clone().sub(target).normalize();
      camera.position.copy(arrival.addScaledVector(outward, 1.8));
      lookAtTarget.current.copy(target);
      camera.lookAt(target);
    } else if (activeDestination === 'hub' && previousDestination.current !== 'hub') {
      camera.position.set(0, 5, 34);
      lookAtTarget.current.set(0, 0.5, 0);
      camera.lookAt(lookAtTarget.current);
    }
    previousDestination.current = activeDestination;

    const isAirlockArrival = activeDestination !== 'hub' && targetConfig.id !== 'hub';
    const duration = isReducedMotion ? 0.3 : isAirlockArrival ? 1.15 : 1.8;
    const ease = isReducedMotion ? 'power1.out' : 'power3.inOut';

    const startPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const startTarget = {
      x: lookAtTarget.current.x,
      y: lookAtTarget.current.y,
      z: lookAtTarget.current.z,
    };

    const animObj = {
      px: startPos.x,
      py: startPos.y,
      pz: startPos.z,
      tx: startTarget.x,
      ty: startTarget.y,
      tz: startTarget.z,
    };

    currentTween.current = gsap.to(animObj, {
      px: targetConfig.cameraPosition.x,
      py: targetConfig.cameraPosition.y,
      pz: targetConfig.cameraPosition.z,
      tx: targetConfig.cameraTarget.x,
      ty: targetConfig.cameraTarget.y,
      tz: targetConfig.cameraTarget.z,
      duration,
      ease,
      onUpdate: () => {
        camera.position.set(animObj.px, animObj.py, animObj.pz);
        lookAtTarget.current.set(animObj.tx, animObj.ty, animObj.tz);
        camera.lookAt(lookAtTarget.current);
      },
      onComplete: () => {
        isNavigating.current = false;
        camera.position.set(
          targetConfig.cameraPosition.x,
          targetConfig.cameraPosition.y,
          targetConfig.cameraPosition.z
        );
        lookAtTarget.current.set(
          targetConfig.cameraTarget.x,
          targetConfig.cameraTarget.y,
          targetConfig.cameraTarget.z
        );
        camera.lookAt(lookAtTarget.current);
        if (onTransitionComplete) {
          onTransitionComplete(activeDestination);
        }
      },
    });

    return () => {
      if (currentTween.current) {
        currentTween.current.kill();
      }
    };
  }, [activeDestination, isReducedMotion]);

  // Subtle breathing & mouse parallax when idle
  useFrame((_, delta) => {
    if (isNavigating.current || isReducedMotion) return;

    // Gentle parallax from cursor
    const parallaxFactor = 0.25;
    const targetParallaxX = pointer.x * parallaxFactor;
    const targetParallaxY = pointer.y * (parallaxFactor * 0.6);

    camera.position.x += (targetParallaxX - (camera.position.x - DESTINATIONS[activeDestination].cameraPosition.x)) * delta * 1.5;
    camera.position.y += (targetParallaxY - (camera.position.y - DESTINATIONS[activeDestination].cameraPosition.y)) * delta * 1.5;
    
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};
