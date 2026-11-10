import React from 'react';
import { Check, Disc, Sliders, RotateCcw } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { WHEEL_OPTIONS } from '../../data/wheelOptions';
import { formatOptionPrice } from '../../utils/formatCurrency';

const CALIPER_COLORS = [
  { name: 'Vermelho Brembo', hex: '#E11D48' },
  { name: 'Amarelo Cerâmica', hex: '#FACC15' },
  { name: 'Azul Performance', hex: '#2563EB' },
  { name: 'Verde Acid Neon', hex: '#84CC16' },
  { name: 'Laranja GT', hex: '#F97316' },
  { name: 'Preto Stealth', hex: '#1E293B' },
];

export const WheelSelector: React.FC = () => {
  const selectedWheelId = useConfigStore((s) => s.selectedWheelId);
  const exteriorDetails = useConfigStore((s) => s.exteriorDetails);
  const chassisConfig = useConfigStore((s) => s.chassisConfig);
  const selectWheel = useConfigStore((s) => s.selectWheel);
  const updateExteriorDetails = useConfigStore((s) => s.updateExteriorDetails);
  const updateChassisConfig = useConfigStore((s) => s.updateChassisConfig);
  const resetChassisConfig = useConfigStore((s) => s.resetChassisConfig);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const vehicle = getActiveVehicle();
  const compatibleWheels = WHEEL_OPTIONS.filter((w) =>
    vehicle.compatibleWheelIds.includes(w.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Rodas, Pinças de Freio & Stance
        </h3>
        <p className="text-xs text-showroom-muted mt-0.5">
          6 modelos de rodas + Cor das Pinças + Ajuste de Suspensão.
        </p>
      </div>

      {/* Cor das Pinças de Freio (Brake Calipers) */}
      <div className="bg-showroom-card/80 border border-showroom-border rounded-2xl p-3.5 space-y-2.5">
        <div className="text-xs font-semibold text-white">
          Cor das Pinças de Freio (Brake Calipers)
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {CALIPER_COLORS.map((cal) => {
            const isSelected = exteriorDetails.caliperColor === cal.hex;
            return (
              <button
                key={cal.hex}
                type="button"
                onClick={() => updateExteriorDetails({ caliperColor: cal.hex })}
                className={`p-2 rounded-xl border flex items-center gap-2 text-[11px] transition-all ${
                  isSelected
                    ? 'bg-showroom-accent/15 border-showroom-accent text-white'
                    : 'bg-black/30 border-white/10 text-showroom-muted hover:text-white'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                  style={{ backgroundColor: cal.hex }}
                />
                <span className="truncate">{cal.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ajuste de Suspensão & Stance das Rodas */}
      <div className="bg-showroom-card/80 border border-showroom-border rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Sliders className="w-3.5 h-3.5 text-showroom-accent" />
            Suspensão & Escala do Aro
          </span>
          <button
            type="button"
            onClick={resetChassisConfig}
            className="flex items-center gap-1 text-[10px] text-showroom-muted hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
            Resetar
          </button>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-showroom-muted">Altura da Suspensão</span>
            <span className="text-white font-mono">
              {chassisConfig.rideHeightOffset >= 0 ? '+' : ''}
              {Math.round(chassisConfig.rideHeightOffset * 100)} cm
            </span>
          </div>
          <input
            type="range"
            min="-0.10"
            max="0.16"
            step="0.01"
            value={chassisConfig.rideHeightOffset}
            onChange={(e) =>
              updateChassisConfig({
                rideHeightOffset: parseFloat(e.target.value),
              })
            }
            className="w-full accent-showroom-accent"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-showroom-muted">Tamanho das Rodas</span>
            <span className="text-white font-mono">
              {Math.round(chassisConfig.wheelScale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.88"
            max="1.18"
            step="0.02"
            value={chassisConfig.wheelScale}
            onChange={(e) =>
              updateChassisConfig({
                wheelScale: parseFloat(e.target.value),
              })
            }
            className="w-full accent-showroom-accent"
          />
        </div>
      </div>

      {/* Catálogo de 6 Rodas */}
      <div className="space-y-2.5">
        {compatibleWheels.map((wheel) => {
          const isSelected = selectedWheelId === wheel.id;

          return (
            <button
              key={wheel.id}
              onClick={() => selectWheel(wheel.id)}
              className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-showroom-card border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/50 border-showroom-border hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full border-2 border-slate-600 flex items-center justify-center relative shadow-inner shrink-0"
                    style={{ backgroundColor: wheel.accentColor }}
                  >
                    <Disc
                      className="w-6 h-6"
                      style={{ color: wheel.primaryColor }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {wheel.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                        {wheel.sizeInches}"
                      </span>
                    </div>
                    <span className="text-[11px] text-showroom-accent font-medium">
                      {formatOptionPrice(wheel.price)}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-showroom-accent text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <p className="text-xs text-showroom-muted leading-relaxed">
                {wheel.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
