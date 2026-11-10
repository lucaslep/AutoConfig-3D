# AutoConfig 3D — Showroom & Configurador Automotivo Interativo

Aplicação web interativa 3D de nível produção inspirada nos configuradores de montadoras premium, desenvolvida com **React 18**, **TypeScript**, **Three.js**, **React Three Fiber**, **Drei**, **Zustand**, **Tailwind CSS** e **Framer Motion**.

---

## Funcionalidades Principais

- **Visualizador 3D em Tempo Real (WebGL / Three.js)**:
  - Rotação orbital livre em 360°, controle de zoom e iluminação cinematográfica de showroom.
  - Predefinições suaves de câmera: **360° Livre**, **Frontal**, **Traseira**, **Lateral** e **Cockpit (Interior)** + modo **Auto-Giro**.
- **Catálogo Multi-Veículos Escalável**:
  - 3 arquétipos demonstrativos inclusos prontos para uso: **Apex GT-S Coupé** (Coupé Esportivo), **Titan V8 Prime SUV** (SUV Premium) e **Vortex X1 Hypercar** (Superesportivo).
- **Pintura Automotiva PBR (Physically Based Rendering)**:
  - 7 cores de fábrica (Vermelho Metálico, Preto Fosco, Branco Perolizado, Azul Metálico, Cinza Grafite, Amarelo Racing e Verde Escuro).
  - Laboratório PBR em tempo real para controlar `Cor (HEX)`, `Metalness`, `Roughness` e `Clearcoat` exclusivamente na lataria (preservando vidros, faróis e pneus).
- **Personalização de Rodas, Interior e Acessórios**:
  - 4 designs tridimensionais de rodas (`Esportivas`, `Premium`, `Pretas`, `Competição Center-Lock`).
  - 4 pacotes de acabamento interno (`Couro Preto`, `Couro Bege`, `Preto com Vermelho`, `Interior Premium`) com câmera dedicada de cockpit.
  - 5 acessórios ativáveis em 3D (`Aerofólio Traseiro`, `Spoiler Dianteiro`, `Saias Laterais`, `Teto Panorâmico`, `Acabamentos Esportivos`) respeitando a compatibilidade de cada veículo.
- **Importador de Modelos 3D (.GLB / .GLTF) + Inspetor de Materiais**:
  - Permite importar qualquer veículo `.glb`/`.gltf` diretamente pelo navegador, ajustar escala/altura/rotação e mapear quais materiais correspondem à pintura, rodas e interior, além de ocultar/exibir peças individuais.
- **Precificação Dinâmica & Garagem Persistente**:
  - Cálculo em tempo real (`Base + Pintura + Rodas + Interior + Acessórios`).
  - Salvamento, carregamento, edição e exclusão de configurações via `LocalStorage` com camada `storageService` pronta para **Supabase**.

---

## Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```
