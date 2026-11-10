import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConfigStore } from '../../store/useConfigStore';
import { ModelsPanel } from '../customizer/ModelsPanel';
import { CarCreatorPanel } from '../customizer/CarCreatorPanel';
import { PaintSelector } from '../customizer/PaintSelector';
import { WheelSelector } from '../customizer/WheelSelector';
import { InteriorSelector } from '../customizer/InteriorSelector';
import { AccessorySelector } from '../customizer/AccessorySelector';
import { SavedBuildsPanel } from '../customizer/SavedBuildsPanel';
import { CustomModelUpload } from '../customizer/CustomModelUpload';

export const RightPanel: React.FC = () => {
  const activeTab = useConfigStore((s) => s.activeTab);
  const creatorStep = useConfigStore((s) => s.creatorStep);
  const asideRef = useRef<HTMLElement>(null);

  // Sempre que mudar de aba ou avançar/voltar uma etapa na criação do carro, rola o painel de volta para o topo!
  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, creatorStep]);

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'models':
        return <ModelsPanel />;
      case 'create-car':
        return <CarCreatorPanel />;
      case 'paint':
        return <PaintSelector />;
      case 'wheels':
        return <WheelSelector />;
      case 'interior':
        return <InteriorSelector />;
      case 'accessories':
        return <AccessorySelector />;
      case 'saved':
        return <SavedBuildsPanel />;
      case 'import':
        return <CustomModelUpload />;
      default:
        return <ModelsPanel />;
    }
  };

  return (
    <aside
      ref={asideRef}
      className="w-full lg:w-80 xl:w-96 max-h-[38vh] lg:max-h-none bg-showroom-panel/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-showroom-border p-4 lg:p-5 overflow-y-auto z-20 shrink-0"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${activeTab === 'create-car' ? creatorStep : 0}`}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {renderPanelContent()}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};
