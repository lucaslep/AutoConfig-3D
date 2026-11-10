import React, { useState } from 'react';
import {
  Hammer,
  Sliders,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import {
  VehicleArchetype,
  VehicleCategory,
} from '../../types/configurator';
import { PaintSelector } from './PaintSelector';
import { WheelSelector } from './WheelSelector';
import { InteriorSelector } from './InteriorSelector';
import { AccessorySelector } from './AccessorySelector';

const ARCHETYPES: {
  id: VehicleArchetype;
  label: string;
  category: VehicleCategory;
  desc: string;
}[] = [
  {
    id: 'sedan',
    label: 'Sedan GT 4P',
    category: 'Sedan Executivo',
    desc: 'Três volumes clássicos e entre-eixos longo',
  },
  {
    id: 'coupe',
    label: 'Coupé Esportivo',
    category: 'Coupé Esportivo',
    desc: 'Proporções equilibradas de pista 2 portas',
  },
  {
    id: 'hypercar',
    label: 'Hypercar V12',
    category: 'Superesportivo',
    desc: 'Monocoque ultra-baixo e largo de competição',
  },
  {
    id: 'suv',
    label: 'SUV Executivo',
    category: 'SUV Premium',
    desc: 'Porte elevado imponente e cabine ampla',
  },
  {
    id: 'pickup',
    label: 'Picape Off-Road',
    category: 'Picape Off-Road',
    desc: 'Suspensão elevada e caçamba traseira aberta',
  },
  {
    id: 'roadster',
    label: 'Roadster Conversível',
    category: 'Roadster Conversível',
    desc: 'Sem teto fixo com santantônio duplo e cockpit aberto',
  },
];

const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Passo 1: Carroceria & Chassi',
    subtitle: 'Escolha o formato básico e molde as dimensões 3D do carro.',
  },
  2: {
    title: 'Passo 2: Pintura, Faixas & Vidros',
    subtitle: 'Saia do Primer Cinza escolhendo a pintura PBR, faixas e faróis.',
  },
  3: {
    title: 'Passo 3: Rodas, Pinças & Stance',
    subtitle: 'Escolha o jogo de rodas 3D e a cor das pinças de freio.',
  },
  4: {
    title: 'Passo 4: Interior & Cockpit',
    subtitle: 'Personalize o couro dos bancos, painel e costuras internas.',
  },
  5: {
    title: 'Passo 5: Acessórios 3D',
    subtitle: 'Instale aerofólio, splitter, scoop de teto, rack ou neon.',
  },
  6: {
    title: 'Passo 6: Motorização & Finalizar',
    subtitle: 'Dê um nome ao seu carro, configure o motor e salve no catálogo!',
  },
};

