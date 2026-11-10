import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Trash2,
  Sliders,
  Layers,
  Eye,
  EyeOff,
  BookOpen,
  Save,
  HardDriveDownload,
  Check,
  CarFront,
} from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';
import { Vehicle } from '../../types/configurator';
import { formatCurrency } from '../../utils/formatCurrency';

export const CustomModelUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const customImportedGLB = useConfigStore((s) => s.customImportedGLB);
  const savedGLBModels = useConfigStore((s) => s.savedGLBModels);
  const setCustomImportedGLB = useConfigStore((s) => s.setCustomImportedGLB);
  const updateCustomGLBMeta = useConfigStore((s) => s.updateCustomGLBMeta);
  const updateCustomGLBTransform = useConfigStore(
    (s) => s.updateCustomGLBTransform
  );
  const toggleCustomGLBMaterialRole = useConfigStore(
    (s) => s.toggleCustomGLBMaterialRole
  );
  const toggleCustomGLBMeshVisibility = useConfigStore(
    (s) => s.toggleCustomGLBMeshVisibility
  );
  const saveCurrentGLBModelToCatalog = useConfigStore(
    (s) => s.saveCurrentGLBModelToCatalog
  );
  const selectSavedGLBModel = useConfigStore((s) => s.selectSavedGLBModel);
  const deleteSavedGLBModel = useConfigStore((s) => s.deleteSavedGLBModel);
  const setTutorialModalOpen = useConfigStore((s) => s.setTutorialModalOpen);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const cleanName = file.name
      .replace(/\.(glb|gltf)$/i, '')
      .replace(/[-_]/g, ' ');

    setCustomImportedGLB({
      objectUrl,
      rawBlob: file,
      fileName: file.name,
      customName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      category: 'Importado (GLB)',
      basePrice: 950000,
      specs: {
        powerHp: 620,
        acceleration0to100: 3.1,
        topSpeedKmh: 325,
        drivetrain: 'AWD / RWD Custom',
        engineType: 'Motorização Custom GLB',
      },
      scale: 1,
      positionY: 0,
      rotationY: 0,
      detectedMaterials: [],
      detectedMeshes: [],
      selectedBodyMaterials: [],
      selectedWheelMaterials: [],
      selectedInteriorMaterials: [],
      hiddenMeshes: [],
    });

    e.target.value = '';
  };

  const handleSaveModel = async () => {
    if (!customImportedGLB) return;
    setIsSaving(true);
    try {
      await saveCurrentGLBModelToCatalog();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Importar & Salvar Modelos (.GLB)
        </h3>
        <p className="text-xs text-showroom-muted mt-0.5">
          Traga seus arquivos .GLB, configure materiais/escala e salve-os
          permanentemente no catálogo do navegador (IndexedDB).
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-showroom-border hover:border-showroom-accent rounded-2xl p-4 text-center bg-showroom-card/40 hover:bg-showroom-card transition-all"
      >
        <UploadCloud className="w-7 h-7 text-showroom-accent mx-auto mb-1.5" />
        <div className="text-xs font-semibold text-white">
          Carregar Novo Arquivo .GLB / .GLTF
        </div>
        <p className="text-[11px] text-showroom-muted mt-0.5">
          Clique para escolher um veículo 3D do seu computador
        </p>
      </div>

      {/* Lista de Modelos .GLB Já Salvos no Navegador */}
      {savedGLBModels.length > 0 && (
        <div className="bg-showroom-card/70 border border-showroom-border rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <HardDriveDownload className="w-3.5 h-3.5 text-showroom-accent" />
              Meus Modelos .GLB Salvos ({savedGLBModels.length})
            </span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {savedGLBModels.map((model) => {
              const isCurrent = customImportedGLB?.savedModelId === model.id;
              return (
                <div
                  key={model.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isCurrent
                      ? 'bg-showroom-panel border-showroom-accent shadow-neon-red'
                      : 'bg-black/30 border-white/10 hover:border-white/25'
                  }`}
                >
                  <button
                    onClick={() => selectSavedGLBModel(model.id)}
                    className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-showroom-accent/15 border border-showroom-accent/30 flex items-center justify-center shrink-0">
                      <CarFront className="w-4 h-4 text-showroom-accent" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">
                        {model.name}
                      </div>
                      <div className="text-[10px] text-showroom-muted truncate">
                        {model.category} • {formatCurrency(model.basePrice)}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {isCurrent && (
                      <span className="p-1 rounded-full bg-showroom-accent text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <button
                      onClick={() => deleteSavedGLBModel(model.id)}
                      className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400"
                      title="Excluir este modelo GLB salvo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {customImportedGLB && (
        <div className="space-y-4">
          {/* Card de Identificação e Salvamento no Catálogo */}
          <div className="bg-showroom-card border border-showroom-accent/50 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                  {customImportedGLB.savedModelId
                    ? 'Modelo Salvo no Catálogo'
                    : 'Novo Modelo Carregado'}
                </div>
                <div className="text-xs font-medium text-showroom-muted truncate max-w-[200px]">
                  Arquivo: {customImportedGLB.fileName}
                </div>
              </div>
              <button
                onClick={() => setCustomImportedGLB(null)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-showroom-muted hover:text-white"
              >
                Fechar GLB
              </button>
            </div>

            {/* Nome e Categoria do Carro */}
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] text-showroom-muted mb-1">
                  Nome do Veículo no Catálogo
                </label>
                <input
                  type="text"
                  value={customImportedGLB.customName}
                  onChange={(e) =>
                    updateCustomGLBMeta({ customName: e.target.value })
                  }
                  placeholder="Ex: Porsche 911 GT3 RS"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-showroom-border text-xs text-white focus:outline-none focus:border-showroom-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-showroom-muted mb-1">
                    Categoria
                  </label>
                  <select
                    value={customImportedGLB.category}
                    onChange={(e) =>
                      updateCustomGLBMeta({
                        category: e.target.value as Vehicle['category'],
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-showroom-border text-xs text-white focus:outline-none focus:border-showroom-accent"
                  >
                    <option value="Importado (GLB)">Importado (GLB)</option>
                    <option value="Coupé Esportivo">Coupé Esportivo</option>
                    <option value="SUV Premium">SUV Premium</option>
                    <option value="Superesportivo">Superesportivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-showroom-muted mb-1">
                    Preço Base (R$)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={customImportedGLB.basePrice}
                    onChange={(e) =>
                      updateCustomGLBMeta({
                        basePrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-showroom-border text-xs text-white focus:outline-none focus:border-showroom-accent"
                  />
                </div>
              </div>

              {/* Especificações Técnicas Demonstrativas */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-showroom-muted mb-1">
                    Potência (cv)
                  </label>
                  <input
                    type="number"
                    value={customImportedGLB.specs.powerHp}
                    onChange={(e) =>
                      updateCustomGLBMeta({
                        specs: {
                          ...customImportedGLB.specs,
                          powerHp: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-2 py-1 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-showroom-muted mb-1">
                    0-100 (s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customImportedGLB.specs.acceleration0to100}
                    onChange={(e) =>
                      updateCustomGLBMeta({
                        specs: {
                          ...customImportedGLB.specs,
                          acceleration0to100: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-2 py-1 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-showroom-muted mb-1">
                    Vel. Máx (km/h)
                  </label>
                  <input
                    type="number"
                    value={customImportedGLB.specs.topSpeedKmh}
                    onChange={(e) =>
                      updateCustomGLBMeta({
                        specs: {
                          ...customImportedGLB.specs,
                          topSpeedKmh: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-2 py-1 rounded-lg bg-black/40 border border-showroom-border text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveModel}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-showroom-accent hover:bg-showroom-accentHover text-white text-xs font-semibold shadow-neon-red transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSaving
                  ? 'Salvando no Catálogo...'
                  : customImportedGLB.savedModelId
                  ? 'Atualizar Modelo .GLB Salvo'
                  : 'Salvar Modelo .GLB no Catálogo'}
              </span>
            </button>
          </div>

          {/* Ajustes de Escala, Posição e Orientação */}
          <div className="bg-showroom-card border border-showroom-border rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Sliders className="w-3.5 h-3.5 text-showroom-accent" />
              <span>Escala, Altura e Orientação</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">
                  Multiplicador de Escala
                </span>
                <span className="text-white font-mono">
                  {customImportedGLB.scale.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.05"
                value={customImportedGLB.scale}
                onChange={(e) =>
                  updateCustomGLBTransform({
                    scale: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-showroom-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">
                  Altura no Piso (Eixo Y)
                </span>
                <span className="text-white font-mono">
                  {customImportedGLB.positionY.toFixed(2)}m
                </span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.02"
                value={customImportedGLB.positionY}
                onChange={(e) =>
                  updateCustomGLBTransform({
                    positionY: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-showroom-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-showroom-muted">Rotação (Graus)</span>
                <span className="text-white font-mono">
                  {customImportedGLB.rotationY}°
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={customImportedGLB.rotationY}
                onChange={(e) =>
                  updateCustomGLBTransform({
                    rotationY: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-showroom-accent"
              />
            </div>
          </div>

          {/* Mapeador de Materiais Detectados */}
          <div className="bg-showroom-card border border-showroom-border rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Layers className="w-3.5 h-3.5 text-showroom-accent" />
              <span>
                Mapeamento de Materiais (
                {customImportedGLB.detectedMaterials.length})
              </span>
            </div>
            <p className="text-[11px] text-showroom-muted">
              Marque quais materiais do seu GLB devem receber a Pintura, Rodas ou
              Interior (salvo junto com o modelo):
            </p>

            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {customImportedGLB.detectedMaterials.map((matName) => {
                const isBody =
                  customImportedGLB.selectedBodyMaterials.includes(matName);
                const isWheel =
                  customImportedGLB.selectedWheelMaterials.includes(matName);
                const isInterior =
                  customImportedGLB.selectedInteriorMaterials.includes(matName);

                return (
                  <div
                    key={matName}
                    className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2 text-[11px]"
                  >
                    <span className="text-slate-200 truncate font-mono">
                      {matName}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          toggleCustomGLBMaterialRole('body', matName)
                        }
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          isBody
                            ? 'bg-showroom-accent text-white'
                            : 'bg-white/5 text-showroom-muted'
                        }`}
                      >
                        Pintura
                      </button>
                      <button
                        onClick={() =>
                          toggleCustomGLBMaterialRole('wheel', matName)
                        }
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          isWheel
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-showroom-muted'
                        }`}
                      >
                        Roda
                      </button>
                      <button
                        onClick={() =>
                          toggleCustomGLBMaterialRole('interior', matName)
                        }
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          isInterior
                            ? 'bg-amber-600 text-white'
                            : 'bg-white/5 text-showroom-muted'
                        }`}
                      >
                        Interior
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspetor de Malhas (Ativar/Desativar Peças/Acessórios do GLB) */}
          {customImportedGLB.detectedMeshes.length > 0 && (
            <div className="bg-showroom-card border border-showroom-border rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-semibold text-white">
                Peças / Malhas 3D ({customImportedGLB.detectedMeshes.length})
              </div>
              <p className="text-[11px] text-showroom-muted">
                Oculte ou exiba peças individuais (ex: aerofólios, rodas,
                acessórios):
              </p>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {customImportedGLB.detectedMeshes.map((meshName) => {
                  const isHidden =
                    customImportedGLB.hiddenMeshes.includes(meshName);
                  return (
                    <button
                      key={meshName}
                      onClick={() => toggleCustomGLBMeshVisibility(meshName)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-[11px]"
                    >
                      <span
                        className={`truncate font-mono ${
                          isHidden
                            ? 'line-through text-showroom-muted'
                            : 'text-slate-200'
                        }`}
                      >
                        {meshName}
                      </span>
                      {isHidden ? (
                        <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setTutorialModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300"
      >
        <BookOpen className="w-4 h-4 text-showroom-accent" />
        <span>Abrir Guia Completo de Modelos GLB & Blender</span>
      </button>
    </div>
  );
};
