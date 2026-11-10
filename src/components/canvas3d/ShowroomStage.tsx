import React, { memo } from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useConfigStore } from '../../store/useConfigStore';

/**
 * Iluminação HDR isolada com React.memo e frames={1}:
 * Renderiza o mapa de reflexos apenas 1 única vez na abertura do app (2ms)
 * e NUNCA re-renderiza quando o usuário troca de carro ou de cor!
 */
const StudioEnvironment = memo(() => {
  return (
    <Environment frames={1} resolution={128}>
      <Lightformer
        form="rect"
        intensity={3.2}
        position={[0, 5, 0]}
        scale={[10, 2.5, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#FFFFFF"
      />
      <Lightformer
        form="rect"
        intensity={2.0}
        position={[-6, 2, 0]}
        scale={[10, 1.2, 1]}
        rotation={[0, Math.PI / 2, 0]}
        color="#E2E8F0"
      />
      <Lightformer
        form="rect"
        intensity={2.0}
        position={[6, 2, 0]}
        scale={[10, 1.2, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#E2E8F0"
      />
      <Lightformer
        form="ring"
        intensity={1.6}
        position={[0, 3, -6]}
        scale={3.5}
        color="#F43F5E"
      />
    </Environment>
  );
});

export const ShowroomStage: React.FC = () => {
  const pbrColor = useConfigStore((s) => s.pbrSettings.color);
  const hasCustomGLB = useConfigStore((s) => Boolean(s.customImportedGLB));

  return (
    <>
      <color attach="background" args={['#08090D']} />
      <fog attach="fog" args={['#08090D', 11, 24]} />

      <ambientLight intensity={0.65} />

      <directionalLight position={[6, 9, 6]} intensity={2.2} />
      <directionalLight position={[-6, 6, -5]} intensity={1.2} color="#93C5FD" />
      <spotLight
        position={[0, 7.5, 0]}
        intensity={2.2}
        angle={0.65}
        penumbra={0.85}
        color="#FFFFFF"
      />

      <StudioEnvironment />

      {/* Piso do Showroom e Plataforma Circular */}
      <group position={[0, -0.01, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.4, 64]} />
          <meshStandardMaterial
            color="#11131C"
            metalness={0.65}
            roughness={0.25}
          />
        </mesh>

        {/* Sombra de base suave e ultra-leve sob o carro */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <planeGeometry args={[2.2, 4.4]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.6} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
          <ringGeometry args={[3.35, 3.41, 64]} />
          <meshBasicMaterial color={pbrColor} transparent opacity={0.65} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[2.55, 2.57, 64]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.45} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#08090D"
            metalness={0.8}
            roughness={0.35}
          />
        </mesh>

        <mesh position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.9, 3.02, 64]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {!hasCustomGLB && (
        <ContactShadows
          position={[0, 0.005, 0]}
          frames={1}
          opacity={0.75}
          scale={10}
          blur={1.8}
          far={2.5}
          resolution={128}
          color="#000000"
        />
      )}
    </>
  );
};
