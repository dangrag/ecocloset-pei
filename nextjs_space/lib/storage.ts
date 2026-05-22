import { Product, CartItem } from './types';

const PRODUCTS_KEY = 'ecocloset_products';
const CART_KEY = 'ecocloset_cart';

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) ?? [] : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products ?? []));
  } catch (e: any) {
    console.error('Erro ao salvar produtos:', e);
  }
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(product: Product): void {
  const products = getProducts();
  const idx = products.findIndex((p: Product) => p?.id === product?.id);
  if (idx >= 0) {
    products[idx] = product;
    saveProducts(products);
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p: Product) => p?.id !== id);
  saveProducts(products);
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) ?? [] : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart ?? []));
  } catch (e: any) {
    console.error('Erro ao salvar carrinho:', e);
  }
}

export function addToCart(product: Product, qty: number = 1): void {
  const cart = getCart();
  const existing = cart.findIndex((item: CartItem) => item?.product?.id === product?.id);
  if (existing >= 0) {
    cart[existing] = { ...cart[existing], quantity: (cart[existing]?.quantity ?? 0) + qty };
  } else {
    cart.push({ product, quantity: qty });
  }
  saveCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter((item: CartItem) => item?.product?.id !== productId);
  saveCart(cart);
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

export function getCartCount(): number {
  return getCart().reduce((acc: number, item: CartItem) => acc + (item?.quantity ?? 0), 0);
}

export function calculateTotalCarbon(cart: CartItem[]): number {
  return (cart ?? []).reduce((total: number, item: CartItem) => {
    return total + (item?.product?.carbonFootprint ?? 0) * (item?.quantity ?? 0);
  }, 0);
}
