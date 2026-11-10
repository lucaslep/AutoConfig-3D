import React from 'react';
import {
  CarFront,
  Upload,
  BookOpen,
  HardDrive,
  Plus,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { VEHICLES_CATALOG } from '../../data/vehiclesCatalog';

const STEP_LABELS = [
  '1. Modelo & Chassi',
  '2. Pintura & Vidros',
  '3. Rodas & Freios',
  '4. Interior',
  '5. Acessórios',
  '6. Finalizar',
];

export const TopBarModels: React.FC = () => {
  const activeTab = useConfigStore((s) => s.activeTab);
  const creatorStep = useConfigStore((s) => s.creatorStep);
  const selectedVehicleId = useConfigStore((s) => s.selectedVehicleId);
  const userCreatedVehicles = useConfigStore((s) => s.userCreatedVehicles);
  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const savedGLBModels = useConfigStore((s) => s.savedGLBModels);
  const selectVehicle = useConfigStore((s) => s.selectVehicle);
  const selectSavedGLBModel = useConfigStore((s) => s.selectSavedGLBModel);
  const setActiveTab = useConfigStore((s) => s.setActiveTab);
  const setCreatorStep = useConfigStore((s) => s.setCreatorStep);
  const setTutorialModalOpen = useConfigStore((s) => s.setTutorialModalOpen);

  const isCreatingCar = activeTab === 'create-car';
  const allCatalogVehicles = [...userCreatedVehicles, ...VEHICLES_CATALOG];

  if (isCreatingCar) {
    return (
      <header className="w-full bg-showroom-panel/90 backdrop-blur-xl border-b border-showroom-border px-4 py-2.5 z-20 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-semibold text-amber-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Construção Passo a Passo</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-center max-w-4xl">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isCurrent = creatorStep === stepNum;
            const isCompleted = creatorStep > stepNum;

            return (
              <button
                key={label}
                onClick={() => setCreatorStep(stepNum)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-showroom-accent text-white border-showroom-accent shadow-neon-red'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-showroom-card/50 text-showroom-muted border-showroom-border'
                }`}
              >
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-showroom-panel/80 backdrop-blur-xl border-b border-showroom-border px-4 py-2.5 z-20 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2.5">
        {allCatalogVehicles.map((vehicle) => {
          const isSelected =
            selectedVehicleId === vehicle.id && !customImportedGLB;

          return (
            <button
              key={vehicle.id}
              onClick={() => selectVehicle(vehicle.id)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-showroom-card border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/40 border-showroom-border hover:border-white/20 hover:bg-showroom-card/80'
              }`}
            >
              <div
                className={`w-10 h-8 rounded-lg bg-gradient-to-br ${vehicle.thumbnailGradient} border border-white/10 flex items-center justify-center shrink-0`}
              >
                <CarFront
                  className="w-5 h-5"
                  style={{ color: isSelected ? '#FFFFFF' : vehicle.accentHex }}
                />
              </div>

              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-showroom-muted leading-none mb-0.5">
                  {vehicle.isUserCreated
                    ? `Custom • ${vehicle.category}`
                    : vehicle.category}
                </div>
                <div className="font-display text-xs font-bold text-white whitespace-nowrap">
                  {vehicle.name}
                </div>
              </div>
            </button>
          );
        })}

        {savedGLBModels.map((model) => {
          const isSelected = customImportedGLB?.savedModelId === model.id;

          return (
            <button
              key={model.id}
              onClick={() => selectSavedGLBModel(model.id)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-showroom-card border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/40 border-showroom-border hover:border-white/20 hover:bg-showroom-card/80'
              }`}
            >
              <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-emerald-600/30 via-slate-900 to-black border border-emerald-500/30 flex items-center justify-center shrink-0">
                <HardDrive
                  className="w-4 h-4"
                  style={{ color: isSelected ? '#FFFFFF' : '#34D399' }}
                />
              </div>

              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-emerald-400 leading-none mb-0.5">
                  GLB Salvo • {model.category}
                </div>
                <div className="font-display text-xs font-bold text-white whitespace-nowrap">
                  {model.name}
                </div>
              </div>
            </button>
          );
        })}

        {customImportedGLB && !customImportedGLB.savedModelId && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 shrink-0">
            <Upload className="w-4 h-4" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider leading-none">
                GLB Não Salvo
              </div>
              <div className="text-xs font-bold text-white truncate max-w-[140px]">
                {customImportedGLB.customName}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setActiveTab('create-car')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-showroom-accent/15 hover:bg-showroom-accent/30 border border-showroom-accent/40 text-xs font-semibold text-white transition-all shrink-0"
          title="Criar um novo modelo de carro padronizado passo a passo"
        >
          <Plus className="w-4 h-4 text-showroom-accent" />
          <span>Criar Carro</span>
        </button>
      </div>

      <button
        onClick={() => setTutorialModalOpen(true)}
        className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all shrink-0"
      >
        <BookOpen className="w-3.5 h-3.5 text-showroom-accent" />
        <span>Guia GLB / Blender</span>
      </button>
    </header>
  );
};
