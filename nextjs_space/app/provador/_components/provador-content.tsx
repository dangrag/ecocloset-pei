'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Upload, Camera, RotateCcw, ZoomIn, ZoomOut,
  Move, Shirt, ChevronLeft, ChevronRight, Download, Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getProducts, saveProducts } from '@/lib/storage';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Product } from '@/lib/types';
import SustainabilityBadge from '@/components/eco/sustainability-badge';
import { toast } from 'sonner';

export default function ProvadorContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [overlayScale, setOverlayScale] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(85);
  const [overlayX, setOverlayX] = useState(50);
  const [overlayY, setOverlayY] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let prods = getProducts();
    if ((prods?.length ?? 0) === 0) {
      saveProducts(SEED_PRODUCTS);
      prods = SEED_PRODUCTS;
    }
    setProducts(prods ?? []);
  }, []);

  const selectedProduct = products?.[selectedIdx] ?? null;

  const handleUserImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      setUserImage(ev?.target?.result ?? null);
      toast.success('Foto carregada! Agora ajuste a roupa.');
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = canvasContainerRef?.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dx = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;
    setOverlayX((prev: number) => Math.max(0, Math.min(100, (prev ?? 50) + dx)));
    setOverlayY((prev: number) => Math.max(0, Math.min(100, (prev ?? 30) + dy)));
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e?.touches?.[0];
    if (!touch) return;
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e?.touches?.[0];
    if (!touch) return;
    const container = canvasContainerRef?.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dx = ((touch.clientX - dragStartRef.current.x) / rect.width) * 100;
    const dy = ((touch.clientY - dragStartRef.current.y) / rect.height) * 100;
    setOverlayX((prev: number) => Math.max(0, Math.min(100, (prev ?? 50) + dx)));
    setOverlayY((prev: number) => Math.max(0, Math.min(100, (prev ?? 30) + dy)));
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, [isDragging]);

  const resetPosition = () => {
    setOverlayScale(50);
    setOverlayOpacity(85);
    setOverlayX(50);
    setOverlayY(30);
  };

  const downloadResult = () => {
    const container = canvasContainerRef?.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 800;

    const bgImg = new window.Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      if (selectedProduct?.image) {
        const overlayImg = new window.Image();
        overlayImg.crossOrigin = 'anonymous';
        overlayImg.onload = () => {
          const scale = (overlayScale ?? 50) / 100;
          const w = canvas.width * scale;
          const h = w;
          const x = ((overlayX ?? 50) / 100) * canvas.width - w / 2;
          const y = ((overlayY ?? 30) / 100) * canvas.height - h / 2;
          ctx.globalAlpha = (overlayOpacity ?? 85) / 100;
          ctx.drawImage(overlayImg, x, y, w, h);
          ctx.globalAlpha = 1;

          const link = document.createElement('a');
          link.download = 'ecocloset-provador.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          toast.success('Imagem salva!');
        };
        overlayImg.src = selectedProduct.image;
      }
    };
    bgImg.src = userImage ?? '';
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          Provador <span className="text-primary">Virtual</span>
        </h1>
        <p className="text-muted-foreground">
          Envie sua foto e experimente as roupas virtualmente. Arraste para posicionar a peca.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              {!userImage ? (
                <label className="cursor-pointer">
                  <div className="aspect-[3/4] bg-muted/50 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="h-10 w-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground text-lg">Envie sua foto</p>
                      <p className="text-sm text-muted-foreground mt-1">Clique ou arraste uma foto para comecar</p>
                      <p className="text-xs text-muted-foreground mt-1">Recomendado: foto de corpo inteiro</p>
                    </div>
                    <span className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                      <Upload className="h-4 w-4" />
                      Selecionar Foto
                    </span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUserImageUpload} id="user-photo-upload" />
                </label>
              ) : (
                <div>
                  <div
                    ref={canvasContainerRef}
                    className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden select-none"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                  >
                    {/* User photo */}
                    <Image
                      src={userImage}
                      alt="Sua foto"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />

                    {/* Clothing overlay */}
                    {selectedProduct?.image && (
                      <div
                        className="absolute cursor-grab active:cursor-grabbing"
                        style={{
                          left: `${overlayX ?? 50}%`,
                          top: `${overlayY ?? 30}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${overlayScale ?? 50}%`,
                          opacity: (overlayOpacity ?? 85) / 100,
                          zIndex: 10,
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={selectedProduct.image}
                            alt={selectedProduct?.name ?? 'Roupa'}
                            fill
                            className="object-contain drop-shadow-xl pointer-events-none"
                            sizes="400px"
                          />
                        </div>
                      </div>
                    )}

                    {/* Drag hint */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Move className="h-3 w-3" />
                      Arraste a roupa para posicionar
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs flex items-center gap-1">
                          <ZoomIn className="h-3 w-3" /> Tamanho
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">{overlayScale}%</span>
                      </div>
                      <Slider
                        value={[overlayScale]}
                        onValueChange={(v: number[]) => setOverlayScale(v?.[0] ?? 50)}
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs">Opacidade</Label>
                        <span className="text-xs font-mono text-muted-foreground">{overlayOpacity}%</span>
                      </div>
                      <Slider
                        value={[overlayOpacity]}
                        onValueChange={(v: number[]) => setOverlayOpacity(v?.[0] ?? 85)}
                        min={20}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={resetPosition}>
                        <RotateCcw className="h-3 w-3" /> Resetar
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" onClick={downloadResult}>
                        <Download className="h-3 w-3" /> Salvar
                      </Button>
                      <label className="cursor-pointer">
                        <Button variant="outline" size="sm" className="gap-1 pointer-events-none">
                          <Upload className="h-3 w-3" /> Trocar Foto
                        </Button>
                        <input type="file" accept="image/*" className="hidden" onChange={handleUserImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Selector */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shirt className="h-5 w-5 text-primary" />
                Escolha a Peca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {(products ?? []).map((product: Product, i: number) => (
                  <button
                    key={product?.id ?? i}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedIdx === i
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedIdx(i)}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {product?.image ? (
                          <Image
                            src={product.image}
                            alt={product?.name ?? 'Produto'}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Shirt className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{product?.name ?? ''}</p>
                        <p className="text-xs text-muted-foreground">{product?.supplier ?? ''}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <SustainabilityBadge score={product?.sustainabilityScore ?? 0} size="sm" showLabel={false} />
                          <span className="text-xs font-mono text-primary font-semibold">
                            R$ {(product?.price ?? 0)?.toFixed?.(2)?.replace?.('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {(products?.length ?? 0) === 0 && (
                <div className="text-center py-8">
                  <Shirt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhum produto cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
