import { create } from 'zustand';
import {
  CameraView,
  ChassisGeometryConfig,
  CustomImportedGLB,
  CustomizationTab,
  ExteriorDetailsConfig,
  PBRCustomSettings,
  SavedConfiguration,
  SavedCustomGLBModel,
  Vehicle,
  VehicleArchetype,
  VehicleCategory,
  VehicleSpecs,
} from '../types/configurator';
import {
  DEFAULT_CHASSIS_CONFIG,
  VEHICLES_CATALOG,
} from '../data/vehiclesCatalog';
import { ALL_PAINT_IDS, PAINT_OPTIONS } from '../data/paintOptions';
import { ALL_WHEEL_IDS } from '../data/wheelOptions';
import { ALL_INTERIOR_IDS } from '../data/interiorOptions';
import { ALL_ACCESSORY_IDS } from '../data/accessoryOptions';
import { storageService } from '../services/storageService';
import { glbStorageService } from '../services/glbStorageService';

export const DEFAULT_EXTERIOR_DETAILS: ExteriorDetailsConfig = {
  liveryStyle: 'none',
  liveryColor: '#FFFFFF',
  windowTintOpacity: 0.6,
  headlightColor: '#F8FAFC',
  headlightsOn: true,
  caliperColor: '#E11D48',
  underglowColor: '#E11D48',
};

interface ConfiguratorState {
  // Navegação da UI
  activeTab: CustomizationTab;
  isSaveModalOpen: boolean;
  editingConfigId: string | null;
  isTutorialModalOpen: boolean;
  notificationMessage: string | null;

  // Catálogo de Veículos Criados do Zero pelo Usuário
  userCreatedVehicles: Vehicle[];
  previewArchetype: VehicleArchetype | null;
  creatorStep: number; // 1 a 6 no modo passo a passo de criação

  // Veículo e Customizações Ativas
  selectedVehicleId: string;
  selectedPaintId: string;
  pbrSettings: PBRCustomSettings;
  exteriorDetails: ExteriorDetailsConfig;
  chassisConfig: ChassisGeometryConfig;
  selectedWheelId: string;
  selectedInteriorId: string;
  selectedAccessoryIds: string[];

  // Controles de Câmera 3D
  cameraView: CameraView;
  autoRotate: boolean;
  cameraResetTrigger: number;

  // Persistência (Projetos Salvos)
  savedConfigurations: SavedConfiguration[];

  // Modelos 3D GLB/GLTF Importados e Salvos no IndexedDB
  customImportedGLB: CustomImportedGLB | null;
  savedGLBModels: SavedCustomGLBModel[];

  // Actions
  setActiveTab: (tab: CustomizationTab) => void;
  setSaveModalOpen: (open: boolean, editingId?: string | null) => void;
  setTutorialModalOpen: (open: boolean) => void;
  showNotification: (message: string) => void;

  selectVehicle: (vehicleId: string) => void;
  selectPaint: (paintId: string) => void;
  updatePBRSettings: (partial: Partial<PBRCustomSettings>) => void;
  updateExteriorDetails: (partial: Partial<ExteriorDetailsConfig>) => void;
  updateChassisConfig: (partial: Partial<ChassisGeometryConfig>) => void;
  resetChassisConfig: () => void;
  setPreviewArchetype: (arch: VehicleArchetype | null) => void;
  setCreatorStep: (step: number) => void;
  cancelCarCreation: () => void;
  selectWheel: (wheelId: string) => void;
  selectInterior: (interiorId: string) => void;
  toggleAccessory: (accessoryId: string) => void;

  // Criador de Carros Padronizados do Zero
  createOrUpdateUserVehicle: (input: {
    id?: string;
    name: string;
    subtitle: string;
    category: VehicleCategory;
    archetype: VehicleArchetype;
    description: string;
    basePrice: number;
    specs: VehicleSpecs;
    accentHex: string;
    chassisConfig: ChassisGeometryConfig;
  }) => void;
  deleteUserVehicle: (id: string) => void;

