import React from 'react';
import {
  FolderOpen,
  Trash2,
  Edit3,
  PlusCircle,
  Calendar,
  Database,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { formatCurrency } from '../../utils/formatCurrency';

export const SavedBuildsPanel: React.FC = () => {
  const savedConfigurations = useConfigStore((s) => s.savedConfigurations);
  const loadConfiguration = useConfigStore((s) => s.loadConfiguration);
  const deleteConfiguration = useConfigStore((s) => s.deleteConfiguration);
  const setSaveModalOpen = useConfigStore((s) => s.setSaveModalOpen);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Minhas Configurações
          </h3>
          <p className="text-xs text-showroom-muted mt-0.5">
            Projetos salvos no navegador (LocalStorage + Supabase Ready).
          </p>
        </div>
      </div>

      <button
        onClick={() => setSaveModalOpen(true, null)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-showroom-accent hover:bg-showroom-accentHover text-white text-xs font-semibold shadow-neon-red transition-all"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Salvar Configuração Atual</span>
      </button>

      {savedConfigurations.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl bg-showroom-card/40 border border-showroom-border">
          <FolderOpen className="w-8 h-8 text-showroom-muted mx-auto mb-2 opacity-60" />
          <div className="text-xs font-semibold text-white mb-1">
            Nenhuma configuração salva ainda
          </div>
          <p className="text-[11px] text-showroom-muted">
            Personalize seu veículo e clique em &ldquo;Salvar Configuração&rdquo;
            para guardar seus projetos favoritos.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedConfigurations.map((item) => {
            const formattedDate = new Date(item.updatedAt).toLocaleDateString(
              'pt-BR',
              {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-showroom-card border border-showroom-border hover:border-white/20 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: item.pbrSettings.color }}
                      title={`Cor: ${item.pbrSettings.color}`}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-showroom-muted">
                        {item.vehicleName}
                      </span>
                    </div>
                  </div>

                  <span className="font-display text-xs font-bold text-showroom-accent">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-showroom-muted pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <span>{item.accessoryIds.length} acessório(s)</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => loadConfiguration(item)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-showroom-accent text-white text-xs font-medium transition-all"
                  >
                    Carregar
                  </button>
                  <button
                    onClick={() => {
                      loadConfiguration(item);
                      setSaveModalOpen(true, item.id);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all"
                    title="Editar e sobrescrever esta configuração"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteConfiguration(item.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-all"
                    title="Excluir configuração"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-3 rounded-xl bg-black/40 border border-showroom-border flex items-start gap-2.5 text-[11px] text-showroom-muted">
        <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Arquitetura desacoplada via <code className="text-white">storageService.ts</code>:
          pronta para sincronizar com <strong>Supabase</strong> apenas adicionando
          as variáveis <code className="text-white">VITE_SUPABASE_URL</code>.
        </span>
      </div>
    </div>
  );
};
