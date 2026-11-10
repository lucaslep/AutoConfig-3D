import React from 'react';
import { Zap, Gauge, Trophy, Bookmark } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { useDynamicPrice } from '../../hooks/useDynamicPrice';
import { formatCurrency } from '../../utils/formatCurrency';

export const BottomSpecsBar: React.FC = () => {
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);
  const setSaveModalOpen = useConfigStore((s) => s.setSaveModalOpen);
  const selectedAccessoryIds = useConfigStore((s) => s.selectedAccessoryIds);

  const vehicle = getActiveVehicle();
  const price = useDynamicPrice();

  // Pequeno bônus visual de aerodinâmica quando pacotes aerodinâmicos estão ativos
  const aeroBonus = selectedAccessoryIds.includes('acc-rear-spoiler') ? 4 : 0;

  return (
    <footer className="w-full bg-showroom-panel/90 backdrop-blur-xl border-t border-showroom-border px-4 lg:px-6 py-3 z-20 flex flex-wrap items-center justify-between gap-4">
      {/* Telemetria e Especificações Técnicas */}
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-showroom-accent">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-showroom-muted">
              Potência
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white">
              {vehicle.specs.powerHp}{' '}
              <span className="text-xs font-normal text-showroom-muted">cv</span>
            </div>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-showroom-border hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-showroom-accent">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-showroom-muted">
              0 a 100 km/h
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white">
              {vehicle.specs.acceleration0to100}{' '}
              <span className="text-xs font-normal text-showroom-muted">s</span>
            </div>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-showroom-border hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-showroom-accent">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-showroom-muted">
              Velocidade Máx.
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white">
              {vehicle.specs.topSpeedKmh + aeroBonus}{' '}
              <span className="text-xs font-normal text-showroom-muted">
                km/h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preço Dinâmico Atualizado e Botão Salvar */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-showroom-muted">
            Preço Configurado (Demonstrativo)
          </div>
          <div className="font-display text-base sm:text-xl font-extrabold text-white">
            {formatCurrency(price.totalPrice)}
          </div>
        </div>

        <button
          onClick={() => setSaveModalOpen(true, null)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-showroom-accent hover:bg-showroom-accentHover active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-neon-red transition-all duration-150"
        >
          <Bookmark className="w-4 h-4" />
          <span>Salvar Configuração</span>
        </button>
      </div>
    </footer>
  );
};
