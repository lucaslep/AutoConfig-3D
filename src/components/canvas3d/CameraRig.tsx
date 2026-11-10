import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useConfigStore } from '../../store/useConfigStore';
import { CameraPreset, CameraView } from '../../types/configurator';

const DEFAULT_PRESETS: Record<CameraView, CameraPreset> = {
  free: { position: [4.2, 2.0, 4.6], target: [0, 0.55, 0] },
  front: { position: [0, 1.25, 5.2], target: [0, 0.55, 0] },
  rear: { position: [0, 1.35, -5.2], target: [0, 0.55, 0] },
  side: { position: [5.6, 1.15, 0], target: [0, 0.55, 0] },
  interior: { position: [-0.32, 1.06, -0.05], target: [-0.32, 0.96, 1.2] },
};

export const CameraRig: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const cameraView = useConfigStore((s) => s.cameraView);
  const autoRotate = useConfigStore((s) => s.autoRotate);
  const cameraResetTrigger = useConfigStore((s) => s.cameraResetTrigger);
  const selectedVehicleId = useConfigStore((s) => s.selectedVehicleId);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const desiredPosition = useRef(new THREE.Vector3(4.2, 2.0, 4.6));
  const desiredTarget = useRef(new THREE.Vector3(0, 0.55, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const vehicle = getActiveVehicle();
    const preset =
      vehicle.cameraPresets?.[cameraView] || DEFAULT_PRESETS[cameraView];

    desiredPosition.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    isTransitioning.current = true;
  }, [cameraView, cameraResetTrigger, selectedVehicleId, getActiveVehicle]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const step = Math.min(1, delta * 5.5);
      camera.position.lerp(desiredPosition.current, step);
      controlsRef.current.target.lerp(desiredTarget.current, step);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(desiredPosition.current);
      const distTarget = controlsRef.current.target.distanceTo(
        desiredTarget.current
      );

      if (distPos < 0.03 && distTarget < 0.03) {
        isTransitioning.current = false;
      }
    }
  });

  const isInterior = cameraView === 'interior';

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      autoRotate={autoRotate && !isInterior}
      autoRotateSpeed={1.1}
      enablePan={false}
      minDistance={isInterior ? 0.1 : 2.5}
      maxDistance={isInterior ? 1.6 : 9.5}
      minPolarAngle={isInterior ? Math.PI * 0.28 : Math.PI * 0.08}
      maxPolarAngle={isInterior ? Math.PI * 0.65 : Math.PI * 0.48}
      onStart={() => {
        // Quando o usuário interage com o mouse ou toque, interrompe a interpolação automática
        isTransitioning.current = false;
      }}
    />
  );
};
