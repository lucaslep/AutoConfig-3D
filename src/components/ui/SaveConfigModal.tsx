import React, { useEffect, useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { useDynamicPrice } from '../../hooks/useDynamicPrice';
import { formatCurrency } from '../../utils/formatCurrency';
import { PAINT_OPTIONS } from '../../data/paintOptions';
import { WHEEL_OPTIONS } from '../../data/wheelOptions';
import { INTERIOR_OPTIONS } from '../../data/interiorOptions';

export const SaveConfigModal: React.FC = () => {
  const isSaveModalOpen = useConfigStore((s) => s.isSaveModalOpen);
  const editingConfigId = useConfigStore((s) => s.editingConfigId);
  const savedConfigurations = useConfigStore((s) => s.savedConfigurations);
  const setSaveModalOpen = useConfigStore((s) => s.setSaveModalOpen);
  const saveCurrentConfiguration = useConfigStore(
    (s) => s.saveCurrentConfiguration
  );
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);
  const selectedPaintId = useConfigStore((s) => s.selectedPaintId);
  const selectedWheelId = useConfigStore((s) => s.selectedWheelId);
  const selectedInteriorId = useConfigStore((s) => s.selectedInteriorId);
  const selectedAccessoryIds = useConfigStore((s) => s.selectedAccessoryIds);

  const price = useDynamicPrice();
  const vehicle = getActiveVehicle();

  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (isSaveModalOpen) {
      if (editingConfigId) {
        const existing = savedConfigurations.find(
          (c) => c.id === editingConfigId
        );
        setProjectName(existing ? existing.name : `${vehicle.name} Personalizado`);
      } else {
        setProjectName(`${vehicle.name} #${savedConfigurations.length + 1}`);
      }
    }
  }, [isSaveModalOpen, editingConfigId, savedConfigurations, vehicle.name]);

  if (!isSaveModalOpen) return null;

  const paintName =
    PAINT_OPTIONS.find((p) => p.id === selectedPaintId)?.name || 'Personalizada';
  const wheelName =
    WHEEL_OPTIONS.find((w) => w.id === selectedWheelId)?.name || 'Padrão';
  const interiorName =
    INTERIOR_OPTIONS.find((i) => i.id === selectedInteriorId)?.name || 'Padrão';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentConfiguration(projectName, price.totalPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-showroom-panel border border-showroom-border rounded-2xl p-6 shadow-glass relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setSaveModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-showroom-muted hover:text-white hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-showroom-accent mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Garagem AutoConfig 3D</span>
        </div>

        <h3 className="font-display text-lg font-bold text-white mb-1">
          {editingConfigId
            ? 'Atualizar Configuração Salva'
            : 'Salvar Configuração Favorita'}
        </h3>
        <p className="text-xs text-showroom-muted mb-5">
          Sua configuração será salva localmente e poderá ser recarregada ou
          editada a qualquer momento.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nome do Projeto / Configuração
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ex: Meu Coupé Track Day"
              className="w-full px-3.5 py-2.5 rounded-xl bg-showroom-card border border-showroom-border text-sm text-white focus:outline-none focus:border-showroom-accent"
            />
          </div>

          <div className="bg-showroom-card/90 border border-showroom-border rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-showroom-muted">Veículo Base:</span>
              <span className="font-medium text-white">{vehicle.name}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-showroom-muted">Pintura:</span>
              <span>{paintName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-showroom-muted">Rodas:</span>
              <span>{wheelName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-showroom-muted">Interior:</span>
              <span>{interiorName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-showroom-muted">Acessórios Ativos:</span>
              <span>{selectedAccessoryIds.length} selecionado(s)</span>
            </div>
            <div className="border-t border-showroom-border pt-2 flex justify-between items-center">
              <span className="text-showroom-muted font-medium">
                Valor Demonstrativo Total:
              </span>
              <span className="font-display text-sm font-bold text-showroom-accent">
                {formatCurrency(price.totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSaveModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-showroom-muted hover:text-white hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-showroom-accent hover:bg-showroom-accentHover text-white shadow-neon-red transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{editingConfigId ? 'Atualizar' : 'Salvar na Garagem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
