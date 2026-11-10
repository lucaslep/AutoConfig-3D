import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { ShowroomStage } from './ShowroomStage';
import { CameraRig } from './CameraRig';
import { VehicleModel } from './VehicleModel';
import { Loader3D } from '../ui/Loader3D';

export const ShowroomCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-full flex-1 bg-showroom-bg overflow-hidden">
      {/* Glow ambiental de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(225,29,72,0.09),transparent_65%)] pointer-events-none" />

      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.2, 2.0, 4.6], fov: 42, near: 0.05, far: 100 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={<Loader3D />}>
          <ShowroomStage />
          <VehicleModel />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
};
