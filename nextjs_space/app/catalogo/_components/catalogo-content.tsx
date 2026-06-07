'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingCart, Leaf, MapPin, Package, SlidersHorizontal, X, Truck, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProducts, addToCart, saveProducts, getSuppliers, getSupplierById } from '@/lib/storage';
import { withBasePath } from '@/lib/get-base-path';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Product, Supplier, CATEGORIES, MATERIALS, TRANSPORT_EMISSION_FACTORS } from '@/lib/types';
import SustainabilityBadge, { LocalSupplierBadge } from '@/components/eco/sustainability-badge';
import { toast } from 'sonner';

export default function CatalogoContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [localOnly, setLocalOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let prods = getProducts();
    if ((prods?.length ?? 0) === 0) {
      saveProducts(SEED_PRODUCTS);
      prods = SEED_PRODUCTS;
    }
    setProducts(prods ?? []);
    // initialize suppliers in localStorage
    getSuppliers();
  }, []);

  const filtered = useMemo(() => {
    let result = [...(products ?? [])];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter((p: Product) =>
        (p?.name ?? '').toLowerCase().includes(s) ||
        (p?.supplier ?? '').toLowerCase().includes(s) ||
        (p?.category ?? '').toLowerCase().includes(s)
      );
    }

    if (category !== 'all') {
      result = result.filter((p: Product) => p?.category === category);
    }

    if (materialFilter !== 'all') {
      result = result.filter((p: Product) => p?.material === materialFilter);
    }

    if (localOnly) {
      result = result.filter((p: Product) => p?.isLocal === true);
    }

    result.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-asc': return (a?.price ?? 0) - (b?.price ?? 0);
        case 'price-desc': return (b?.price ?? 0) - (a?.price ?? 0);
        case 'sustainability': return (b?.sustainabilityScore ?? 0) - (a?.sustainabilityScore ?? 0);
        case 'carbon': return (a?.carbonFootprint ?? 0) - (b?.carbonFootprint ?? 0);
        default: return (a?.name ?? '').localeCompare(b?.name ?? '');
      }
    });

    return result;
  }, [products, search, category, materialFilter, localOnly, sortBy]);

  const handleAddToCart = (product: Product) => {
    if ((product?.quantity ?? 0) <= 0) {
      toast.error('Produto sem estoque');
      return;
    }
    addToCart(product, 1);
    window.dispatchEvent(new Event('cart-updated'));
    toast.success(`${product?.name ?? 'Produto'} adicionado ao carrinho!`);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          Catalogo <span className="text-primary">Sustentavel</span>
        </h1>
        <p className="text-muted-foreground">Explore pecas com materiais ecologicos e fornecedores responsaveis</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos, fornecedores..."
              value={search}
              onChange={(e: any) => setSearch(e?.target?.value ?? '')}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg bg-muted/50">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Categoria</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {CATEGORIES.map((c: string) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Material</label>
                  <Select value={materialFilter} onValueChange={setMaterialFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Object.entries(MATERIALS ?? {}).map(([key, val]: [string, any]) => (
                        <SelectItem key={key} value={key}>{val?.label ?? key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Ordenar</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="price-asc">Menor Preco</SelectItem>
                      <SelectItem value="price-desc">Maior Preco</SelectItem>
                      <SelectItem value="sustainability">Sustentabilidade</SelectItem>
                      <SelectItem value="carbon">Menor Carbono</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant={localOnly ? 'default' : 'outline'}
                    className="w-full gap-2"
                    onClick={() => setLocalOnly(!localOnly)}
                  >
                    <MapPin className="h-4 w-4" />
                    {localOnly ? 'Somente Locais' : 'Fornecedor Local'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters */}
        {(category !== 'all' || materialFilter !== 'all' || localOnly || search) && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSearch('')}>
                Busca: {search} <X className="h-3 w-3" />
              </Badge>
            )}
            {category !== 'all' && (
              <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setCategory('all')}>
                {category} <X className="h-3 w-3" />
              </Badge>
            )}
            {materialFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setMaterialFilter('all')}>
                {MATERIALS?.[materialFilter]?.label ?? materialFilter} <X className="h-3 w-3" />
              </Badge>
            )}
            {localOnly && (
              <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setLocalOnly(false)}>
                Local <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered?.length ?? 0} produto{(filtered?.length ?? 0) !== 1 ? 's' : ''} encontrado{(filtered?.length ?? 0) !== 1 ? 's' : ''}
      </p>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(filtered ?? []).map((product: Product, i: number) => (
          <motion.div
            key={product?.id ?? i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
          >
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={withBasePath(product?.image ?? '/products/tshirt.jpg')}
                  alt={product?.name ?? 'Produto'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <SustainabilityBadge score={product?.sustainabilityScore ?? 0} size="sm" showLabel={false} />
                  {product?.isLocal && <LocalSupplierBadge />}
                </div>
                {(product?.quantity ?? 0) <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold px-4 py-2 rounded-lg bg-red-600">Esgotado</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{product?.name ?? 'Produto'}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product?.description ?? ''}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{product?.supplier ?? ''} - {product?.supplierCity ?? ''}</span>
                  </div>
                  {(() => {
                    const sup = getSupplierById(product?.supplierId ?? '');
                    return sup ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {sup.distanceKm} km | {TRANSPORT_EMISSION_FACTORS[sup.transportType]?.icon ?? ''} {TRANSPORT_EMISSION_FACTORS[sup.transportType]?.label ?? sup.transportType}
                        </span>
                      </div>
                    ) : null;
                  })()}
                  <div className="flex items-center gap-2 mt-1">
                    <Leaf className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{MATERIALS?.[product?.material ?? '']?.label ?? product?.material ?? ''}</span>
                  </div>
                  {(product?.shippingCarbon ?? 0) > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <TreePine className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        Frete: {(product?.shippingCarbon ?? 0).toFixed(1)} kg CO2
                      </span>
                    </div>
                  )}
                  {(product?.shippingCarbon ?? 0) === 0 && product?.isLocal && (
                    <div className="flex items-center gap-2 mt-1">
                      <TreePine className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        Frete carbono zero!
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Tamanho: {product?.size ?? '-'} | Estoque: {product?.quantity ?? 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="font-bold text-primary font-mono text-lg">
                    R$ {(product?.price ?? 0)?.toFixed?.(2)?.replace?.('.', ',')}
                  </span>
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAddToCart(product)}
                    disabled={(product?.quantity ?? 0) <= 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {(filtered?.length ?? 0) === 0 && (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-foreground">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mt-1">Tente ajustar os filtros ou termos de busca</p>
        </div>
      )}
    </div>
  );
}
