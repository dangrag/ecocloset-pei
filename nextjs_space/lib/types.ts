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
  isLocal: boolean;
  material: string;
  sustainabilityScore: number;
  carbonFootprint: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
