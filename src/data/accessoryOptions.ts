import { AccessoryOption } from '../types/configurator';

export const ACCESSORY_OPTIONS: AccessoryOption[] = [
  {
    id: 'acc-rear-spoiler',
    key: 'spoiler',
    name: 'Aerofólio Traseiro GT',
    description: 'Asa traseira em fibra de carbono para aumento de downforce em alta velocidade.',
    price: 15800,
    category: 'aerodynamics',
  },
  {
    id: 'acc-front-splitter',
    key: 'frontSplitter',
    name: 'Spoiler Dianteiro (Splitter)',
    description: 'Lâmina aerodinâmica frontal com aletas direcionadoras de fluxo.',
    price: 9400,
    category: 'aerodynamics',
  },
  {
    id: 'acc-aero-canards',
    key: 'aeroCanards',
    name: 'Canards Dianteiros de Pista',
    description: 'Aletas duplas laterais no para-choque dianteiro para pressão aerodinâmica no eixo frontal.',
    price: 6800,
    category: 'aerodynamics',
  },
  {
    id: 'acc-side-skirts',
    key: 'sideSkirts',
    name: 'Saias Laterais',
    description: 'Extensões laterais aerodinâmicas em carbono que reduzem a turbulência sob o assoalho.',
    price: 11200,
    category: 'aerodynamics',
  },
  {
    id: 'acc-roof-scoop',
    key: 'roofScoop',
    name: 'Scoop de Teto (Air Intake)',
    description: 'Tomada de ar central no teto estilo Le Mans para resfriamento direto do cofre.',
    price: 13900,
    category: 'aerodynamics',
  },
  {
    id: 'acc-panoramic-roof',
    key: 'panoramicRoof',
    name: 'Teto Panorâmico',
    description: 'Teto em vidro eletrocrômico escurecido com isolamento térmico e UV.',
    price: 17500,
    category: 'roof',
  },
  {
    id: 'acc-roof-rack',
    key: 'roofRack',
    name: 'Rack de Teto Expedition',
    description: 'Barras transversais aerodinâmicas em alumínio anodizado preto com suporte esportivo.',
    price: 8200,
    category: 'roof',
  },
  {
    id: 'acc-sport-trim',
    key: 'sportTrim',
    name: 'Pacote Acabamentos Esportivos',
    description: 'Retrovisores em carbono, difusor traseiro agresivo e detalhes contrastantes.',
    price: 8600,
    category: 'exterior',
  },
  {
    id: 'acc-neon-underglow',
    key: 'underglow',
    name: 'Iluminação LED Underglow',
    description: 'Sistema de projeção de luz de LED RGB sob o chassi refletindo no piso do showroom.',
    price: 5900,
    category: 'exterior',
  },
];

export const ALL_ACCESSORY_IDS = ACCESSORY_OPTIONS.map((a) => a.id);
