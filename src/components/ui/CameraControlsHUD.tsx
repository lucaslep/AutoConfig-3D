import React from 'react';
import {
  Camera,
  RotateCcw,
  RefreshCw,
  Eye,
  Armchair,
  Move3d,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { CameraView } from '../../types/configurator';

const CAMERA_VIEWS: { id: CameraView; label: string; icon?: React.ReactNode }[] =
  [
    { id: 'free', label: '360° Livre', icon: <Move3d className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'front', label: 'Frontal', icon: <Eye className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'rear', label: 'Traseira', icon: <Camera className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'side', label: 'Lateral', icon: <Camera className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'interior', label: 'Interior', icon: <Armchair className="w-3.5 h-3.5 shrink-0" /> },
  ];

export const CameraControlsHUD: React.FC = () => {
  const cameraView = useConfigStore((s) => s.cameraView);
  const autoRotate = useConfigStore((s) => s.autoRotate);
  const setCameraView = useConfigStore((s) => s.setCameraView);
  const toggleAutoRotate = useConfigStore((s) => s.toggleAutoRotate);
  const resetCamera = useConfigStore((s) => s.resetCamera);

  return (
    <div className="w-full z-20 bg-showroom-panel/90 backdrop-blur-xl border-t border-showroom-border px-2.5 sm:px-4 py-2 shrink-0 overflow-hidden">
      <div className="w-full grid grid-cols-7 gap-1.5 items-center">
        {CAMERA_VIEWS.map((view) => {
          const isActive = cameraView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setCameraView(view.id)}
              className={`min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-showroom-accent text-white border-showroom-accent shadow-neon-red'
                  : 'bg-showroom-card/70 text-showroom-muted border-showroom-border hover:text-white hover:border-white/20 hover:bg-showroom-card'
              }`}
              title={`Mudar para vista ${view.label}`}
            >
              {view.icon}
              <span className="truncate">{view.label}</span>
            </button>
          );
        })}

        <button
          onClick={toggleAutoRotate}
          className={`min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
            autoRotate
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-showroom-card/70 text-showroom-muted border-showroom-border hover:text-white hover:border-white/20 hover:bg-showroom-card'
          }`}
          title="Ativar ou desativar rotação automática 360°"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 shrink-0 ${autoRotate ? 'animate-spin' : ''}`}
          />
          <span className="truncate">Auto-Giro</span>
        </button>

        <button
          onClick={resetCamera}
          className="min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap bg-showroom-card/70 text-showroom-muted border border-showroom-border hover:text-white hover:border-white/20 hover:bg-showroom-card transition-all duration-200"
          title="Restaurar posição padrão da câmera"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Resetar</span>
        </button>
      </div>
    </div>
  );
};
