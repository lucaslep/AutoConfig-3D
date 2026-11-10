import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SidebarLeft } from './components/layout/SidebarLeft';
import { TopBarModels } from './components/layout/TopBarModels';
import { RightPanel } from './components/layout/RightPanel';
import { BottomSpecsBar } from './components/layout/BottomSpecsBar';
import { ShowroomCanvas } from './components/canvas3d/ShowroomCanvas';
import { CameraControlsHUD } from './components/ui/CameraControlsHUD';
import { SaveConfigModal } from './components/ui/SaveConfigModal';
import { TutorialGLBModal } from './components/ui/TutorialGLBModal';
import { useConfigStore } from './store/useConfigStore';

export default function App() {
  const activeTab = useConfigStore((s) => s.activeTab);
  const notificationMessage = useConfigStore((s) => s.notificationMessage);
  const getActiveVehicle = useConfigStore((s) => s.getActiveVehicle);
  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const hydrateSavedGLBModels = useConfigStore((s) => s.hydrateSavedGLBModels);

  useEffect(() => {
    hydrateSavedGLBModels();
  }, [hydrateSavedGLBModels]);

  const vehicle = getActiveVehicle();
  const isCreatingCar = activeTab === 'create-car';

  return (
    <div className="h-screen w-screen bg-showroom-bg text-white flex flex-col lg:flex-row overflow-hidden select-none">
      {/* 1. Barra Lateral Esquerda (Logo & Navegação) */}
      <SidebarLeft />

      {/* 2. Coluna Central + Direita */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* 2.1. Barra Superior (Seleção Rápida de Carros em Cards) */}
        <TopBarModels />

        {/* 2.2. Área Principal (Visualizador 3D Central + Painel Lateral Direito) */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative overflow-hidden">
          {/* Palco 3D Central */}
          <main className="relative flex-1 h-full min-h-[300px] flex flex-col overflow-hidden">
            {/* Badge Flutuante de Identificação do Veículo no Showroom */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-showroom-panel/75 backdrop-blur-md border border-showroom-border text-[11px] uppercase tracking-widest text-showroom-muted mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCreatingCar ? 'bg-amber-400 animate-pulse' : 'bg-showroom-accent'
                  }`}
                />
                <span>
                  {isCreatingCar
                    ? 'Modo Construtor • Chassi Base'
                    : customImportedGLB
                    ? customImportedGLB.category
                    : vehicle.category}
                </span>
              </div>
              <h1 className="font-display text-lg sm:text-2xl font-extrabold tracking-wider text-white drop-shadow">
                {isCreatingCar
                  ? 'Protótipo Base (Em Construção)'
                  : customImportedGLB
                  ? customImportedGLB.customName
                  : vehicle.name}
              </h1>
              <p className="text-xs text-showroom-muted hidden sm:block">
                {isCreatingCar
                  ? 'Molde a plataforma, dimensões do chassi e salve no catálogo'
                  : customImportedGLB
                  ? `Arquivo 3D: ${customImportedGLB.fileName}`
                  : `${vehicle.subtitle} • ${vehicle.specs.engineType}`}
              </p>
            </div>

            {/* Canvas Three.js / React Three Fiber */}
            <ShowroomCanvas />

            {/* Controles de Câmera em Linha Única na Parte Inferior */}
            <CameraControlsHUD />
          </main>

          {/* Painel Direito de Personalização */}
          <RightPanel />
        </div>

        {/* 2.3. Barra Inferior (Potência, 0-100, Vel. Máxima, Preço Dinâmico e Salvar) */}
        <BottomSpecsBar />
      </div>

      {/* Modais e Feedback Visual */}
      <SaveConfigModal />
      <TutorialGLBModal />

      <AnimatePresence>
        {notificationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-showroom-panel/95 backdrop-blur-xl border border-emerald-500/40 text-xs font-medium text-white shadow-glass"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
