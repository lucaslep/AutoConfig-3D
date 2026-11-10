import React from 'react';
import {
  Car,
  Hammer,
  Palette,
  Disc,
  Armchair,
  Wrench,
  Bookmark,
  UploadCloud,
  Lock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { CustomizationTab } from '../../types/configurator';

const NAV_ITEMS: {
  id: CustomizationTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'models', label: 'Modelos', icon: <Car className="w-4 h-4 shrink-0" /> },
  {
    id: 'create-car',
    label: 'Criar Carro',
    icon: <Hammer className="w-4 h-4 shrink-0" />,
  },
  { id: 'paint', label: 'Pintura', icon: <Palette className="w-4 h-4 shrink-0" /> },
  { id: 'wheels', label: 'Rodas', icon: <Disc className="w-4 h-4 shrink-0" /> },
  { id: 'interior', label: 'Interior', icon: <Armchair className="w-4 h-4 shrink-0" /> },
  { id: 'accessories', label: 'Acessórios', icon: <Wrench className="w-4 h-4 shrink-0" /> },
  {
    id: 'saved',
    label: 'Minhas Configs',
    icon: <Bookmark className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'import',
    label: 'Importar 3D',
    icon: <UploadCloud className="w-4 h-4 shrink-0" />,
  },
];

const CREATOR_STEPS = [
  { step: 1, label: '1. Modelo & Chassi' },
  { step: 2, label: '2. Pintura & Vidros' },
  { step: 3, label: '3. Rodas & Freios' },
  { step: 4, label: '4. Interior' },
  { step: 5, label: '5. Acessórios 3D' },
  { step: 6, label: '6. Motor & Salvar' },
];

export const SidebarLeft: React.FC = () => {
  const activeTab = useConfigStore((s) => s.activeTab);
  const creatorStep = useConfigStore((s) => s.creatorStep);
  const savedCount = useConfigStore((s) => s.savedConfigurations.length);
  const userCarCount = useConfigStore((s) => s.userCreatedVehicles.length);
  const setActiveTab = useConfigStore((s) => s.setActiveTab);
  const setCreatorStep = useConfigStore((s) => s.setCreatorStep);
  const cancelCarCreation = useConfigStore((s) => s.cancelCarCreation);

  const isLockedInCreator = activeTab === 'create-car';

  return (
    <aside className="w-full lg:w-44 bg-showroom-panel/90 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-showroom-border flex lg:flex-col justify-between z-30 shrink-0">
      <div>
        <div className="px-3 py-3 lg:py-4 border-b border-showroom-border flex items-center justify-between lg:justify-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-showroom-accent flex items-center justify-center shadow-neon-red shrink-0">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-xs font-extrabold tracking-wider text-white leading-none truncate">
                AUTOCONFIG <span className="text-showroom-accent">3D</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-showroom-muted block mt-0.5">
                Showroom Studio
              </span>
            </div>
          </div>
        </div>

        {isLockedInCreator ? (
          /* MODO CRIAÇÃO PASSO A PASSO: Menu lateral bloqueado exibindo as 6 etapas */
          <div className="p-2.5 space-y-2">
            <div className="px-2.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">Modo Criação Ativo</span>
            </div>

            <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              {CREATOR_STEPS.map((s) => {
                const isCurrent = creatorStep === s.step;
                const isDone = creatorStep > s.step;

                return (
                  <button
                    key={s.step}
                    onClick={() => setCreatorStep(s.step)}
                    className={`flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all ${
                      isCurrent
                        ? 'bg-showroom-accent text-white shadow-neon-red font-bold'
                        : isDone
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-showroom-muted opacity-65 hover:opacity-100'
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    {isDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Abas Gerais Bloqueadas Visualmente */}
            <div className="hidden lg:block pt-2 border-t border-showroom-border space-y-1 opacity-40 pointer-events-none select-none">
              <div className="text-[9px] uppercase tracking-wider text-showroom-muted px-2 mb-1 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Menu Bloqueado</span>
              </div>
              {NAV_ITEMS.filter((i) => i.id !== 'create-car')
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-showroom-muted"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    <Lock className="w-3 h-3 shrink-0" />
                  </div>
                ))}
            </div>

            <button
              onClick={cancelCarCreation}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
            >
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Sair da Criação</span>
            </button>
          </div>
        ) : (
          /* NAVEGAÇÃO NORMAL DESBLOQUEADA */
          <nav className="flex lg:flex-col gap-1 p-2 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const badgeCount =
                item.id === 'saved'
                  ? savedCount
                  : item.id === 'create-car'
                  ? userCarCount
                  : 0;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-showroom-accent text-white shadow-neon-red'
                      : 'text-showroom-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isActive
                          ? 'bg-white text-showroom-accent'
                          : 'bg-showroom-accent/20 text-showroom-accent'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <div className="hidden lg:block p-2.5 border-t border-showroom-border">
        <div className="p-2.5 rounded-xl bg-showroom-card/70 border border-showroom-border text-[10px] text-showroom-muted space-y-1">
          <div className="text-white font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              {isLockedInCreator ? `Etapa ${creatorStep} de 6` : 'Motor PBR Ativo'}
            </span>
          </div>
          <p className="leading-snug">
            {isLockedInCreator
              ? 'Siga o passo a passo no painel direito para concluir seu carro.'
              : 'Arraste para girar 360° e use o scroll para zoom.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
