'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Trash2, Plus, Minus, ShoppingBag,
  ArrowLeft, Leaf, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCart, saveCart, removeFromCart, clearCart, calculateTotalCarbon } from '@/lib/storage';
import { CartItem, MATERIALS } from '@/lib/types';
import CarbonMeter from '@/components/eco/carbon-meter';
import SustainabilityBadge from '@/components/eco/sustainability-badge';
import { toast } from 'sonner';

export default function CarrinhoContent() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = () => {
    setCart(getCart() ?? []);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = (cart ?? []).map((item: CartItem) => {
      if (item?.product?.id === productId) {
        const newQty = Math.max(1, (item?.quantity ?? 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(newCart);
    setCart(newCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    loadCart();
    window.dispatchEvent(new Event('cart-updated'));
    toast.success('Item removido do carrinho');
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
    window.dispatchEvent(new Event('cart-updated'));
    toast.success('Carrinho limpo');
  };

  const totalPrice = (cart ?? []).reduce((acc: number, item: CartItem) => {
    return acc + (item?.product?.price ?? 0) * (item?.quantity ?? 0);
  }, 0);

  const totalItems = (cart ?? []).reduce((acc: number, item: CartItem) => acc + (item?.quantity ?? 0), 0);
  const totalCarbon = calculateTotalCarbon(cart);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          Carrinho <span className="text-primary">Sustentavel</span>
        </h1>
        <p className="text-muted-foreground">Acompanhe o impacto ambiental das suas escolhas</p>
      </motion.div>

      {(cart?.length ?? 0) === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <ShoppingCart className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Seu carrinho esta vazio</h2>
          <p className="text-muted-foreground mb-6">Explore nosso catalogo de moda sustentavel</p>
          <Link href="/catalogo">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Ir para o Catalogo
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{totalItems} ite{totalItems !== 1 ? 'ns' : 'm'} no carrinho</p>
              <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={handleClear}>
                <Trash2 className="h-3 w-3" /> Limpar
              </Button>
            </div>

            <AnimatePresence>
              {(cart ?? []).map((item: CartItem, i: number) => (
                <motion.div
                  key={item?.product?.id ?? i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item?.product?.image ? (
                            <Image
                              src={item.product.image}
                              alt={item?.product?.name ?? 'Produto'}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{item?.product?.name ?? 'Produto'}</h3>
                          <p className="text-xs text-muted-foreground">
                            {item?.product?.supplier ?? ''} | {MATERIALS?.[item?.product?.material ?? '']?.label ?? ''}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <SustainabilityBadge score={item?.product?.sustainabilityScore ?? 0} size="sm" showLabel={false} />
                            <span className="text-xs text-muted-foreground font-mono">
                              CO2: {item?.product?.carbonFootprint ?? 0}kg/un
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item?.product?.id ?? '', -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-mono font-semibold w-8 text-center text-foreground">{item?.quantity ?? 1}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item?.product?.id ?? '', 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-primary font-mono">
                                R$ {((item?.product?.price ?? 0) * (item?.quantity ?? 1))?.toFixed?.(2)?.replace?.('.', ',')}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleRemove(item?.product?.id ?? '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link href="/catalogo">
              <Button variant="ghost" className="gap-2 mt-4">
                <ArrowLeft className="h-4 w-4" /> Continuar Comprando
              </Button>
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Carbon Meter */}
            <CarbonMeter totalCarbon={totalCarbon} itemCount={totalItems} />

            {/* Order Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Resumo do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} ite{totalItems !== 1 ? 'ns' : 'm'})</span>
                    <span className="font-mono text-foreground">R$ {totalPrice?.toFixed?.(2)?.replace?.('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1"><Leaf className="h-3 w-3" /> Desconto eco</span>
                    <span className="font-mono">- R$ {(totalPrice * 0.05)?.toFixed?.(2)?.replace?.('.', ',')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="font-mono text-primary">R$ {(totalPrice * 0.95)?.toFixed?.(2)?.replace?.('.', ',')}</span>
                  </div>
                </div>
                <Button className="w-full gap-2 mt-2" size="lg" onClick={() => toast.success('Demonstracao academica - pedido simulado!')}>
                  <ShoppingBag className="h-5 w-5" />
                  Finalizar Pedido
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  *Projeto demonstrativo PEI - sem transacao real
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
