import React from 'react';
import {
  Check,
  Gauge,
  Zap,
  ShieldCheck,
  UploadCloud,
  BookOpen,
  Trash2,
  HardDrive,
  Hammer,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { VEHICLES_CATALOG } from '../../data/vehiclesCatalog';
import { formatCurrency } from '../../utils/formatCurrency';

export const ModelsPanel: React.FC = () => {
  const selectedVehicleId = useConfigStore((s) => s.selectedVehicleId);
  const userCreatedVehicles = useConfigStore((s) => s.userCreatedVehicles);
  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const savedGLBModels = useConfigStore((s) => s.savedGLBModels);
  const selectVehicle = useConfigStore((s) => s.selectVehicle);
  const deleteUserVehicle = useConfigStore((s) => s.deleteUserVehicle);
  const selectSavedGLBModel = useConfigStore((s) => s.selectSavedGLBModel);
  const deleteSavedGLBModel = useConfigStore((s) => s.deleteSavedGLBModel);
  const setActiveTab = useConfigStore((s) => s.setActiveTab);
  const setTutorialModalOpen = useConfigStore((s) => s.setTutorialModalOpen);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Catálogo de Veículos
        </h3>
        <p className="text-xs text-showroom-muted mt-0.5">
          Selecione um modelo de fábrica, crie um carro novo do zero ou importe
          um arquivo .GLB.
        </p>
      </div>

      {/* CTA Principal: Criar Novo Carro Padronizado do Zero */}
      <button
        onClick={() => setActiveTab('create-car')}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-showroom-accent hover:bg-showroom-accentHover text-white text-xs font-bold uppercase tracking-wider shadow-neon-red transition-all"
      >
        <Hammer className="w-4 h-4" />
        <span>Criar Novo Carro do Zero</span>
      </button>

      {/* Veículos Padronizados Criados pelo Usuário */}
      {userCreatedVehicles.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Hammer className="w-3.5 h-3.5" />
            <span>Meus Carros Criados ({userCreatedVehicles.length})</span>
          </div>

          {userCreatedVehicles.map((vehicle) => {
            const isSelected =
              selectedVehicleId === vehicle.id && !customImportedGLB;

            return (
              <div
                key={vehicle.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-showroom-card to-showroom-panel border-showroom-accent shadow-neon-red'
                    : 'bg-showroom-card/60 border-showroom-border hover:border-white/25'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <button
                    onClick={() => selectVehicle(vehicle.id)}
                    className="text-left flex-1"
                  >
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 mb-1">
                      Custom • {vehicle.category}
                    </span>
                    <h4 className="font-display text-sm font-bold text-white">
                      {vehicle.name}
                    </h4>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-showroom-accent text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <button
                      onClick={() => deleteUserVehicle(vehicle.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
                      title="Excluir carro criado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => selectVehicle(vehicle.id)}
                  className="cursor-pointer"
                >
                  <p className="text-xs text-showroom-muted line-clamp-2 mb-2.5 leading-relaxed">
                    {vehicle.description}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-black/30 p-2 rounded-xl border border-white/5 mb-2">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Zap className="w-3 h-3 text-showroom-accent shrink-0" />
                      <span>{vehicle.specs.powerHp} cv</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Gauge className="w-3 h-3 text-showroom-accent shrink-0" />
                      <span>{vehicle.specs.acceleration0to100}s</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="w-3 h-3 text-showroom-accent shrink-0" />
                      <span>{vehicle.specs.topSpeedKmh} km/h</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-showroom-muted">Preço Base:</span>
                    <span className="font-display font-bold text-white">
                      {formatCurrency(vehicle.basePrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modelos .GLB Salvos pelo Usuário */}
      {savedGLBModels.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Meus Modelos .GLB Salvos ({savedGLBModels.length})</span>
          </div>

          {savedGLBModels.map((model) => {
            const isSelected = customImportedGLB?.savedModelId === model.id;

            return (
              <div
                key={model.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-showroom-card to-showroom-panel border-showroom-accent shadow-neon-red'
                    : 'bg-showroom-card/60 border-emerald-500/30 hover:border-emerald-400/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <button
                    onClick={() => selectSavedGLBModel(model.id)}
                    className="text-left flex-1"
                  >
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 mb-1">
                      GLB Salvo • {model.category}
                    </span>
                    <h4 className="font-display text-sm font-bold text-white">
                      {model.name}
                    </h4>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-showroom-accent text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <button
                      onClick={() => deleteSavedGLBModel(model.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
                      title="Excluir modelo GLB do catálogo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => selectSavedGLBModel(model.id)}
                  className="cursor-pointer"
                >
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-black/30 p-2 rounded-xl border border-white/5 mb-2">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{model.specs.powerHp} cv</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Gauge className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{model.specs.acceleration0to100}s</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{model.specs.topSpeedKmh} km/h</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-showroom-muted">Preço Base:</span>
                    <span className="font-display font-bold text-white">
                      {formatCurrency(model.basePrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Veículos Demonstrativos de Fábrica */}
      <div className="space-y-3">
        {VEHICLES_CATALOG.map((vehicle) => {
          const isSelected =
            selectedVehicleId === vehicle.id && !customImportedGLB;

          return (
            <button
              key={vehicle.id}
              onClick={() => selectVehicle(vehicle.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-showroom-card to-showroom-panel border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/60 border-showroom-border hover:border-white/25 hover:bg-showroom-card'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-showroom-muted mb-1">
                    {vehicle.category}
                  </span>
                  <h4 className="font-display text-sm font-bold text-white">
                    {vehicle.name}
                  </h4>
                </div>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-showroom-accent text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <p className="text-xs text-showroom-muted line-clamp-2 mb-3 leading-relaxed">
                {vehicle.description}
              </p>

              <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-black/30 p-2 rounded-xl border border-white/5 mb-2.5">
                <div className="flex items-center gap-1 text-slate-300">
                  <Zap className="w-3 h-3 text-showroom-accent shrink-0" />
                  <span>{vehicle.specs.powerHp} cv</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Gauge className="w-3 h-3 text-showroom-accent shrink-0" />
                  <span>{vehicle.specs.acceleration0to100}s</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-showroom-accent shrink-0" />
                  <span>{vehicle.specs.topSpeedKmh} km/h</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-showroom-muted">Preço Base:</span>
                <span className="font-display font-bold text-white">
                  {formatCurrency(vehicle.basePrice)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-showroom-border space-y-2">
        <button
          onClick={() => setActiveTab('import')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
        >
          <UploadCloud className="w-4 h-4 text-showroom-accent" />
          <span>Importar Arquivo Externo (.GLB)</span>
        </button>

        <button
          onClick={() => setTutorialModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs text-showroom-muted hover:text-white transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-showroom-accent" />
          <span>Como adicionar carros no código manualmente?</span>
        </button>
      </div>
    </div>
  );
};
