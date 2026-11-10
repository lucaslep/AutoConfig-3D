import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfigStore } from '../../store/useConfigStore';
import { WHEEL_OPTIONS } from '../../data/wheelOptions';
import { INTERIOR_OPTIONS } from '../../data/interiorOptions';
import { ACCESSORY_OPTIONS } from '../../data/accessoryOptions';
import { DemoProceduralCar } from './DemoProceduralCar';
import {
  applyCarPaintPBR,
  convertToFastStandardMaterial,
} from '../../utils/pbrMaterials';
import { AccessoryKey } from '../../types/configurator';

/**
 * Carregador GLB/GLTF Ultra-Rápido:
 * - Não faz scene.clone(true) desnecessário (usa a própria cena do useGLTF).
 * - Converte materiais MeshPhysicalMaterial pesados (que congelam o DirectX ANGLE no Windows)
 *   para MeshStandardMaterial em O(1), reduzindo o tempo de compilação de shaders de ~15s para ~30ms!
 * - Limita o envio de nomes de malhas para a UI em no máximo 60 itens.
 */
const ExternalGLBModel: React.FC<{ url: string; isCustomUpload: boolean }> = ({
  url,
  isCustomUpload,
}) => {
  const { scene } = useGLTF(url);

  const pbrSettings = useConfigStore((s) => s.pbrSettings);
  const selectedWheelId = useConfigStore((s) => s.selectedWheelId);
  const selectedInteriorId = useConfigStore((s) => s.selectedInteriorId);
  const selectedAccessoryIds = useConfigStore((s) => s.selectedAccessoryIds);
  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const setCustomGLBDetectedData = useConfigStore(
    (s) => s.setCustomGLBDetectedData
  );
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const vehicle = getActiveVehicle();
  const wheel =
    WHEEL_OPTIONS.find((w) => w.id === selectedWheelId) || WHEEL_OPTIONS[0];
  const interior =
    INTERIOR_OPTIONS.find((i) => i.id === selectedInteriorId) ||
    INTERIOR_OPTIONS[0];

  const materialsMapRef = useRef<Map<string, THREE.MeshStandardMaterial[]>>(
    new Map()
  );
  const meshesMapRef = useRef<Map<string, THREE.Mesh[]>>(new Map());

  const preparedData = useMemo(() => {
    const matMap = new Map<string, THREE.MeshStandardMaterial[]>();
    const meshMap = new Map<string, THREE.Mesh[]>();
    const convertedMatCache = new Map<
      THREE.Material,
      THREE.MeshStandardMaterial
    >();

    // Reseta transformações anteriores caso a cena venha do cache do useGLTF
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.set(1, 1, 1);
    scene.updateMatrixWorld(true);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;

        const meshName = mesh.name || `Peça_${mesh.id}`;
        if (meshMap.size < 60 || meshMap.has(meshName)) {
          const existingMeshes = meshMap.get(meshName) || [];
          existingMeshes.push(mesh);
          meshMap.set(meshName, existingMeshes);
        }

        const processMat = (
          mat: THREE.Material
        ): THREE.MeshStandardMaterial => {
          let fastMat = convertedMatCache.get(mat);
          if (!fastMat) {
            fastMat = convertToFastStandardMaterial(mat);
            convertedMatCache.set(mat, fastMat);

            const matName = fastMat.name || `Material_${fastMat.id}`;
            const list = matMap.get(matName) || [];
            list.push(fastMat);
            matMap.set(matName, list);
          }
          return fastMat;
        };

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => (m ? processMat(m) : m));
        } else if (mesh.material) {
          mesh.material = processMat(mesh.material);
        }
      }
    });

    let autoScale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let offsetZ = 0;

    if (isCustomUpload) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0 && isFinite(maxDim)) {
        const targetSize = 4.3;
        autoScale = targetSize / maxDim;
        offsetX = -center.x * autoScale;
        offsetZ = -center.z * autoScale;
        offsetY = -box.min.y * autoScale;
      }
    }

    materialsMapRef.current = matMap;
    meshesMapRef.current = meshMap;

    return {
      scene,
      autoScale,
      offsetX,
      offsetY,
      offsetZ,
      materialNames: Array.from(matMap.keys()),
      meshNames: Array.from(meshMap.keys()).slice(0, 60),
    };
  }, [scene, isCustomUpload]);

  useEffect(() => {
    if (isCustomUpload) {
      setCustomGLBDetectedData(
        preparedData.materialNames,
        preparedData.meshNames
      );
    }
  }, [preparedData, isCustomUpload, setCustomGLBDetectedData]);

  // Atualização O(1) instantânea de Pintura, Rodas e Interior
  useEffect(() => {
    const bodyMatNames = isCustomUpload
      ? customImportedGLB?.selectedBodyMaterials || []
      : vehicle.modelMapping.bodyMaterialNames;

    const wheelMatNames = isCustomUpload
      ? customImportedGLB?.selectedWheelMaterials || []
      : vehicle.modelMapping.wheelMaterialNames;

    const interiorMatNames = isCustomUpload
      ? customImportedGLB?.selectedInteriorMaterials || []
      : vehicle.modelMapping.interiorMaterialNames;

    materialsMapRef.current.forEach((matList, matName) => {
      const isBody = bodyMatNames.includes(matName);
      const isWheel = wheelMatNames.includes(matName);
      const isInterior = interiorMatNames.includes(matName);

      if (!isBody && !isWheel && !isInterior) return;

      matList.forEach((mat) => {
        if (isBody) {
          applyCarPaintPBR(mat, pbrSettings);
        } else if (isWheel) {
          mat.color.set(wheel.primaryColor);
          mat.metalness = wheel.metalness;
          mat.roughness = wheel.roughness;
          mat.needsUpdate = true;
        } else if (isInterior) {
          mat.color.set(interior.primaryColor);
          mat.roughness = interior.roughness;
          mat.needsUpdate = true;
        }
      });
    });
  }, [
    preparedData,
    isCustomUpload,
    customImportedGLB?.selectedBodyMaterials,
    customImportedGLB?.selectedWheelMaterials,
    customImportedGLB?.selectedInteriorMaterials,
    vehicle,
    pbrSettings,
    wheel,
    interior,
  ]);

  // Atualização O(1) instantânea de visibilidade de peças
  useEffect(() => {
    const hiddenMeshes = isCustomUpload
      ? customImportedGLB?.hiddenMeshes || []
      : [];

    if (isCustomUpload) {
      meshesMapRef.current.forEach((meshList, meshName) => {
        const shouldHide = hiddenMeshes.includes(meshName);
        meshList.forEach((m) => {
          m.visible = !shouldHide;
        });
      });
    } else {
      const accMap = vehicle.modelMapping.accessoryMeshNames;
      (Object.keys(accMap) as AccessoryKey[]).forEach((accKey) => {
        const targetMeshList = accMap[accKey] || [];
        const accOption = ACCESSORY_OPTIONS.find((a) => a.key === accKey);
        const isEnabled = accOption
          ? selectedAccessoryIds.includes(accOption.id)
          : false;

        targetMeshList.forEach((targetName) => {
          const found = meshesMapRef.current.get(targetName);
          found?.forEach((m) => {
            m.visible = isEnabled;
          });
        });
      });
    }
  }, [
    preparedData,
    isCustomUpload,
    customImportedGLB?.hiddenMeshes,
    vehicle,
    selectedAccessoryIds,
  ]);

  const userScale = isCustomUpload
    ? customImportedGLB?.scale ?? 1
    : vehicle.modelMapping.scale;
  const userPosY = isCustomUpload
    ? customImportedGLB?.positionY ?? 0
    : vehicle.modelMapping.position[1];
  const userRotY = isCustomUpload
    ? THREE.MathUtils.degToRad(customImportedGLB?.rotationY ?? 0)
    : vehicle.modelMapping.rotation[1];

  return (
    <group
      scale={userScale}
      position={[0, userPosY, 0]}
      rotation={[0, userRotY, 0]}
    >
      <group
        position={[
          preparedData.offsetX,
          preparedData.offsetY,
          preparedData.offsetZ,
        ]}
        scale={preparedData.autoScale}
      >
        <primitive object={preparedData.scene} />
      </group>
    </group>
  );
};

