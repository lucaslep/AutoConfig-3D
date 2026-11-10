export type CustomizationTab =
  | 'models'
  | 'create-car'
  | 'paint'
  | 'wheels'
  | 'interior'
  | 'accessories'
  | 'saved'
  | 'import';

export type CameraView =
  | 'free'
  | 'front'
  | 'rear'
  | 'side'
  | 'interior';

export type VehicleArchetype =
  | 'coupe'
  | 'suv'
  | 'hypercar'
  | 'sedan'
  | 'pickup'
  | 'roadster';

export type PaintFinishType = 'metallic' | 'matte' | 'pearlescent' | 'solid';

export type LiveryStyle = 'none' | 'dual-stripe' | 'center-stripe' | 'carbon-hood';

export interface PaintOption {
  id: string;
  name: string;
  hex: string;
  finish: PaintFinishType;
  finishLabel: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  price: number;
}

export interface PBRCustomSettings {
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  finishPreset: PaintFinishType;
}

export interface ExteriorDetailsConfig {
  liveryStyle: LiveryStyle;
  liveryColor: string;
  windowTintOpacity: number; // 0.25 (transparente) a 0.92 (blackout)
  headlightColor: string;
  headlightsOn: boolean;
  caliperColor: string;
  underglowColor: string;
}

export interface ChassisGeometryConfig {
  rideHeightOffset: number; // -0.10 (rebaixado) a +0.16 (elevado)
  bodyWidthScale: number; // 0.90 a 1.18 (widebody)
  bodyLengthScale: number; // 0.90 a 1.15
  cabinHeightScale: number; // 0.85 a 1.15
  wheelScale: number; // 0.88 a 1.18
}

export type WheelStyleType =
  | 'sport'
  | 'premium'
  | 'black'
  | 'racing'
  | 'aerodisc'
  | 'offroad';

export interface WheelOption {
  id: string;
  name: string;
  style: WheelStyleType;
  sizeInches: number;
  description: string;
  primaryColor: string;
  accentColor: string;
  metalness: number;
  roughness: number;
  price: number;
}

export interface InteriorOption {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  stitchingColor: string;
  roughness: number;
  price: number;
}

export type AccessoryKey =
  | 'spoiler'
  | 'frontSplitter'
  | 'sideSkirts'
  | 'panoramicRoof'
  | 'sportTrim'
  | 'roofScoop'
  | 'aeroCanards'
  | 'roofRack'
  | 'underglow';

export interface AccessoryOption {
  id: string;
  key: AccessoryKey;
  name: string;
  description: string;
  price: number;
  category: 'aerodynamics' | 'exterior' | 'roof';
}

export interface VehicleSpecs {
  powerHp: number;
  acceleration0to100: number; // segundos
  topSpeedKmh: number;
  drivetrain: string;
  engineType: string;
}

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface VehicleModelMapping {
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  bodyMaterialNames: string[];
  wheelMaterialNames: string[];
  interiorMaterialNames: string[];
  glassMaterialNames: string[];
  caliperMaterialNames: string[];
  wheelMeshVariants?: Record<string, string[]>;
  accessoryMeshNames: Partial<Record<AccessoryKey, string[]>>;
  supportsWheelSwap: boolean;
  supportsInteriorCamera: boolean;
}

export type VehicleCategory =
  | 'Coupé Esportivo'
  | 'SUV Premium'
  | 'Superesportivo'
  | 'Sedan Executivo'
  | 'Picape Off-Road'
  | 'Roadster Conversível'
  | 'Importado (GLB)';

export interface Vehicle {
  id: string;
  name: string;
  subtitle: string;
  category: VehicleCategory;
  archetype: VehicleArchetype;
  description: string;
  basePrice: number;
  specs: VehicleSpecs;
  thumbnailGradient: string;
  accentHex: string;
  isUserCreated?: boolean;
  chassisConfig?: ChassisGeometryConfig;
  defaultPbrSettings?: PBRCustomSettings;
  defaultExteriorDetails?: ExteriorDetailsConfig;
  glbPath: string | null;
  compatiblePaintIds: string[];
  compatibleWheelIds: string[];
  compatibleInteriorIds: string[];
  compatibleAccessoryIds: string[];
  defaultPaintId: string;
  defaultWheelId: string;
  defaultInteriorId: string;
  defaultAccessoryIds: string[];
  modelMapping: VehicleModelMapping;
  cameraPresets?: Partial<Record<CameraView, CameraPreset>>;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  vehicleId: string;
  vehicleName: string;
  paintId: string;
  pbrSettings: PBRCustomSettings;
  exteriorDetails?: ExteriorDetailsConfig;
  chassisConfig?: ChassisGeometryConfig;
  wheelId: string;
  interiorId: string;
  accessoryIds: string[];
  totalPrice: number;
}

export interface CustomImportedGLB {
  savedModelId?: string;
  objectUrl: string;
  rawBlob?: Blob;
  fileName: string;
  customName: string;
  category: VehicleCategory;
  basePrice: number;
  specs: VehicleSpecs;
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

export interface SavedCustomGLBModel {
  id: string;
  name: string;
  fileName: string;
  category: VehicleCategory;
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
  objectUrl: string;
}
