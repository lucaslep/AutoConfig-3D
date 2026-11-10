import { SavedCustomGLBModel, Vehicle, VehicleSpecs } from '../types/configurator';

const DB_NAME = 'autoconfig3d_glb_database';
const DB_VERSION = 2; // Versão 2 separa metadados leves dos Blobs pesados para abrir a página instantaneamente!
const META_STORE = 'saved_glb_meta';
const BLOB_STORE = 'saved_glb_blobs';
const LEGACY_STORE = 'saved_glb_models';

export interface StoredGLBMeta {
  id: string;
  name: string;
  fileName: string;
  category: Vehicle['category'];
  basePrice: number;
  specs: VehicleSpecs;
  createdAt: string;
  updatedAt: string;
  scale: number;
  positionY: number;
  rotationY: number;
  detectedMaterials: string[];
  detectedMeshes: string[];
  selectedBodyMaterials: string[];
  selectedWheelMaterials: string[];
  selectedInteriorMaterials: string[];
  hiddenMeshes: string[];
}

const blobUrlCache = new Map<string, string>();

function openGLBDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // Remove a store antiga que guardava Blobs junto com metadados e travava a abertura da página
      if (db.objectStoreNames.contains(LEGACY_STORE)) {
        db.deleteObjectStore(LEGACY_STORE);
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Serviço de Persistência Binária 3D usando IndexedDB com Lazy-Loading de Blobs.
 * Na abertura da página, carrega APENAS os metadados leves (< 1ms).
 * O arquivo binário .GLB só é lido do disco quando o usuário clica para abrir aquele modelo!
 */
export const glbStorageService = {
  async getAllModelsMeta(): Promise<SavedCustomGLBModel[]> {
    try {
      const db = await openGLBDatabase();
      return await new Promise<SavedCustomGLBModel[]>((resolve, reject) => {
        const tx = db.transaction(META_STORE, 'readonly');
        const store = tx.objectStore(META_STORE);
        const req = store.getAll();

        req.onsuccess = () => {
          const records = (req.result || []) as StoredGLBMeta[];
          const list: SavedCustomGLBModel[] = records
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
            .map((rec) => ({
              ...rec,
              objectUrl: blobUrlCache.get(rec.id) || '',
            }));
          resolve(list);
        };

        req.onerror = () => reject(req.error);
      });
    } catch (error) {
      console.error('Erro ao carregar metadados GLB do IndexedDB:', error);
      return [];
    }
  },

  async getOrCreateObjectUrl(id: string): Promise<string | null> {
    const cached = blobUrlCache.get(id);
    if (cached) return cached;

    try {
      const db = await openGLBDatabase();
      return await new Promise<string | null>((resolve, reject) => {
        const tx = db.transaction(BLOB_STORE, 'readonly');
        const store = tx.objectStore(BLOB_STORE);
        const req = store.get(id);

        req.onsuccess = () => {
          const blob = req.result as Blob | undefined;
          if (!blob) {
            resolve(null);
            return;
          }
          const url = URL.createObjectURL(blob);
          blobUrlCache.set(id, url);
          resolve(url);
        };

        req.onerror = () => reject(req.error);
      });
    } catch (error) {
      console.error('Erro ao ler Blob GLB sob demanda:', error);
      return null;
    }
  },

  async saveModel(
    meta: StoredGLBMeta,
    blob?: Blob,
    existingObjectUrl?: string
  ): Promise<void> {
    if (existingObjectUrl) {
      blobUrlCache.set(meta.id, existingObjectUrl);
    }

    // Limita a lista de malhas salvas no banco para evitar registros gigantes em modelos CAD
    const safeMeta: StoredGLBMeta = {
      ...meta,
      detectedMeshes: meta.detectedMeshes.slice(0, 60),
    };

    const db = await openGLBDatabase();
    await new Promise<void>((resolve, reject) => {
      const stores = blob ? [META_STORE, BLOB_STORE] : [META_STORE];
      const tx = db.transaction(stores, 'readwrite');

      tx.objectStore(META_STORE).put(safeMeta);
      if (blob) {
        tx.objectStore(BLOB_STORE).put(blob, meta.id);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async deleteModel(id: string): Promise<void> {
    const cachedUrl = blobUrlCache.get(id);
    if (cachedUrl) {
      URL.revokeObjectURL(cachedUrl);
      blobUrlCache.delete(id);
    }

    const db = await openGLBDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([META_STORE, BLOB_STORE], 'readwrite');
      tx.objectStore(META_STORE).delete(id);
      tx.objectStore(BLOB_STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
};
