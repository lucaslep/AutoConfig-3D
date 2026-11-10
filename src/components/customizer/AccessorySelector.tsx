import React from 'react';
import { Check, Plus, Ban, Sparkles } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { ACCESSORY_OPTIONS } from '../../data/accessoryOptions';
import { formatCurrency } from '../../utils/formatCurrency';

export const AccessorySelector: React.FC = () => {
  const selectedAccessoryIds = useConfigStore((s) => s.selectedAccessoryIds);
  const exteriorDetails = useConfigStore((s) => s.exteriorDetails);
  const toggleAccessory = useConfigStore((s) => s.toggleAccessory);
  const updateExteriorDetails = useConfigStore((s) => s.updateExteriorDetails);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const vehicle = getActiveVehicle();
  const isUnderglowActive = selectedAccessoryIds.includes('acc-neon-underglow');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Acessórios & Aerodinâmica (9 Opções)
        </h3>
        <p className="text-xs text-showroom-muted mt-0.5">
          Ative ou remova componentes 3D compatíveis em tempo real.
        </p>
      </div>

      {/* Seletor de Cor do Neon Underglow quando ativado */}
      {isUnderglowActive && (
        <div className="p-3 rounded-xl bg-showroom-card border border-showroom-accent/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-white">
            Cor do LED Underglow:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={exteriorDetails.underglowColor}
              onChange={(e) =>
                updateExteriorDetails({ underglowColor: e.target.value })
              }
              className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-xs font-mono text-slate-300 uppercase">
              {exteriorDetails.underglowColor}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {ACCESSORY_OPTIONS.map((accessory) => {
          const isCompatible = vehicle.compatibleAccessoryIds.includes(
            accessory.id
          );
          const isActive =
            isCompatible && selectedAccessoryIds.includes(accessory.id);

          return (
            <div
              key={accessory.id}
              className={`p-3 rounded-2xl border transition-all duration-200 ${
                !isCompatible
                  ? 'bg-showroom-card/20 border-showroom-border/50 opacity-55'
                  : isActive
                  ? 'bg-showroom-card border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/50 border-showroom-border hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {accessory.name}
                    </span>
                    {!isCompatible && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Incompatível
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-showroom-accent mt-0.5">
                    + {formatCurrency(accessory.price)}
                  </div>
                </div>

                {isCompatible ? (
                  <button
                    onClick={() => toggleAccessory(accessory.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                      isActive
                        ? 'bg-showroom-accent text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Instalado</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-1.5 rounded-lg bg-white/5 text-showroom-muted">
                    <Ban className="w-4 h-4" />
                  </div>
                )}
              </div>

              <p className="text-xs text-showroom-muted leading-relaxed">
                {accessory.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-[11px] text-showroom-muted">
        <Sparkles className="w-4 h-4 text-showroom-accent shrink-0" />
        <span>
          Cada peça ativada atualiza imediatamente a malha 3D do veículo e soma
          ao orçamento demonstrativo.
        </span>
      </div>
    </div>
  );
};