export const CarCreatorPanel: React.FC = () => {
  const creatorStep = useConfigStore((s) => s.creatorStep);
  const setCreatorStep = useConfigStore((s) => s.setCreatorStep);
  const chassisConfig = useConfigStore((s) => s.chassisConfig);
  const updateChassisConfig = useConfigStore((s) => s.updateChassisConfig);
  const resetChassisConfig = useConfigStore((s) => s.resetChassisConfig);
  const createOrUpdateUserVehicle = useConfigStore(
    (s) => s.createOrUpdateUserVehicle
  );
  const setPreviewArchetype = useConfigStore((s) => s.setPreviewArchetype);
  const pbrSettings = useConfigStore((s) => s.pbrSettings);

  const [name, setName] = useState('Meu Projeto 01');
  const [subtitle, setSubtitle] = useState('Bespoke Custom Edition');
  const [archetype, setArchetype] = useState<VehicleArchetype>('sedan');
  const [category, setCategory] = useState<VehicleCategory>('Sedan Executivo');
  const [basePrice, setBasePrice] = useState(590000);
  const [powerHp, setPowerHp] = useState(520);
  const [accel, setAccel] = useState(3.4);
  const [topSpeed, setTopSpeed] = useState(310);
  const [engineType, setEngineType] = useState('3.8L V6 Biturbo');

  const handleArchetypeSelect = (item: (typeof ARCHETYPES)[number]) => {
    setArchetype(item.id);
    setCategory(item.category);
    setPreviewArchetype(item.id);
  };

  const handleFinishAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateUserVehicle({
      name,
      subtitle,
      category,
      archetype,
      description: `${subtitle} • Carroceria ${category} construída passo a passo com motor ${engineType} de ${powerHp} cv.`,
      basePrice,
      specs: {
        powerHp,
        acceleration0to100: accel,
        topSpeedKmh: topSpeed,
        drivetrain: 'AWD Torque Vectoring',
        engineType,
      },
      accentHex: pbrSettings.color,
      chassisConfig,
    });
  };

  const stepInfo = STEP_TITLES[creatorStep] || STEP_TITLES[1];

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Etapa Atual com Barra de Progresso */}
      <div className="bg-showroom-card border border-showroom-border rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-showroom-accent">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Construção Guiada
          </span>
          <span>Etapa {creatorStep} de 6</span>
        </div>

        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-showroom-accent transition-all duration-300"
            style={{ width: `${(creatorStep / 6) * 100}%` }}
          />
        </div>

        <h3 className="font-display text-sm font-bold text-white pt-0.5">
          {stepInfo.title}
        </h3>
        <p className="text-xs text-showroom-muted leading-relaxed">
          {stepInfo.subtitle}
        </p>
      </div>

      {/* CONTEÚDO DA ETAPA 1: CARROCERIA & CHASSI */}
      {creatorStep === 1 && (
        <div className="space-y-4">
          <div className="bg-showroom-card border border-showroom-border rounded-2xl p-3.5 space-y-2.5">
            <div className="text-xs font-semibold text-white">
              Escolha o Formato Base da Carroceria
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ARCHETYPES.map((item) => {
                const isSelected = archetype === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleArchetypeSelect(item)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-showroom-accent/20 border-showroom-accent text-white shadow-neon-red'
                        : 'bg-black/30 border-white/10 text-showroom-muted hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-showroom-muted leading-tight mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-showroom-card border border-showroom-border rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Sliders className="w-3.5 h-3.5 text-showroom-accent" />
                Proporções do Chassi (Ao Vivo no 3D)
              </span>
              <button
                type="button"
                onClick={resetChassisConfig}
                className="flex items-center gap-1 text-[10px] text-showroom-muted hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
                Zerar
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">
                  Altura da Suspensão (Stance)
                </span>
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
                <span className="text-showroom-muted">
                  Largura da Carroceria (Widebody)
                </span>
                <span className="text-white font-mono">
                  {Math.round(chassisConfig.bodyWidthScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.90"
                max="1.18"
                step="0.02"
                value={chassisConfig.bodyWidthScale}
                onChange={(e) =>
                  updateChassisConfig({
                    bodyWidthScale: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-showroom-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">
                  Comprimento / Entre-Eixos
                </span>
                <span className="text-white font-mono">
                  {Math.round(chassisConfig.bodyLengthScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.90"
                max="1.15"
                step="0.02"
                value={chassisConfig.bodyLengthScale}
                onChange={(e) =>
                  updateChassisConfig({
                    bodyLengthScale: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-showroom-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">
                  Altura do Teto (Chop-Top)
                </span>
                <span className="text-white font-mono">
                  {Math.round(chassisConfig.cabinHeightScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.82"
                max="1.16"
                step="0.02"
                value={chassisConfig.cabinHeightScale}
                onChange={(e) =>
                  updateChassisConfig({
                    cabinHeightScale: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-showroom-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">Diâmetro das Rodas</span>
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
        </div>
      )}

      {/* CONTEÚDO DA ETAPA 2: PINTURA, FAIXAS & VIDROS */}
      {creatorStep === 2 && <PaintSelector />}

      {/* CONTEÚDO DA ETAPA 3: RODAS & PINÇAS */}
      {creatorStep === 3 && <WheelSelector />}

      {/* CONTEÚDO DA ETAPA 4: INTERIOR & COCKPIT */}
      {creatorStep === 4 && <InteriorSelector />}

      {/* CONTEÚDO DA ETAPA 5: ACESSÓRIOS 3D */}
      {creatorStep === 5 && <AccessorySelector />}

      {/* CONTEÚDO DA ETAPA 6: IDENTIDADE, MOTORIZAÇÃO & SALVAR */}
      {creatorStep === 6 && (
        <form onSubmit={handleFinishAndSave} className="space-y-4">
          <div className="bg-showroom-card border border-showroom-border rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Último Passo: Identidade & Motor</span>
            </div>

            <div>
              <label className="block text-[11px] text-showroom-muted mb-1">
                Nome Oficial do Veículo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Apex GT-R Concept"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-showroom-border text-xs text-white focus:border-showroom-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-showroom-muted mb-1">
                  Subtítulo / Edição
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-showroom-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-showroom-muted mb-1">
                  Preço Base (R$)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-showroom-border text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-showroom-muted mb-1">
                  Potência (cv)
                </label>
                <input
                  type="number"
                  value={powerHp}
                  onChange={(e) => setPowerHp(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-showroom-muted mb-1">
                  0–100 (s)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={accel}
                  onChange={(e) => setAccel(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-showroom-muted mb-1">
                  Vel. Máx (km/h)
                </label>
                <input
                  type="number"
                  value={topSpeed}
                  onChange={(e) => setTopSpeed(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-showroom-muted mb-1">
                Configuração do Motor
              </label>
              <input
                type="text"
                value={engineType}
                onChange={(e) => setEngineType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
          >
            <Hammer className="w-4 h-4" />
            <span>Concluir e Salvar Carro no Catálogo</span>
          </button>
        </form>
      )}

      {/* Barra de Navegação entre os Passos (Anterior / Próximo) */}
      <div className="pt-2 border-t border-showroom-border flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={creatorStep <= 1}
          onClick={() => setCreatorStep(creatorStep - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium text-white transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {creatorStep < 6 && (
          <button
            type="button"
            onClick={() => setCreatorStep(creatorStep + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-showroom-accent hover:bg-showroom-accentHover text-white text-xs font-bold shadow-neon-red transition-all"
          >
            <span>Próxima Etapa ({creatorStep + 1}/6)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