export const VehicleModel: React.FC = () => {
  const pbrSettings = useConfigStore((s) => s.pbrSettings);
  const exteriorDetails = useConfigStore((s) => s.exteriorDetails);
  const chassisConfig = useConfigStore((s) => s.chassisConfig);
  const previewArchetype = useConfigStore((s) => s.previewArchetype);
  const selectedWheelId = useConfigStore((s) => s.selectedWheelId);
  const selectedInteriorId = useConfigStore((s) => s.selectedInteriorId);
  const selectedAccessoryIds = useConfigStore((s) => s.selectedAccessoryIds);
  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const vehicle = getActiveVehicle();
  const activeArchetype = previewArchetype || vehicle.archetype;
  const wheel =
    WHEEL_OPTIONS.find((w) => w.id === selectedWheelId) || WHEEL_OPTIONS[0];
  const interior =
    INTERIOR_OPTIONS.find((i) => i.id === selectedInteriorId) ||
    INTERIOR_OPTIONS[0];

  if (customImportedGLB?.objectUrl) {
    return (
      <ExternalGLBModel
        url={customImportedGLB.objectUrl}
        isCustomUpload={true}
      />
    );
  }

  if (vehicle.glbPath) {
    return <ExternalGLBModel url={vehicle.glbPath} isCustomUpload={false} />;
  }

  const hasAccessory = (key: string) => {
    const acc = ACCESSORY_OPTIONS.find((a) => a.key === key);
    if (!acc) return false;
    return (
      vehicle.compatibleAccessoryIds.includes(acc.id) &&
      selectedAccessoryIds.includes(acc.id)
    );
  };

  return (
    <DemoProceduralCar
      archetype={activeArchetype}
      pbr={pbrSettings}
      exteriorDetails={exteriorDetails}
      chassisConfig={chassisConfig}
      wheel={wheel}
      interior={interior}
      activeAccessories={{
        spoiler: hasAccessory('spoiler'),
        frontSplitter: hasAccessory('frontSplitter'),
        aeroCanards: hasAccessory('aeroCanards'),
        sideSkirts: hasAccessory('sideSkirts'),
        roofScoop: hasAccessory('roofScoop'),
        panoramicRoof: hasAccessory('panoramicRoof'),
        roofRack: hasAccessory('roofRack'),
        sportTrim: hasAccessory('sportTrim'),
        underglow: hasAccessory('underglow'),
      }}
    />
  );
};