  setCameraView: (view: CameraView) => void;
  toggleAutoRotate: () => void;
  resetCamera: () => void;

  saveCurrentConfiguration: (name: string, totalPrice: number) => void;
  loadConfiguration: (config: SavedConfiguration) => void;
  deleteConfiguration: (id: string) => void;

  // Actions para Importação e Salvamento de GLB Customizado
  hydrateSavedGLBModels: () => Promise<void>;
  setCustomImportedGLB: (glb: CustomImportedGLB | null) => void;
  updateCustomGLBMeta: (
    partial: Partial<
      Pick<CustomImportedGLB, 'customName' | 'category' | 'basePrice' | 'specs'>
    >
  ) => void;
  updateCustomGLBTransform: (
    partial: Partial<Pick<CustomImportedGLB, 'scale' | 'positionY' | 'rotationY'>>
  ) => void;
  setCustomGLBDetectedData: (materials: string[], meshes: string[]) => void;
  toggleCustomGLBMaterialRole: (
    role: 'body' | 'wheel' | 'interior',
    materialName: string
  ) => void;
  toggleCustomGLBMeshVisibility: (meshName: string) => void;
  saveCurrentGLBModelToCatalog: () => Promise<void>;
  selectSavedGLBModel: (id: string) => void;
  deleteSavedGLBModel: (id: string) => Promise<void>;

  // Helpers
  getAllCatalogVehicles: () => Vehicle[];
  getActiveVehicle: () => Vehicle;
}

const initialVehicle = VEHICLES_CATALOG[0];
const initialPaint =
  PAINT_OPTIONS.find((p) => p.id === initialVehicle.defaultPaintId) ||
  PAINT_OPTIONS[0];

