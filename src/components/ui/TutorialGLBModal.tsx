import React from 'react';
import { X, BookOpen, CheckCircle2, Box, Layers, Wrench } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';

export const TutorialGLBModal: React.FC = () => {
  const isOpen = useConfigStore((s) => s.isTutorialModalOpen);
  const setOpen = useConfigStore((s) => s.setTutorialModalOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-showroom-panel border border-showroom-border rounded-2xl p-6 shadow-glass relative">
        <button
          onClick={() => setOpen(false)}
          className="sticky top-2 float-right p-2 rounded-lg text-showroom-muted hover:text-white hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-showroom-accent mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Guia de Engenharia 3D — AutoConfig 3D</span>
        </div>

        <h2 className="font-display text-xl font-bold text-white mb-4">
          Como Adicionar Novos Modelos de Carros (.GLB / .GLTF)
        </h2>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-showroom-card border border-showroom-border rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-showroom-accent" />
              1. Onde encontrar modelos 3D com licença adequada
            </h3>
            <p className="text-showroom-muted">
              Procure modelos no <strong>Sketchfab</strong> (filtrando por{' '}
              <em>Downloadable</em> e licenças <em>CC-BY</em> ou <em>CC0</em>),{' '}
              <strong>Poly Pizza</strong>, <strong> Kenney.nl</strong> ou{' '}
              <strong>BlenderKit</strong>. Sempre baixe no formato{' '}
              <code className="text-rose-400">.glb</code> (GLTF binário
              compactado em arquivo único com texturas embutidas).
            </p>
          </div>

          <div className="bg-showroom-card border border-showroom-border rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 text-showroom-accent" />
              2. Onde salvar o arquivo e como cadastrar no Catálogo
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-showroom-muted">
              <li>
                Crie uma subpasta em{' '}
                <code className="text-white">public/models/meu-carro/</code> e
                coloque o arquivo <code className="text-white">carro.glb</code>.
              </li>
              <li>
                Abra a aba <strong>Importar GLB</strong> na barra esquerda e
                carregue seu arquivo para descobrir automaticamente os nomes de
                todos os materiais (<code className="text-emerald-400">detectedMaterials</code>)
                e malhas (<code className="text-emerald-400">detectedMeshes</code>).
              </li>
              <li>
                Abra <code className="text-white">src/data/vehiclesCatalog.ts</code>,
                adicione um novo item no array <code className="text-white">VEHICLES_CATALOG</code>{' '}
                com <code className="text-rose-400">glbPath: '/models/meu-carro/carro.glb'</code>{' '}
                e preencha os nomes dos materiais em <code className="text-white">modelMapping</code>.
              </li>
            </ol>
          </div>

          <div className="bg-showroom-card border border-showroom-border rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-showroom-accent" />
              3. Como preparar Rodas e Acessórios no Blender
            </h3>
            <p className="text-showroom-muted mb-2">
              Nem todo modelo 3D baixado da internet vem com as rodas ou o
              aerofólio separados da carroceria. Caso queira preparar um modelo
              no <strong>Blender</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-showroom-muted">
              <li>
                Abra o arquivo no Blender (<code className="text-white">File &gt; Import &gt; glTF 2.0</code>).
              </li>
              <li>
                Entre no <em>Edit Mode</em> (<code className="text-white">Tab</code>),
                selecione os polígonos do aerofólio ou das rodas e pressione{' '}
                <code className="text-white">P &gt; Selection</code> para separar em um objeto próprio.
              </li>
              <li>
                Renomeie a malha no Outliner para <code className="text-emerald-400">Accessory_Spoiler</code>{' '}
                e o material da pintura da lataria para <code className="text-emerald-400">BodyPaint</code>.
              </li>
              <li>
                Aplique escala e rotação (<code className="text-white">Ctrl + A &gt; All Transforms</code>)
                e exporte novamente como <code className="text-white">.glb</code>.
              </li>
            </ul>
          </div>

          <div className="bg-showroom-card border border-showroom-border rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-showroom-accent" />
              4. Exemplo de Mapeamento no vehiclesCatalog.ts
            </h3>
            <pre className="bg-black/60 p-3 rounded-lg text-[11px] text-emerald-300 overflow-x-auto">
{`modelMapping: {
  scale: 1.0,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  bodyMaterialNames: ['BodyPaint', 'Car_Paint_Material'],
  wheelMaterialNames: ['WheelRim', 'Alloy_Rim'],
  interiorMaterialNames: ['InteriorLeather', 'Seats_Mat'],
  glassMaterialNames: ['WindowGlass'],
  caliperMaterialNames: ['BrakeCaliper'],
  accessoryMeshNames: {
    spoiler: ['Accessory_Spoiler'],
    frontSplitter: ['Accessory_FrontSplitter'],
  },
  supportsWheelSwap: true,
  supportsInteriorCamera: true,
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
