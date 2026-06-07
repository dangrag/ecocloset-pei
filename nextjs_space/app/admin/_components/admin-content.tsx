'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Package, Save, X, Upload,
  Leaf, MapPin, BarChart3, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getProducts, saveProducts, addProduct, updateProduct, deleteProduct, getSuppliers } from '@/lib/storage';
import { withBasePath } from '@/lib/get-base-path';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Product, Supplier, MATERIALS, CATEGORIES, SIZES, SEED_SUPPLIERS, TRANSPORT_EMISSION_FACTORS, calculateShippingCarbon } from '@/lib/types';
import SustainabilityBadge, { LocalSupplierBadge } from '@/components/eco/sustainability-badge';
import { toast } from 'sonner';

const emptyProduct: Product = {
  id: '',
  name: '',
  description: '',
  image: '',
  size: 'M',
  quantity: 0,
  price: 0,
  supplier: '',
  supplierCity: '',
  supplierId: '',
  isLocal: false,
  material: 'algodao-organico',
  sustainabilityScore: 9,
  carbonFootprint: 2.1,
  shippingCarbon: 0,
  category: 'Camiseta',
};

export default function AdminContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>({ ...emptyProduct });
  const [deletingId, setDeletingId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const loadProducts = useCallback(() => {
    let prods = getProducts();
    if ((prods?.length ?? 0) === 0) {
      saveProducts(SEED_PRODUCTS);
      prods = SEED_PRODUCTS;
    }
    setProducts(prods ?? []);
  }, []);

  useEffect(() => {
    loadProducts();
    const sups = getSuppliers();
    setSuppliers(sups?.length > 0 ? sups : SEED_SUPPLIERS);
  }, [loadProducts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), image: ev?.target?.result ?? '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleMaterialChange = (material: string) => {
    const mat = MATERIALS?.[material];
    setEditingProduct((prev: Product) => ({
      ...(prev ?? emptyProduct),
      material,
      sustainabilityScore: mat?.score ?? 5,
      carbonFootprint: mat?.carbon ?? 5.0,
    }));
  };

  const handleSave = () => {
    const p = editingProduct ?? emptyProduct;
    if (!(p?.name ?? '').trim()) {
      toast.error('Nome do produto e obrigatorio');
      return;
    }
    if (isEditing) {
      updateProduct(p);
      toast.success('Produto atualizado!');
    } else {
      const newProduct = { ...p, id: `prod-${Date.now()}` };
      addProduct(newProduct);
      toast.success('Produto cadastrado!');
    }
    setDialogOpen(false);
    loadProducts();
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteProduct(deletingId);
      toast.success('Produto removido');
      setDeleteDialogOpen(false);
      setDeletingId('');
      loadProducts();
    }
  };

  const openNew = () => {
    setEditingProduct({ ...emptyProduct });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct({ ...(product ?? emptyProduct) });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const totalStock = (products ?? []).reduce((acc: number, p: Product) => acc + (p?.quantity ?? 0), 0);
  const avgScore = (products?.length ?? 0) > 0
    ? ((products ?? []).reduce((acc: number, p: Product) => acc + (p?.sustainabilityScore ?? 0), 0) / (products?.length ?? 1))
    : 0;
  const localCount = (products ?? []).filter((p: Product) => p?.isLocal).length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              Gestao de <span className="text-primary">Estoque</span>
            </h1>
            <p className="text-muted-foreground">Cadastre e gerencie produtos sustentaveis</p>
          </div>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStock}</p>
              <p className="text-xs text-muted-foreground">Pecas em estoque</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgScore?.toFixed?.(1) ?? '0'}/10</p>
              <p className="text-xs text-muted-foreground">Sustentabilidade media</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{localCount}</p>
              <p className="text-xs text-muted-foreground">Fornecedores locais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Foto</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="hidden md:table-cell">Material</TableHead>
                  <TableHead className="hidden sm:table-cell">Tamanho</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="hidden md:table-cell">Preco</TableHead>
                  <TableHead className="hidden lg:table-cell">Score</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(products ?? []).map((product: Product, i: number) => (
                  <TableRow key={product?.id ?? i}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                        {product?.image ? (
                          <Image
                            src={withBasePath(product.image)}
                            alt={product?.name ?? 'Produto'}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{product?.name ?? ''}</p>
                        <p className="text-xs text-muted-foreground">{product?.supplier ?? ''}</p>
                        <div className="flex gap-1 mt-1">
                          {product?.isLocal && <LocalSupplierBadge size="sm" />}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">{MATERIALS?.[product?.material ?? '']?.label ?? product?.material ?? '-'}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{product?.size ?? '-'}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-mono font-semibold ${(product?.quantity ?? 0) <= 5 ? 'text-red-600' : 'text-foreground'}`}>
                        {(product?.quantity ?? 0) <= 5 && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                        {product?.quantity ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono">
                      R$ {(product?.price ?? 0)?.toFixed?.(2)?.replace?.('.', ',')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <SustainabilityBadge score={product?.sustainabilityScore ?? 0} size="sm" showLabel={false} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDelete(product?.id ?? '')}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Nome do Produto *</Label>
                <Input
                  value={editingProduct?.name ?? ''}
                  onChange={(e: any) => setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), name: e?.target?.value ?? '' }))}
                  placeholder="Ex: Camiseta Eco Basica"
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select
                  value={editingProduct?.category ?? 'Camiseta'}
                  onValueChange={(v: string) => setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), category: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Descricao</Label>
              <Textarea
                value={editingProduct?.description ?? ''}
                onChange={(e: any) => setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), description: e?.target?.value ?? '' }))}
                placeholder="Descreva o produto e suas caracteristicas sustentaveis..."
                rows={3}
              />
            </div>

            <div>
              <Label>Imagem do Produto</Label>
              <div className="flex items-center gap-4 mt-1">
                {editingProduct?.image && (
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                    <Image src={withBasePath(editingProduct.image)} alt="Preview" fill className="object-cover" sizes="80px" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Clique para enviar imagem</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Tamanho</Label>
                <Select
                  value={editingProduct?.size ?? 'M'}
                  onValueChange={(v: string) => setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), size: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SIZES.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min={0}
                  value={editingProduct?.quantity ?? 0}
                  onChange={(e: any) => setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), quantity: parseInt(e?.target?.value ?? '0', 10) || 0 }))}
                />
              </div>
              <div>
                <Label>Preco (R$)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={editingProduct?.price ?? 0}
                  onChange={(e: any) => setEditingProduct((prev: Product) => ({ ...(prev ?? emptyProduct), price: parseFloat(e?.target?.value ?? '0') || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label>Fornecedor</Label>
              <Select
                value={editingProduct?.supplierId ?? ''}
                onValueChange={(v: string) => {
                  const sup = suppliers.find((s: Supplier) => s.id === v);
                  if (sup) {
                    setEditingProduct((prev: Product) => ({
                      ...(prev ?? emptyProduct),
                      supplierId: sup.id,
                      supplier: sup.name,
                      supplierCity: sup.city,
                      isLocal: sup.isLocal,
                      shippingCarbon: calculateShippingCarbon(sup.distanceKm, sup.transportType),
                    }));
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="Selecione um fornecedor" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map((s: Supplier) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.isLocal ? '📍 ' : ''}{s.name} - {s.city}/{s.state} ({s.distanceKm} km)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editingProduct?.supplierId && (() => {
                const sup = suppliers.find((s: Supplier) => s.id === editingProduct.supplierId);
                return sup ? (
                  <div className="mt-2 p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                    <p className="text-foreground font-medium">{sup.name}</p>
                    <p className="text-muted-foreground">{sup.address}</p>
                    <p className="text-muted-foreground">{sup.city}/{sup.state} - CEP: {sup.cep}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs">{TRANSPORT_EMISSION_FACTORS[sup.transportType]?.icon} {TRANSPORT_EMISSION_FACTORS[sup.transportType]?.label}</span>
                      <span className="text-xs font-mono">{sup.distanceKm} km</span>
                      {sup.isLocal && <LocalSupplierBadge size="sm" />}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sup.certifications.map((cert: string) => (
                        <Badge key={cert} variant="outline" className="text-xs">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div>
              <Label>Material</Label>
              <Select
                value={editingProduct?.material ?? 'algodao-organico'}
                onValueChange={handleMaterialChange}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(MATERIALS ?? {}).map(([key, val]: [string, any]) => (
                    <SelectItem key={key} value={key}>
                      {val?.label ?? key} (Score: {val?.score ?? 0} | CO2: {val?.carbon ?? 0}kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-4 mt-2">
                <SustainabilityBadge score={editingProduct?.sustainabilityScore ?? 0} size="sm" />
                <span className="text-xs text-muted-foreground font-mono">
                  CO2: {editingProduct?.carbonFootprint ?? 0} kg/peca
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este produto do estoque? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
