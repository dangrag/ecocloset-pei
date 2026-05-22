export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  supplier: string;
  supplierCity: string;
  supplierId: string;
  isLocal: boolean;
  material: string;
  sustainabilityScore: number;
  carbonFootprint: number;
  shippingCarbon: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  distanceKm: number;
  isLocal: boolean;
  transportType: string;
  certifications: string[];
  sustainabilityScore: number;
}

export const MATERIALS: Record<string, { score: number; carbon: number; label: string }> = {
  'algodao-organico': { score: 9, carbon: 2.1, label: 'Algodao Organico' },
  'poliester-reciclado': { score: 8, carbon: 3.5, label: 'Poliester Reciclado' },
  'linho': { score: 9, carbon: 1.8, label: 'Linho' },
  'bambu': { score: 8, carbon: 2.0, label: 'Bambu' },
  'canhamo': { score: 10, carbon: 1.5, label: 'Canhamo' },
  'tencel': { score: 8, carbon: 2.3, label: 'Tencel/Lyocell' },
  'algodao-convencional': { score: 4, carbon: 5.9, label: 'Algodao Convencional' },
  'poliester': { score: 2, carbon: 9.5, label: 'Poliester Virgem' },
  'nylon': { score: 3, carbon: 7.2, label: 'Nylon' },
  'viscose': { score: 5, carbon: 4.0, label: 'Viscose' },
};

export const CATEGORIES = [
  'Camiseta', 'Calca', 'Vestido', 'Moletom', 'Polo', 'Jaqueta', 'Blusa', 'Shorts', 'Saia', 'Outro'
];

export const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

// Fator de emissao de CO2 por km por tipo de transporte (kg CO2/km)
export const TRANSPORT_EMISSION_FACTORS: Record<string, { factor: number; label: string; icon: string }> = {
  'bicicleta': { factor: 0.0, label: 'Bicicleta / Carga Leve', icon: '🚲' },
  'van-eletrica': { factor: 0.05, label: 'Van Eletrica', icon: '🔋' },
  'caminhao': { factor: 0.21, label: 'Caminhao (diesel)', icon: '🚛' },
  'carreta': { factor: 0.35, label: 'Carreta / Longa Distancia', icon: '🚚' },
};

// Cidade base do sistema (Sao Paulo - centro)
export const STORE_LOCATION = {
  city: 'Sao Paulo',
  state: 'SP',
  label: 'Loja EcoCloset - Sao Paulo, SP',
};

export const SEED_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'EcoTextil Brasil',
    address: 'Rua Oscar Freire, 900 - Jardins',
    city: 'Sao Paulo',
    state: 'SP',
    cep: '01426-001',
    distanceKm: 8,
    isLocal: true,
    transportType: 'bicicleta',
    certifications: ['GOTS', 'Fair Trade', 'ABVTEX'],
    sustainabilityScore: 10,
  },
  {
    id: 'sup-2',
    name: 'Linho & Arte',
    address: 'Av. Paulista, 1578 - Bela Vista',
    city: 'Sao Paulo',
    state: 'SP',
    cep: '01310-200',
    distanceKm: 5,
    isLocal: true,
    transportType: 'bicicleta',
    certifications: ['OEKO-TEX', 'Carbon Neutral'],
    sustainabilityScore: 9,
  },
  {
    id: 'sup-3',
    name: 'Jeans Circular',
    address: 'Rua da Bahia, 1234 - Centro',
    city: 'Belo Horizonte',
    state: 'MG',
    cep: '30160-011',
    distanceKm: 586,
    isLocal: false,
    transportType: 'caminhao',
    certifications: ['ISO 14001', 'Cradle to Cradle'],
    sustainabilityScore: 7,
  },
  {
    id: 'sup-4',
    name: 'BambuWear',
    address: 'Rua XV de Novembro, 300 - Centro',
    city: 'Curitiba',
    state: 'PR',
    cep: '80020-310',
    distanceKm: 408,
    isLocal: false,
    transportType: 'caminhao',
    certifications: ['FSC', 'B Corp'],
    sustainabilityScore: 8,
  },
  {
    id: 'sup-5',
    name: 'ReciclaFashion',
    address: 'Av. Borges de Medeiros, 2500 - Praia de Belas',
    city: 'Porto Alegre',
    state: 'RS',
    cep: '90110-150',
    distanceKm: 1109,
    isLocal: false,
    transportType: 'carreta',
    certifications: ['GRS', 'Selo Procel'],
    sustainabilityScore: 7,
  },
  {
    id: 'sup-6',
    name: 'Hemp Brasil',
    address: 'Rua Felipe Schmidt, 515 - Centro',
    city: 'Florianopolis',
    state: 'SC',
    cep: '88010-001',
    distanceKm: 705,
    isLocal: false,
    transportType: 'caminhao',
    certifications: ['Organico Brasil', 'EU Ecolabel'],
    sustainabilityScore: 9,
  },
  {
    id: 'sup-7',
    name: 'VerdeVida Textil',
    address: 'Rua Augusta, 2023 - Consolacao',
    city: 'Sao Paulo',
    state: 'SP',
    cep: '01413-000',
    distanceKm: 3,
    isLocal: true,
    transportType: 'bicicleta',
    certifications: ['GOTS', 'OEKO-TEX', 'B Corp'],
    sustainabilityScore: 10,
  },
  {
    id: 'sup-8',
    name: 'Nativa Eco Texteis',
    address: 'Rua Sete de Setembro, 1200 - Centro',
    city: 'Campinas',
    state: 'SP',
    cep: '13010-131',
    distanceKm: 99,
    isLocal: true,
    transportType: 'van-eletrica',
    certifications: ['ABNT Sustentavel', 'Fair Trade'],
    sustainabilityScore: 8,
  },
];

// Calcula o CO2 de frete baseado na distancia e tipo de transporte
export function calculateShippingCarbon(distanceKm: number, transportType: string): number {
  const factor = TRANSPORT_EMISSION_FACTORS[transportType]?.factor ?? 0.21;
  return Math.round(distanceKm * factor * 100) / 100;
}
