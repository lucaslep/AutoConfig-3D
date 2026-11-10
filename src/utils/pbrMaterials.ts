import * as THREE from 'three';
import { PBRCustomSettings } from '../types/configurator';

/**
 * Aplica propriedades PBR automotivas usando MeshStandardMaterial otimizado
 * para compilação instantânea de shader no Windows (WebGL ANGLE D3D11).
 */
export function applyCarPaintPBR(
  material: THREE.Material,
  pbr: PBRCustomSettings
): void {
  if (material instanceof THREE.MeshStandardMaterial) {
    material.color.set(pbr.color);

    // Simula o efeito do verniz (clearcoat) através do equilíbrio de roughness/metalness e envMapIntensity
    const effectiveRoughness =
      pbr.finishPreset === 'matte'
        ? Math.max(0.45, pbr.roughness)
        : Math.max(0.05, pbr.roughness * (1 - pbr.clearcoat * 0.45));

    material.metalness = pbr.metalness;
    material.roughness = effectiveRoughness;
    material.envMapIntensity =
      pbr.finishPreset === 'matte' ? 0.6 : 1.1 + pbr.clearcoat * 0.6;

    // Se o material da carroceria tinha textura difusa escura bloqueando a cor da pintura, limpamos o map
    if (material.map) {
      material.map = null;
    }

    material.needsUpdate = true;
  }
}

/**
 * Converte materiais pesados MeshPhysicalMaterial (exportados pelo Blender com transmission/ior/specular/sheen
 * que travam o compilador DirectX ANGLE no Windows por até 15 segundos) em MeshStandardMaterial ultra-rápido.
 */
export function convertToFastStandardMaterial(
  mat: THREE.Material
): THREE.MeshStandardMaterial {
  if (
    mat instanceof THREE.MeshStandardMaterial &&
    !(mat instanceof THREE.MeshPhysicalMaterial)
  ) {
    mat.envMapIntensity = 1.2;
    return mat;
  }

  const src = mat as THREE.MeshPhysicalMaterial;
  const isGlass =
    (src.transmission !== undefined && src.transmission > 0.1) ||
    src.transparent ||
    /glass|window|windshield|vidro|lens/i.test(src.name || '');

  const fastMat = new THREE.MeshStandardMaterial({
    name: src.name,
    color: src.color ? src.color.clone() : new THREE.Color('#ffffff'),
    map: isGlass ? null : src.map || null,
    normalMap: src.normalMap || null,
    roughnessMap: isGlass ? null : src.roughnessMap || null,
    metalnessMap: isGlass ? null : src.metalnessMap || null,
    emissive: src.emissive ? src.emissive.clone() : new THREE.Color('#000000'),
    emissiveMap: src.emissiveMap || null,
    emissiveIntensity: src.emissiveIntensity ?? 1,
    metalness: isGlass ? 0.1 : src.metalness ?? 0.5,
    roughness: isGlass ? 0.08 : src.roughness ?? 0.3,
    transparent: isGlass ? true : src.transparent ?? false,
    opacity: isGlass ? Math.min(src.opacity || 0.45, 0.45) : src.opacity ?? 1,
    side: src.side ?? THREE.FrontSide,
    envMapIntensity: 1.25,
  });

  return fastMat;
}
