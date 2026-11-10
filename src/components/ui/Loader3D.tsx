import React from 'react';
import { Html, useProgress } from '@react-three/drei';

export const Loader3D: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="bg-showroom-panel/95 backdrop-blur-xl border border-showroom-border px-6 py-4 rounded-2xl shadow-glass flex flex-col items-center gap-3 min-w-[220px]">
        <div className="w-10 h-10 rounded-full border-2 border-showroom-border border-t-showroom-accent animate-spin" />
        <div className="text-xs font-display tracking-widest uppercase text-white">
          Carregando Showroom 3D
        </div>
        <div className="w-full bg-showroom-card h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-showroom-accent h-full transition-all duration-300"
            style={{ width: `${Math.max(15, Math.round(progress))}%` }}
          />
        </div>
        <span className="text-[11px] text-showroom-muted">
          {Math.round(progress)}% concluído
        </span>
      </div>
    </Html>
  );
};
