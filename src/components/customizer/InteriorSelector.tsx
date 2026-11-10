import React from 'react';
import { Check, Armchair, Eye } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { INTERIOR_OPTIONS } from '../../data/interiorOptions';
import { formatOptionPrice } from '../../utils/formatCurrency';

export const InteriorSelector: React.FC = () => {
  const selectedInteriorId = useConfigStore((s) => s.selectedInteriorId);
  const cameraView = useConfigStore((s) => s.cameraView);
  const selectInterior = useConfigStore((s) => s.selectInterior);
  const setCameraView = useConfigStore((s) => s.setCameraView);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);

  const vehicle = getActiveVehicle();
  const compatibleInteriors = INTERIOR_OPTIONS.filter((i) =>
    vehicle.compatibleInteriorIds.includes(i.id)
  );

  const isInteriorCam = cameraView === 'interior';

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Acabamento Interno
          </h3>
          <p className="text-xs text-showroom-muted mt-0.5">
            Personalize bancos, painel, console e costuras.
          </p>
        </div>
      </div>

      {/* Botão para alternar câmera de Cockpit (Interior) */}
      <button
        onClick={() => setCameraView(isInteriorCam ? 'free' : 'interior')}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
          isInteriorCam
            ? 'bg-showroom-accent text-white border-showroom-accent shadow-neon-red'
            : 'bg-white/5 text-white border-white/15 hover:bg-white/10'
        }`}
      >
        {isInteriorCam ? (
          <>
            <Eye className="w-4 h-4" />
            <span>Voltar para Câmera Externa</span>
          </>
        ) : (
          <>
            <Armchair className="w-4 h-4 text-showroom-accent" />
            <span>Entrar no Cockpit (Vista do Interior)</span>
          </>
        )}
      </button>

      <div className="space-y-3">
        {compatibleInteriors.map((interior) => {
          const isSelected = selectedInteriorId === interior.id;

          return (
            <button
              key={interior.id}
              onClick={() => selectInterior(interior.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-showroom-card border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/50 border-showroom-border hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Amostra Dupla de Couro + Costura */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex relative shrink-0">
                    <div
                      className="w-1/2 h-full"
                      style={{ backgroundColor: interior.primaryColor }}
                    />
                    <div
                      className="w-1/2 h-full"
                      style={{ backgroundColor: interior.secondaryColor }}
                    />
                    <div
                      className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2"
                      style={{ backgroundColor: interior.stitchingColor }}
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white">
                      {interior.name}
                    </div>
                    <div className="text-[11px] text-showroom-accent font-medium">
                      {formatOptionPrice(interior.price)}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-showroom-accent text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <p className="text-xs text-showroom-muted leading-relaxed">
                {interior.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
