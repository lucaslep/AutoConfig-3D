import React from 'react';
import { Check, Sliders, Sparkles, Sun, Shield } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { PAINT_OPTIONS } from '../../data/paintOptions';
import { formatOptionPrice } from '../../utils/formatCurrency';
import { LiveryStyle, PaintFinishType } from '../../types/configurator';

const HEADLIGHT_COLORS = [
  { label: 'Xenon White', hex: '#F8FAFC' },
  { label: 'GT3 Âmbar', hex: '#FACC15' },
  { label: 'Laser Blue', hex: '#38BDF8' },
  { label: 'Demon Red', hex: '#EF4444' },
];

export const PaintSelector: React.FC = () => {
  const selectedPaintId = useConfigStore((s) => s.selectedPaintId);
  const pbrSettings = useConfigStore((s) => s.pbrSettings);
  const exteriorDetails = useConfigStore((s) => s.exteriorDetails);
  const selectPaint = useConfigStore((s) => s.selectPaint);
  const updatePBRSettings = useConfigStore((s) => s.updatePBRSettings);
  const updateExteriorDetails = useConfigStore((s) => s.updateExteriorDetails);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const vehicle = getActiveVehicle();
  const availablePaints = PAINT_OPTIONS.filter((p) =>
    vehicle.compatiblePaintIds.includes(p.id)
  );

  const handleFinishPreset = (preset: PaintFinishType) => {
    if (preset === 'matte') {
      updatePBRSettings({
        finishPreset: 'matte',
        metalness: 0.3,
        roughness: 0.58,
        clearcoat: 0.1,
      });
    } else if (preset === 'metallic') {
      updatePBRSettings({
        finishPreset: 'metallic',
        metalness: 0.82,
        roughness: 0.16,
        clearcoat: 1.0,
      });
    } else {
      updatePBRSettings({
        finishPreset: 'pearlescent',
        metalness: 0.5,
        roughness: 0.12,
        clearcoat: 1.0,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Pintura, Faixas & Vidros
        </h3>
        <p className="text-xs text-showroom-muted mt-0.5">
          12 tintas automotivas + Faixas Livery + Película e Faróis LED.
        </p>
      </div>

      {/* Paleta de 12 Cores de Fábrica */}
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
        {availablePaints.map((paint) => {
          const isSelected = selectedPaintId === paint.id;

          return (
            <button
              key={paint.id}
              onClick={() => selectPaint(paint.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-showroom-card border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/50 border-showroom-border hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow-inner relative flex items-center justify-center shrink-0"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #ffffff55, ${paint.hex} 65%, #00000099)`,
                  }}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">
                    {paint.name}
                  </div>
                  <div className="text-[10px] text-showroom-muted">
                    {paint.finishLabel}
                  </div>
                </div>
              </div>

              <span className="text-xs font-medium text-slate-300">
                {formatOptionPrice(paint.price)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Faixas Esportivas (Racing Stripes) & Capô em Carbono */}
      <div className="bg-showroom-card/80 border border-showroom-border rounded-2xl p-3.5 space-y-3">
        <div className="text-xs font-semibold text-white">
          Faixas Esportivas (Livery) & Capô
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              { id: 'none', label: 'Pintura Lisa' },
              { id: 'dual-stripe', label: 'Faixa Dupla GT' },
              { id: 'center-stripe', label: 'Faixa Central' },
              { id: 'carbon-hood', label: 'Capô/Teto Carbono' },
            ] as { id: LiveryStyle; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateExteriorDetails({ liveryStyle: item.id })}
              className={`py-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-all ${
                exteriorDetails.liveryStyle === item.id
                  ? 'bg-showroom-accent/20 border-showroom-accent text-white'
                  : 'bg-black/30 border-white/10 text-showroom-muted hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {(exteriorDetails.liveryStyle === 'dual-stripe' ||
          exteriorDetails.liveryStyle === 'center-stripe') && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-showroom-muted">Cor da Faixa:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={exteriorDetails.liveryColor}
                onChange={(e) =>
                  updateExteriorDetails({ liveryColor: e.target.value })
                }
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-300 uppercase">
                {exteriorDetails.liveryColor}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Película dos Vidros (Insulfilm) e Faróis LED */}
      <div className="bg-showroom-card/80 border border-showroom-border rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Shield className="w-3.5 h-3.5 text-showroom-accent" />
            Película dos Vidros (Insulfilm)
          </span>
          <span className="text-[11px] font-mono text-white">
            {Math.round(exteriorDetails.windowTintOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.25"
          max="0.94"
          step="0.03"
          value={exteriorDetails.windowTintOpacity}
          onChange={(e) =>
            updateExteriorDetails({
              windowTintOpacity: parseFloat(e.target.value),
            })
          }
          className="w-full accent-showroom-accent cursor-pointer"
        />

        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Sun className="w-3.5 h-3.5 text-showroom-accent" />
              Faróis DRL LED
            </span>
            <button
              type="button"
              onClick={() =>
                updateExteriorDetails({
                  headlightsOn: !exteriorDetails.headlightsOn,
                })
              }
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                exteriorDetails.headlightsOn
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-showroom-muted'
              }`}
            >
              {exteriorDetails.headlightsOn ? 'Faróis Acesos' : 'Faróis Apagados'}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {HEADLIGHT_COLORS.map((hl) => (
              <button
                key={hl.hex}
                type="button"
                onClick={() =>
                  updateExteriorDetails({
                    headlightColor: hl.hex,
                    headlightsOn: true,
                  })
                }
                className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border flex flex-col items-center gap-1 ${
                  exteriorDetails.headlightColor === hl.hex
                    ? 'border-showroom-accent bg-showroom-accent/15 text-white'
                    : 'border-white/10 bg-black/30 text-showroom-muted'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/30"
                  style={{ backgroundColor: hl.hex }}
                />
                <span className="truncate max-w-full">{hl.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Laboratório de Pintura PBR (Controle Fino em Tempo Real) */}
      <div className="bg-showroom-card/80 border border-showroom-border rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Sliders className="w-3.5 h-3.5 text-showroom-accent" />
            <span>Ajuste Físico do Material (PBR)</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-showroom-accent" />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { id: 'metallic', label: 'Metálico' },
              { id: 'matte', label: 'Fosco' },
              { id: 'pearlescent', label: 'Perolizado' },
            ] as { id: PaintFinishType; label: string }[]
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleFinishPreset(mode.id)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-all ${
                pbrSettings.finishPreset === mode.id
                  ? 'bg-showroom-accent/20 border-showroom-accent text-white'
                  : 'bg-black/30 border-white/10 text-showroom-muted hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="text-xs text-showroom-muted">
            Cor Customizada (HEX):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={pbrSettings.color}
              onChange={(e) => updatePBRSettings({ color: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-xs font-mono text-slate-300 uppercase">
              {pbrSettings.color}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-showroom-muted">Metalness (Metalicidade)</span>
            <span className="text-white font-mono">
              {Math.round(pbrSettings.metalness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={pbrSettings.metalness}
            onChange={(e) =>
              updatePBRSettings({ metalness: parseFloat(e.target.value) })
            }
            className="w-full accent-showroom-accent cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-showroom-muted">Roughness (Rugosidade/Fosco)</span>
            <span className="text-white font-mono">
              {Math.round(pbrSettings.roughness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.04"
            max="0.85"
            step="0.02"
            value={pbrSettings.roughness}
            onChange={(e) =>
              updatePBRSettings({ roughness: parseFloat(e.target.value) })
            }
            className="w-full accent-showroom-accent cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-showroom-muted">Clearcoat (Verniz Automotivo)</span>
            <span className="text-white font-mono">
              {Math.round(pbrSettings.clearcoat * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={pbrSettings.clearcoat}
            onChange={(e) =>
              updatePBRSettings({ clearcoat: parseFloat(e.target.value) })
            }
            className="w-full accent-showroom-accent cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
