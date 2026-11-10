import * as THREE from 'three';

export interface InspectedGLBResult {
  materialNames: string[];
  meshNames: string[];
}

/**
 * Percorre a árvore de objetos (Scene Graph) de um arquivo GLB/GLTF carregado
 * e extrai todos os nomes únicos de Materiais e Malhas (Meshes).
 */
export function inspectGLBScene(scene: THREE.Object3D): InspectedGLBResult {
  const materialSet = new Set<string>();
  const meshSet = new Set<string>();

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.name) {
        meshSet.add(mesh.name);
      }

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        if (mat && mat.name) {
          materialSet.add(mat.name);
        }
      });
    }
  });

  return {
    materialNames: Array.from(materialSet),
    meshNames: Array.from(meshSet),
  };
}