export const useConfigStore = create<ConfiguratorState>((set, get) => ({
  activeTab: 'models',
  isSaveModalOpen: false,
  editingConfigId: null,
  isTutorialModalOpen: false,
  notificationMessage: null,

  userCreatedVehicles: storageService.getUserCreatedVehicles(),
  previewArchetype: null,
  creatorStep: 1,

  selectedVehicleId: initialVehicle.id,
  selectedPaintId: initialPaint.id,
  pbrSettings: {
    color: initialPaint.hex,
    metalness: initialPaint.metalness,
    roughness: initialPaint.roughness,
    clearcoat: initialPaint.clearcoat,
    finishPreset: initialPaint.finish,
  },
  exteriorDetails: { ...DEFAULT_EXTERIOR_DETAILS },
  chassisConfig: {
    ...(initialVehicle.chassisConfig || DEFAULT_CHASSIS_CONFIG),
  },
  selectedWheelId: initialVehicle.defaultWheelId,
  selectedInteriorId: initialVehicle.defaultInteriorId,
  selectedAccessoryIds: [...initialVehicle.defaultAccessoryIds],

  cameraView: 'free',
  autoRotate: false,
  cameraResetTrigger: 0,

  savedConfigurations: storageService.getAllConfigurations(),

  customImportedGLB: null,
  savedGLBModels: [],

  setActiveTab: (tab) => {
    if (tab === 'create-car') {
      // Ao clicar em "Criar Carro", inicia na Etapa 1 com um Modelo Base "Cru" (Primer Cinza de Estúdio)
      set({
        activeTab: 'create-car',
        creatorStep: 1,
        previewArchetype: 'sedan',
        customImportedGLB: null,
        selectedPaintId: 'paint-graphite-grey',
        pbrSettings: {
          color: '#64748B',
          metalness: 0.25,
          roughness: 0.48,
          clearcoat: 0.2,
          finishPreset: 'matte',
        },
        exteriorDetails: {
          ...DEFAULT_EXTERIOR_DETAILS,
          liveryStyle: 'none',
          windowTintOpacity: 0.42,
          caliperColor: '#475569',
          headlightsOn: true,
          headlightColor: '#F8FAFC',
        },
        chassisConfig: { ...DEFAULT_CHASSIS_CONFIG },
        selectedWheelId: 'wheel-sport-twin',
        selectedInteriorId: 'int-black-leather',
        selectedAccessoryIds: [],
        cameraView: 'free',
        autoRotate: false,
      });
      return;
    }

    set({
      activeTab: tab,
      previewArchetype: null,
    });
    if (tab === 'interior') {
      const vehicle = get().getActiveVehicle();
      if (vehicle.modelMapping.supportsInteriorCamera) {
        set({ cameraView: 'interior', autoRotate: false });
      }
    } else if (get().cameraView === 'interior') {
      set({ cameraView: 'free' });
    }
  },

  setSaveModalOpen: (open, editingId = null) =>
    set({ isSaveModalOpen: open, editingConfigId: editingId }),

  setTutorialModalOpen: (open) => set({ isTutorialModalOpen: open }),

  showNotification: (message) => {
    set({ notificationMessage: message });
    setTimeout(() => {
      set((state) =>
        state.notificationMessage === message
          ? { notificationMessage: null }
          : state
      );
    }, 3200);
  },

  getAllCatalogVehicles: () => {
    return [...get().userCreatedVehicles, ...VEHICLES_CATALOG];
  },

  selectVehicle: (vehicleId) => {
    const savedGLB = get().savedGLBModels.find((m) => m.id === vehicleId);
    if (savedGLB) {
      get().selectSavedGLBModel(savedGLB.id);
      return;
    }

    const allVehicles = get().getAllCatalogVehicles();
    const vehicle =
      allVehicles.find((v) => v.id === vehicleId) || VEHICLES_CATALOG[0];
    const defaultPaint =
      PAINT_OPTIONS.find((p) => p.id === vehicle.defaultPaintId) ||
      PAINT_OPTIONS[0];

    const restoredPbr: PBRCustomSettings = vehicle.defaultPbrSettings
      ? { ...vehicle.defaultPbrSettings }
      : {
          color: defaultPaint.hex,
          metalness: defaultPaint.metalness,
          roughness: defaultPaint.roughness,
          clearcoat: defaultPaint.clearcoat,
          finishPreset: defaultPaint.finish,
        };

    set({
      selectedVehicleId: vehicle.id,
      previewArchetype: null,
      customImportedGLB: null,
      selectedPaintId: vehicle.defaultPaintId || defaultPaint.id,
      pbrSettings: restoredPbr,
      chassisConfig: {
        ...(vehicle.chassisConfig || DEFAULT_CHASSIS_CONFIG),
      },
      exteriorDetails: vehicle.defaultExteriorDetails
        ? { ...vehicle.defaultExteriorDetails }
        : { ...DEFAULT_EXTERIOR_DETAILS },
      selectedWheelId: vehicle.defaultWheelId,
      selectedInteriorId: vehicle.defaultInteriorId,
      selectedAccessoryIds: [...vehicle.defaultAccessoryIds],
      cameraView: 'free',
    });
  },

  selectPaint: (paintId) => {
    const paint = PAINT_OPTIONS.find((p) => p.id === paintId);
    if (!paint) return;

    const newPbr: PBRCustomSettings = {
      color: paint.hex,
      metalness: paint.metalness,
      roughness: paint.roughness,
      clearcoat: paint.clearcoat,
      finishPreset: paint.finish,
    };

    set((state) => {
      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            defaultPaintId: paint.id,
            defaultPbrSettings: newPbr,
            accentHex: newPbr.color,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }

      return {
        selectedPaintId: paint.id,
        pbrSettings: newPbr,
        userCreatedVehicles: updatedUserVehicles,
      };
    });
  },

  updatePBRSettings: (partial) =>
    set((state) => {
      const nextPbr = {
        ...state.pbrSettings,
        ...partial,
      };

      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            defaultPbrSettings: nextPbr,
            accentHex: nextPbr.color,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }

      return {
        pbrSettings: nextPbr,
        userCreatedVehicles: updatedUserVehicles,
      };
    }),

  updateExteriorDetails: (partial) =>
    set((state) => {
      const nextDetails = {
        ...state.exteriorDetails,
        ...partial,
      };

      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            defaultExteriorDetails: nextDetails,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }

      return {
        exteriorDetails: nextDetails,
        userCreatedVehicles: updatedUserVehicles,
      };
    }),

  updateChassisConfig: (partial) =>
    set((state) => {
      const nextChassis = {
        ...state.chassisConfig,
        ...partial,
      };

      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            chassisConfig: nextChassis,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }

      return {
        chassisConfig: nextChassis,
        userCreatedVehicles: updatedUserVehicles,
      };
    }),

  resetChassisConfig: () => {
    const vehicle = get().getActiveVehicle();
    set({
      chassisConfig: {
        ...(vehicle.chassisConfig || DEFAULT_CHASSIS_CONFIG),
      },
    });
  },

  setPreviewArchetype: (arch) =>
    set({
      previewArchetype: arch,
      customImportedGLB: null,
    }),

  setCreatorStep: (step) => {
    const clamped = Math.max(1, Math.min(6, step));
    set({
      creatorStep: clamped,
      // Na etapa 4 (Interior), aproxima a câmera do cockpit automaticamente; nas demais, volta para visão externa
      cameraView: clamped === 4 ? 'interior' : 'free',
      autoRotate: false,
    });
  },

  cancelCarCreation: () => {
    const currentId = get().selectedVehicleId;
    set({ activeTab: 'models', previewArchetype: null, creatorStep: 1 });
    get().selectVehicle(currentId);
  },

  selectWheel: (wheelId) =>
    set((state) => {
      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            defaultWheelId: wheelId,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }
      return {
        selectedWheelId: wheelId,
        userCreatedVehicles: updatedUserVehicles,
      };
    }),

  selectInterior: (interiorId) =>
    set((state) => {
      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            defaultInteriorId: interiorId,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }
      return {
        selectedInteriorId: interiorId,
        userCreatedVehicles: updatedUserVehicles,
      };
    }),

  toggleAccessory: (accessoryId) =>
    set((state) => {
      const exists = state.selectedAccessoryIds.includes(accessoryId);
      const updated = exists
        ? state.selectedAccessoryIds.filter((id) => id !== accessoryId)
        : [...state.selectedAccessoryIds, accessoryId];

      let updatedUserVehicles = state.userCreatedVehicles;
      if (state.activeTab !== 'create-car') {
        const idx = state.userCreatedVehicles.findIndex(
          (v) => v.id === state.selectedVehicleId
        );
        if (idx >= 0) {
          const updatedCar: Vehicle = {
            ...state.userCreatedVehicles[idx],
            defaultAccessoryIds: updated,
          };
          updatedUserVehicles = storageService.saveUserCreatedVehicle(updatedCar);
        }
      }

      return {
        selectedAccessoryIds: updated,
        userCreatedVehicles: updatedUserVehicles,
      };
    }),

  createOrUpdateUserVehicle: (input) => {
    const state = get();
    const id = input.id || `custom-car-${Date.now()}`;

    const newVehicle: Vehicle = {
      id,
      name: input.name.trim() || 'Protótipo Custom GT',
      subtitle: input.subtitle.trim() || 'Engenharia Customizada no Estúdio',
      category: input.category,
      archetype: input.archetype,
      description:
        input.description.trim() ||
        'Veículo projetado sob medida no Estúdio de Engenharia AutoConfig 3D.',
      basePrice: input.basePrice,
      specs: { ...input.specs },
      thumbnailGradient: 'from-rose-500/30 via-indigo-950 to-black',
      accentHex: state.pbrSettings.color || input.accentHex || '#E11D48',
      isUserCreated: true,
      chassisConfig: { ...input.chassisConfig },
      defaultPbrSettings: { ...state.pbrSettings },
      defaultExteriorDetails: { ...state.exteriorDetails },
      glbPath: null,
      compatiblePaintIds: ALL_PAINT_IDS,
      compatibleWheelIds: ALL_WHEEL_IDS,
      compatibleInteriorIds: ALL_INTERIOR_IDS,
      compatibleAccessoryIds: ALL_ACCESSORY_IDS,
      defaultPaintId: state.selectedPaintId,
      defaultWheelId: state.selectedWheelId,
      defaultInteriorId: state.selectedInteriorId,
      defaultAccessoryIds: [...state.selectedAccessoryIds],
      modelMapping: {
        ...VEHICLES_CATALOG[0].modelMapping,
      },
      cameraPresets: {
        ...VEHICLES_CATALOG[0].cameraPresets,
      },
    };

    const updatedVehicles = storageService.saveUserCreatedVehicle(newVehicle);
    set({
      userCreatedVehicles: updatedVehicles,
      selectedVehicleId: newVehicle.id,
      activeTab: 'models',
      creatorStep: 1,
      previewArchetype: null,
      customImportedGLB: null,
      chassisConfig: { ...newVehicle.chassisConfig! },
      cameraView: 'free',
    });

    state.showNotification(
      `Veículo "${newVehicle.name}" criado e adicionado ao Catálogo!`
    );
  },

  deleteUserVehicle: (id) => {
    const updated = storageService.deleteUserCreatedVehicle(id);
    const state = get();
    const wasSelected = state.selectedVehicleId === id;

    set({
      userCreatedVehicles: updated,
      selectedVehicleId: wasSelected
        ? VEHICLES_CATALOG[0].id
        : state.selectedVehicleId,
    });

    state.showNotification('Veículo customizado removido do catálogo.');
  },

  setCameraView: (view) =>
    set({
      cameraView: view,
      autoRotate: view === 'interior' ? false : get().autoRotate,
    }),

  toggleAutoRotate: () =>
    set((state) => ({
      autoRotate: !state.autoRotate,
      cameraView:
        !state.autoRotate && state.cameraView === 'interior'
          ? 'free'
          : state.cameraView,
    })),

  resetCamera: () =>
    set((state) => ({
      cameraView: 'free',
      autoRotate: false,
      cameraResetTrigger: state.cameraResetTrigger + 1,
    })),

  saveCurrentConfiguration: (name, totalPrice) => {
    const state = get();
    const vehicle = state.getActiveVehicle();
    const now = new Date().toISOString();

    const activeVehicleId = state.customImportedGLB?.savedModelId
      ? state.customImportedGLB.savedModelId
      : state.selectedVehicleId;

    const configToSave: SavedConfiguration = {
      id: state.editingConfigId || `build-${Date.now()}`,
      name: name.trim() || `${vehicle.name} Custom`,
      createdAt: now,
      updatedAt: now,
      vehicleId: activeVehicleId,
      vehicleName: state.customImportedGLB
        ? state.customImportedGLB.customName
        : vehicle.name,
      paintId: state.selectedPaintId,
      pbrSettings: { ...state.pbrSettings },
      exteriorDetails: { ...state.exteriorDetails },
      chassisConfig: { ...state.chassisConfig },
      wheelId: state.selectedWheelId,
      interiorId: state.selectedInteriorId,
      accessoryIds: [...state.selectedAccessoryIds],
      totalPrice,
    };

    const updatedList = storageService.saveConfiguration(configToSave);
    set({
      savedConfigurations: updatedList,
      isSaveModalOpen: false,
      editingConfigId: null,
    });
    state.showNotification(
      `Configuração "${configToSave.name}" salva com sucesso!`
    );
  },

  loadConfiguration: (config) => {
    const savedGLB = get().savedGLBModels.find((m) => m.id === config.vehicleId);
    if (savedGLB) {
      get().selectSavedGLBModel(savedGLB.id);
    } else {
      const allVehicles = get().getAllCatalogVehicles();
      const vehicleExists = allVehicles.some((v) => v.id === config.vehicleId);
      const targetVehicleId = vehicleExists
        ? config.vehicleId
        : VEHICLES_CATALOG[0].id;
      set({
        selectedVehicleId: targetVehicleId,
        customImportedGLB: null,
      });
    }

    set({
      selectedPaintId: config.paintId,
      pbrSettings: { ...config.pbrSettings },
      exteriorDetails: config.exteriorDetails
        ? { ...config.exteriorDetails }
        : { ...DEFAULT_EXTERIOR_DETAILS },
      chassisConfig: config.chassisConfig
        ? { ...config.chassisConfig }
        : { ...DEFAULT_CHASSIS_CONFIG },
      selectedWheelId: config.wheelId,
      selectedInteriorId: config.interiorId,
      selectedAccessoryIds: [...config.accessoryIds],
      cameraView: 'free',
    });

    get().showNotification(
      `Configuração "${config.name}" carregada no Showroom!`
    );
  },

  deleteConfiguration: (id) => {
    const updatedList = storageService.deleteConfiguration(id);
    set({ savedConfigurations: updatedList });
    get().showNotification('Configuração removida.');
  },

  hydrateSavedGLBModels: async () => {
    const models = await glbStorageService.getAllModelsMeta();
    set({ savedGLBModels: models });
  },

  setCustomImportedGLB: (glb) => {
    set({
      customImportedGLB: glb,
      cameraView: 'free',
    });
    if (glb) {
      get().showNotification(`Modelo 3D "${glb.customName}" carregado!`);
    }
  },

  updateCustomGLBMeta: (partial) =>
    set((state) => {
      if (!state.customImportedGLB) return state;
      return {
        customImportedGLB: {
          ...state.customImportedGLB,
          ...partial,
        },
      };
    }),

  updateCustomGLBTransform: (partial) =>
    set((state) => {
      if (!state.customImportedGLB) return state;
      return {
        customImportedGLB: {
          ...state.customImportedGLB,
          ...partial,
        },
      };
    }),

  setCustomGLBDetectedData: (materials, meshes) =>
    set((state) => {
      if (!state.customImportedGLB) return state;

      const autoBody = materials.filter((m) =>
        /paint|body|carrosserie|exterior|color|skin|metal|lataria|chassi/i.test(
          m
        )
      );
      const autoWheel = materials.filter((m) =>
        /wheel|rim|alloy|roda|aro/i.test(m)
      );
      const autoInterior = materials.filter((m) =>
        /interior|leather|seat|cabin|couro|banco/i.test(m)
      );

      return {
        customImportedGLB: {
          ...state.customImportedGLB,
          detectedMaterials: materials,
          detectedMeshes: meshes,
          selectedBodyMaterials:
            state.customImportedGLB.selectedBodyMaterials.length > 0
              ? state.customImportedGLB.selectedBodyMaterials
              : autoBody.length > 0
              ? autoBody
              : materials.slice(0, 1),
          selectedWheelMaterials:
            state.customImportedGLB.selectedWheelMaterials.length > 0
              ? state.customImportedGLB.selectedWheelMaterials
              : autoWheel,
          selectedInteriorMaterials:
            state.customImportedGLB.selectedInteriorMaterials.length > 0
              ? state.customImportedGLB.selectedInteriorMaterials
              : autoInterior,
        },
      };
    }),

  toggleCustomGLBMaterialRole: (role, materialName) =>
    set((state) => {
      if (!state.customImportedGLB) return state;
      const key =
        role === 'body'
          ? 'selectedBodyMaterials'
          : role === 'wheel'
          ? 'selectedWheelMaterials'
          : 'selectedInteriorMaterials';

      const currentList = state.customImportedGLB[key];
      const exists = currentList.includes(materialName);
      const nextList = exists
        ? currentList.filter((item) => item !== materialName)
        : [...currentList, materialName];

      return {
        customImportedGLB: {
          ...state.customImportedGLB,
          [key]: nextList,
        },
      };
    }),

  toggleCustomGLBMeshVisibility: (meshName) =>
    set((state) => {
      if (!state.customImportedGLB) return state;
      const hidden = state.customImportedGLB.hiddenMeshes;
      const exists = hidden.includes(meshName);
      const nextHidden = exists
        ? hidden.filter((m) => m !== meshName)
        : [...hidden, meshName];

      return {
        customImportedGLB: {
          ...state.customImportedGLB,
          hiddenMeshes: nextHidden,
        },
      };
    }),

  saveCurrentGLBModelToCatalog: async () => {
    const state = get();
    const glb = state.customImportedGLB;
    if (!glb) return;

    const now = new Date().toISOString();
    const modelId = glb.savedModelId || `glb-car-${Date.now()}`;

    await glbStorageService.saveModel(
      {
        id: modelId,
        name: glb.customName.trim() || glb.fileName.replace(/\.(glb|gltf)$/i, ''),
        fileName: glb.fileName,
        category: glb.category,
        basePrice: glb.basePrice,
        specs: glb.specs,
        createdAt: now,
        updatedAt: now,
        scale: glb.scale,
        positionY: glb.positionY,
        rotationY: glb.rotationY,
        detectedMaterials: glb.detectedMaterials,
        detectedMeshes: glb.detectedMeshes,
        selectedBodyMaterials: glb.selectedBodyMaterials,
        selectedWheelMaterials: glb.selectedWheelMaterials,
        selectedInteriorMaterials: glb.selectedInteriorMaterials,
        hiddenMeshes: glb.hiddenMeshes,
      },
      glb.rawBlob,
      glb.objectUrl
    );

    const refreshed = await glbStorageService.getAllModelsMeta();
    set((prev) => ({
      savedGLBModels: refreshed,
      selectedVehicleId: modelId,
      customImportedGLB: prev.customImportedGLB
        ? {
            ...prev.customImportedGLB,
            savedModelId: modelId,
          }
        : null,
    }));

    state.showNotification(
      `Modelo 3D "${glb.customName}" salvo permanentemente no Catálogo!`
    );
  },

  selectSavedGLBModel: (id) => {
    const model = get().savedGLBModels.find((m) => m.id === id);
    if (!model) return;

    const activateWithUrl = (objectUrl: string) => {
      set({
        selectedVehicleId: model.id,
        customImportedGLB: {
          savedModelId: model.id,
          objectUrl,
          fileName: model.fileName,
          customName: model.name,
          category: model.category,
          basePrice: model.basePrice,
          specs: { ...model.specs },
          scale: model.scale,
          positionY: model.positionY,
          rotationY: model.rotationY,
          detectedMaterials: [...model.detectedMaterials],
          detectedMeshes: [...model.detectedMeshes],
          selectedBodyMaterials: [...model.selectedBodyMaterials],
          selectedWheelMaterials: [...model.selectedWheelMaterials],
          selectedInteriorMaterials: [...model.selectedInteriorMaterials],
          hiddenMeshes: [...model.hiddenMeshes],
        },
        cameraView: 'free',
      });
    };

    if (model.objectUrl) {
      activateWithUrl(model.objectUrl);
    } else {
      glbStorageService.getOrCreateObjectUrl(model.id).then((url) => {
        if (url) {
          activateWithUrl(url);
        }
      });
    }
  },

  deleteSavedGLBModel: async (id) => {
    await glbStorageService.deleteModel(id);
    const refreshed = await glbStorageService.getAllModelsMeta();
    const state = get();
    const wasActive = state.customImportedGLB?.savedModelId === id;

    set({
      savedGLBModels: refreshed,
      customImportedGLB: wasActive ? null : state.customImportedGLB,
      selectedVehicleId: wasActive
        ? VEHICLES_CATALOG[0].id
        : state.selectedVehicleId,
    });

    state.showNotification('Modelo GLB removido do catálogo.');
  },

  getActiveVehicle: () => {
    const state = get();
    const allVehicles = state.getAllCatalogVehicles();
    const baseFallback =
      allVehicles.find((v) => v.id === state.selectedVehicleId) ||
      VEHICLES_CATALOG[0];

    if (state.customImportedGLB) {
      return {
        ...baseFallback,
        id: state.customImportedGLB.savedModelId || 'custom-glb-temp',
        name:
          state.customImportedGLB.customName || state.customImportedGLB.fileName,
        subtitle: `Modelo 3D (${state.customImportedGLB.fileName})`,
        category: state.customImportedGLB.category,
        basePrice: state.customImportedGLB.basePrice,
        specs: state.customImportedGLB.specs,
      };
    }

    return baseFallback;
  },
}));
