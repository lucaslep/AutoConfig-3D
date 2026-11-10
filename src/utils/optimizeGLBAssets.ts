import * as THREE from 'three';

const MAX_TEXTURE_DIMENSION = 1024;

const TEXTURE_KEYS = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'emissiveMap',
  'alphaMap',
  'bumpMap',
  'clearcoatMap',
  'clearcoatNormalMap',
  'clearcoatRoughnessMap',
  'specularIntensityMap',
  'specularColorMap',
] as const;

/**
 * Redimensiona texturas 4K/8K embutidas em arquivos .GLB para no máximo 1024px
 * antes de enviá-las para a GPU (gl.texImage2D), reduzindo o consumo de VRAM em até 16x
 * e evitando o congelamento da thread principal no primeiro frame.
 */
function downscaleTextureIfNeeded(
  texture: THREE.Texture | null | undefined,
  processedTextures: Set<THREE.Texture>
): void {
  if (!texture || processedTextures.has(texture)) return;
  processedTextures.add(texture);

  const img = texture.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap
    | undefined;

  if (!img || typeof img.width !== 'number' || typeof img.height !== 'number') {
    return;
  }

  const { width, height } = img;
  if (width <= MAX_TEXTURE_DIMENSION && height <= MAX_TEXTURE_DIMENSION) {
    texture.anisotropy = 2;
    return;
  }

  try {
    const scale = MAX_TEXTURE_DIMENSION / Math.max(width, height);
    const targetW = Math.max(1, Math.floor(width * scale));
    const targetH = Math.max(1, Math.floor(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img as CanvasImageSource, 0, 0, targetW, targetH);
      texture.image = canvas;
      texture.anisotropy = 2;
      texture.needsUpdate = true;
    }
  } catch {
    // Caso a imagem não permita redesenho em canvas, mantém a original com anisotropia reduzida
    texture.anisotropy = 1;
  }
}

/**
 * Otimiza um material de um arquivo .GLB importado:
 * 1. Reduz texturas gigantes (4K/8K -> 1024px) para evitar travamento de VRAM.
 * 2. Desativa o 'transmission' (KHR_materials_transmission) que força o Three.js
 *    a renderizar a cena inteira duas vezes por frame em alta resolução.
 */
export function optimizeGLBMaterial(
  mat: THREE.Material,
  processedTextures: Set<THREE.Texture>
): void {
  const anyMat = mat as unknown as Record<string, unknown>;

  for (const key of TEXTURE_KEYS) {
    const tex = anyMat[key] as THREE.Texture | null | undefined;
    if (tex && tex.isTexture) {
      downscaleTextureIfNeeded(tex, processedTextures);
    }
  }

  if (mat instanceof THREE.MeshPhysicalMaterial) {
    // Se o modelo exportado do Blender usa transmission > 0 (vidros pesados),
    // convertemos para transparência alfa padrão (elimina o passe duplo de renderização!)
    if (mat.transmission > 0) {
      mat.transmission = 0;
      mat.transparent = true;
      mat.opacity = Math.min(mat.opacity || 0.55, 0.55);
      mat.roughness = Math.min(mat.roughness, 0.15);
    }
    if (mat.ior && mat.ior > 1.5) {
      mat.envMapIntensity = 1.0;
    }
  }
}
